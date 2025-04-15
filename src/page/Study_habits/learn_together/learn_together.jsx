import React, { useEffect, useRef, useState } from 'react';
import styles from './learn_together.module.css';
import Icon from '../../../icon/actual.png';
import CallIcon from '../../../icon/Call.png';
import EndcallIcon from '../../../icon/Endcall.png';
import MuteIcon from '../../../icon/Mutemic.png';
import SharescreenIcon from '../../../icon/Sharescreen.png';
import OffcamIcon from '../../../icon/Offcam.png';
import OpencamIcon from '../../../icon/Opencam.png';
import MicIcon from '../../../icon/Mic.png';
import Footer from '../../../Components/composables/Footer';
import Header from '../../../Components/composables/Header';

const WebRTCComponent = () => {
  const [students, setStudents] = useState([]);
  const [ws, setWs] = useState(null);
  const [peerConnections, setPeerConnections] = useState(new Map());
  const [remoteStreams, setRemoteStreams] = useState(new Map()); // Map of studentId to their stream
  const localVideoRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [stream, setStream] = useState(null);
  const [showCallOptions, setShowCallOptions] = useState(true);
  const [callIdInput, setCallIdInput] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [callId, setCallId] = useState(null);
  const [callIdDisplay, setCallIdDisplay] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [speaking, setSpeaking] = useState(new Set()); // Track speaking participants

  // Fetch user from localStorage on mount
  useEffect(() => {
    const userIdNumber = localStorage.getItem('userIdNumber');
    if (userIdNumber) {
      setUser({ id_number: userIdNumber });
      console.log('User fetched from localStorage:', { id_number: userIdNumber });
    } else {
      setError('No user detected. Please log in.');
      console.log('No user found in localStorage');
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (!showCallOptions && !ws && user?.id_number) {
      console.log('Connecting WebSocket for user:', user.id_number);
      const socket = new WebSocket(`ws://localhost:8000/ws/${callId || 'random'}`);
      setWs(socket);

      socket.onopen = () => {
        console.log('WebSocket opened, sending id_number:', user.id_number);
        socket.send(JSON.stringify({ id_number: user.id_number }));
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        if (data.type === 'student_id') {
          setStudentId(data.studentId);
          setCallIdDisplay(data.callId);
        } else if (data.type === 'active_students') {
          setStudents(data.students);
          // Ensure peer connections for new participants
          data.students.forEach((student) => {
            if (student.id !== studentId && !peerConnections.has(student.id)) {
              startCall(student.id);
            }
          });
        } else if (data.type === 'chat') {
          setChatMessages((prev) => [...prev, data.message]);
        } else if (data.type === 'offer') {
          await handleOffer(data.from, data.offer);
        } else if (data.type === 'answer') {
          await handleAnswer(data.from, data.answer);
        } else if (data.type === 'ice-candidate') {
          await handleIceCandidate(data.from, data.candidate);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event.reason);
        setWs(null);
        setStream(null);
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        setRemoteStreams(new Map());
        setPeerConnections(new Map());
        setShowCallOptions(true);
        setCallIdDisplay(null);
        if (event.reason) {
          setError(`Connection closed: ${event.reason}. Please rejoin the meeting.`);
        }
      };

      socket.onerror = () => {
        console.error('WebSocket error');
        setError('WebSocket connection failed. Please check your network and try again.');
      };

      return () => {
        console.log('Cleaning up WebSocket');
        socket.close();
      };
    }
  }, [showCallOptions, callId, user]);

  const initializeMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('Media stream initialized:', mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);

      // Detect speaking (audio levels)
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const detectSpeaking = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        if (average > 30) { // Adjust threshold as needed
          setSpeaking((prev) => new Set(prev).add(studentId));
        } else {
          setSpeaking((prev) => {
            const newSet = new Set(prev);
            newSet.delete(studentId);
            return newSet;
          });
        }
        requestAnimationFrame(detectSpeaking);
      };
      detectSpeaking();

      return mediaStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      if (error.name === 'NotAllowedError') {
        setError('Camera and microphone access denied. Please allow permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera or microphone found. Please connect a device and try again.');
      } else {
        setError(`Failed to access camera/microphone: ${error.message}`);
      }
      return null;
    }
  };

  const createCall = async () => {
    if (!user?.id_number) {
      setError('Please log in to create a call.');
      return;
    }
    console.log('Creating new call');
    setCallId(null);
    setShowCallOptions(false);
    setError(null);
    await initializeMediaStream();
  };

  const joinCall = async () => {
    if (!user?.id_number) {
      setError('Please log in to join a call.');
      return;
    }
    if (callIdInput.trim()) {
      console.log('Joining call with ID:', callIdInput);
      setCallId(callIdInput);
      setShowCallOptions(false);
      setError(null);
      await initializeMediaStream();
    } else {
      setError('Please enter a valid Call ID.');
    }
  };

  const handleOffer = async (from, offer) => {
    try {
      let localStream = stream;
      if (!localStream) {
        localStream = await initializeMediaStream();
        if (!localStream) return;
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add TURN server if available
          // {
          //   urls: 'turn:your-turn-server:3478',
          //   username: 'username',
          //   credential: 'password',
          // },
        ],
      });
      setPeerConnections((prev) => new Map(prev).set(from, pc));

      localStream.getTracks().forEach((track) => {
        console.log('Adding track to PeerConnection:', track);
        pc.addTrack(track, localStream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to:', from);
          ws.send(
            JSON.stringify({
              type: 'ice-candidate',
              target: from,
              candidate: event.candidate,
            })
          );
        }
      };

      pc.ontrack = (event) => {
        console.log('Received remote stream from:', from, event.streams[0]);
        setRemoteStreams((prev) => new Map(prev).set(from, event.streams[0]));
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      ws.send(
        JSON.stringify({
          type: 'answer',
          target: from,
          answer,
        })
      );
    } catch (error) {
      console.error('Error handling offer:', error);
      setError('Failed to establish call. Please try again.');
    }
  };

  const handleAnswer = async (from, answer) => {
    const pc = peerConnections.get(from);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  };

  const handleIceCandidate = async (from, candidate) => {
    const pc = peerConnections.get(from);
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    }
  };

  const startCall = async (targetStudentId) => {
    if (!targetStudentId) return;
    if (peerConnections.has(targetStudentId)) return; // Avoid duplicate connections
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add TURN server if available
        ],
      });
      setPeerConnections((prev) => new Map(prev).set(targetStudentId, pc));

      let localStream = stream;
      if (!localStream) {
        localStream = await initializeMediaStream();
        if (!localStream) return;
      }

      localStream.getTracks().forEach((track) => {
        console.log('Adding track to PeerConnection:', track);
        pc.addTrack(track, localStream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to:', targetStudentId);
          ws.send(
            JSON.stringify({
              type: 'ice-candidate',
              target: targetStudentId,
              candidate: event.candidate,
            })
          );
        }
      };

      pc.ontrack = (event) => {
        console.log('Received remote stream from:', targetStudentId, event.streams[0]);
        setRemoteStreams((prev) => new Map(prev).set(targetStudentId, event.streams[0]));
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      ws.send(
        JSON.stringify({
          type: 'offer',
          target: targetStudentId,
          offer,
        })
      );
    } catch (error) {
      console.error('Error starting call:', error);
      setError('Failed to start call. Please try again.');
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      setStream(screenStream);
      peerConnections.forEach((pc) => {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = pc.getSenders().find((s) => s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
      setError('Failed to share screen. Please try again.');
    }
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    ws.send(JSON.stringify({ type: 'chat', message }));
    setMessage('');
  };

  const endCall = () => {
    if (stream && stream.getTracks) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setRemoteStreams(new Map());
    peerConnections.forEach((pc) => pc.close());
    setPeerConnections(new Map());
    setShowCallOptions(true);
    setCallIdDisplay(null);
    setError(null);
  };

  const leaveMeeting = () => {
    endCall();
    window.location.href = '/'; // Redirect to homepage or desired route
  };

  const toggleMute = () => {
    if (!stream) {
      setError('No stream available to mute/unmute.');
      return;
    }
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setError('No audio tracks available.');
      return;
    }
    audioTracks.forEach((track) => {
      track.enabled = !track.enabled;
      console.log('Audio track enabled:', track.enabled);
    });
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (!stream) {
      setError('No stream available to toggle camera.');
      return;
    }
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) {
      setError('No video tracks available.');
      return;
    }
    videoTracks.forEach((track) => {
      track.enabled = !track.enabled;
      console.log('Video track enabled:', track.enabled);
    });
    setIsCameraOff(!isCameraOff);
  };

  if (showCallOptions) {
    return (
      <div className={styles.container}>
        <Header isStudyHabits={true}></Header>
        <div className={styles.content_wrapper}>
          <div className={styles.callOptions}>
            <h2>Join or Create a Call</h2>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.actionButton} onClick={createCall}>
              Create New Call
            </button>
            <button
              className={styles.actionButton}
              onClick={() => setShowJoinInput(true)}
            >
              Join Existing Call
            </button>
            {showJoinInput && (
              <div className={styles.joinInputContainer}>
                <input
                  type="text"
                  value={callIdInput}
                  onChange={(e) => setCallIdInput(e.target.value)}
                  placeholder="Enter Call ID"
                  className={styles.callIdInput}
                />
                <button className={styles.actionButton} onClick={joinCall}>
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header isStudyHabits={true}></Header>
      <div className={styles.content_wrapper}>
        <div className={styles.content_wrapper_video}>
          <div className={styles.mainContent}>
            <div className={styles.logoContainer}>
              <img src={Icon} alt="actual" className={styles.logo} />
            </div>
            {callIdDisplay && (
              <div className={styles.callIdDisplay}>
                <p>Call ID: {callIdDisplay}</p>
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.videoSection}>
              <div className={styles.videoContainer}>
                <div
                  className={`${styles.videoWrapper} ${
                    speaking.has(studentId) ? styles.speaking : ''
                  }`}
                >
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={styles.localVideo}
                  ></video>
                  <div className={styles.participantName}>
                    {localStorage.getItem('firstname')} (You)
                  </div>
                </div>
                {students
                  .filter((s) => s.id !== studentId)
                  .map((student) => (
                    <div
                      key={student.id}
                      className={`${styles.videoWrapper} ${
                        speaking.has(student.id) ? styles.speaking : ''
                      }`}
                    >
                      <video
                        autoPlay
                        playsInline
                        className={styles.remoteVideo}
                        ref={(video) => {
                          if (video && remoteStreams.has(student.id)) {
                            video.srcObject = remoteStreams.get(student.id);
                          }
                        }}
                      ></video>
                      <div className={styles.participantName}>{student.name}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className={styles.controls}>
              <button
                className={styles.callButton}
                onClick={() =>
                  startCall(students.find((s) => s.id !== studentId)?.id)
                }
              >
                <img src={CallIcon} alt="Call" />
              </button>
              <button className={styles.endButton} onClick={endCall}>
                <img src={EndcallIcon} alt="End Call" />
              </button>
              <button className={styles.micButton} onClick={toggleMute}>
                <img src={isMuted ? MicIcon : MuteIcon} alt="Mute Mic" />
              </button>
              <button className={styles.screenButton} onClick={shareScreen}>
                <img src={SharescreenIcon} alt="Share Screen" />
              </button>
              <button className={styles.camButton} onClick={toggleCamera}>
                <img
                  src={isCameraOff ? OffcamIcon : OpencamIcon}
                  alt="Toggle Camera"
                />
              </button>
              <button className={styles.leaveButton} onClick={leaveMeeting}>
                Leave Meeting
              </button>
            </div>
          </div>
          <div className={styles.sidebar}>
            <div className={styles.participantsSection}>
              <h3>Participants ({students.length})</h3>
              <ul>
                {students.map((student) => (
                  <li key={student.id} className={styles.participantItem}>
                    {student.name}
                    {student.id !== studentId && (
                      <button
                        onClick={() => startCall(student.id)}
                        className={styles.inviteButton}
                      >
                        Call
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.chatSection}>
              <h3>Chat</h3>
              <div className={styles.chatBox}>
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                  ))
                ) : (
                  <div>No messages yet.</div>
                )}
              </div>
              <textarea
                className={styles.chatInput}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className={styles.actionButton}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default WebRTCComponent;