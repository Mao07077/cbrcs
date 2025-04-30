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
import Notification from '../../../Components/composables/Notification';

const WebRTCComponent = () => {
  const [students, setStudents] = useState([]);
  const [ws, setWs] = useState(null);
  const [peerConnections, setPeerConnections] = useState(new Map());
  const [remoteStreams, setRemoteStreams] = useState(new Map());
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
  const [speaking, setSpeaking] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const chatBoxRef = useRef(null);

  // Fetch user from localStorage on mount
  useEffect(() => {
    const userIdNumber = localStorage.getItem('userIdNumber');
    const firstname = localStorage.getItem('firstname');
    if (userIdNumber && firstname) {
      setUser({ id_number: userIdNumber, firstname });
    } else {
      setError('No user detected. Please log in.');
      window.location.href = '/login';
    }
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // WebSocket connection
  useEffect(() => {
    if (!showCallOptions && !ws && user?.id_number) {
      // Determine the API_URL based on the environment
      const API_URL = process.env.REACT_APP_API_URL || 'localhost:8000'; // Default to local if not set
      const socket = new WebSocket(`ws://${API_URL}/ws/${callId || 'random'}`);
      setWs(socket);

      socket.onopen = () => {
        socket.send(JSON.stringify({ id_number: user.id_number }));
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'student_id') {
          setStudentId(data.studentId);
          setCallIdDisplay(data.callId);
        } else if (data.type === 'active_students') {
          setStudents(data.students);
          data.students.forEach((student) => {
            if (student.id !== studentId && !peerConnections.has(student.id)) {
              startCall(student.id);
            }
          });
        } else if (data.type === 'chat') {
          setChatMessages((prev) => [...prev, data.message]);
        } else if (data.type === 'notification') {
          setNotifications((prev) => [...prev, data.message]);
          setTimeout(() => {
            setNotifications((prev) => prev.slice(1));
          }, 5000);
        } else if (data.type === 'offer') {
          await handleOffer(data.from, data.offer);
        } else if (data.type === 'answer') {
          await handleAnswer(data.from, data.answer);
        } else if (data.type === 'ice-candidate') {
          await handleIceCandidate(data.from, data.candidate);
        }
      };

      socket.onclose = (event) => {
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
        setError('WebSocket connection failed. Please check your network and try again.');
      };

      return () => socket.close();
    }
  }, [showCallOptions, callId, user]);

  const initializeMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);

      // Detect speaking
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
        if (average > 30) {
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
      setError(`Failed to access camera/microphone: ${error.message}`);
      return null;
    }
  };

  const createCall = async () => {
    if (!user?.id_number) {
      setError('Please log in to create a call.');
      return;
    }
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
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      setPeerConnections((prev) => new Map(prev).set(from, pc));

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
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
      setError('Failed to establish call. Please try again.');
    }
  };

  const handleAnswer = async (from, answer) => {
    const pc = peerConnections.get(from);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async (from, candidate) => {
    const pc = peerConnections.get(from);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const startCall = async (targetStudentId) => {
    if (!targetStudentId || peerConnections.has(targetStudentId)) return;
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      setPeerConnections((prev) => new Map(prev).set(targetStudentId, pc));

      let localStream = stream;
      if (!localStream) {
        localStream = await initializeMediaStream();
        if (!localStream) return;
      }

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
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
      setError('Failed to start call. Please try again.');
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
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
      setError('Failed to share screen. Please try again.');
    }
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    ws.send(JSON.stringify({ type: 'chat', message }));
    setMessage('');
  };

  const endCall = () => {
    ws.send(JSON.stringify({ type: 'leave' }));
    if (stream && stream.getTracks) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setStream(null);
    setRemoteStreams(new Map());
    peerConnections.forEach((pc) => pc.close());
    setPeerConnections(new Map());
    setShowCallOptions(true);
    setCallIdDisplay(null);
    setError(null);
  };

  const leaveMeeting = () => {
    endCall();
    window.location.href = '/';
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
    audioTracks.forEach((track) => (track.enabled = !track.enabled));
    setIsMuted(!isMuted);
    ws.send(JSON.stringify({ type: 'status_update', muted: !isMuted, camera_off: isCameraOff }));
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
    videoTracks.forEach((track) => (track.enabled = !track.enabled));
    setIsCameraOff(!isCameraOff);
    ws.send(JSON.stringify({ type: 'status_update', muted: isMuted, camera_off: !isCameraOff }));
  };

  if (showCallOptions) {
    return (
      <div className={styles.container}>
        <Header isStudyHabits={true} />
        <div className={styles.content_wrapper}>
          <div className={styles.callOptions}>
            <h2 className={styles.callOptionsTitle}>Join or Create a Meeting</h2>
            {error && <p className={styles.error}>{error}</p>}
            <button className={`${styles.actionButton} ${styles.createCallButton}`} onClick={createCall}>
              New Meeting
            </button>
            <button
              className={`${styles.actionButton} ${styles.joinCallButton}`}
              onClick={() => setShowJoinInput(true)}
            >
              Join Meeting
            </button>
            {showJoinInput && (
              <div className={styles.joinInputContainer}>
                <input
                  type="text"
                  value={callIdInput}
                  onChange={(e) => setCallIdInput(e.target.value)}
                  placeholder="Enter Meeting ID"
                  className={styles.callIdInput}
                />
                <button className={`${styles.actionButton} ${styles.joinButton}`} onClick={joinCall}>
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header isStudyHabits={true} />
      <div className={styles.content_wrapper}>
        <div className={styles.content_wrapper_video}>
          <div className={styles.mainContent}>
            <div className={styles.logoContainer}>
              <img src={Icon} alt="Logo" className={styles.logo} />
            </div>
            {callIdDisplay && (
              <div className={styles.callIdDisplay}>
                <p>Meeting ID: {callIdDisplay}</p>
                <button
                  className={styles.copyButton}
                  onClick={() => navigator.clipboard.writeText(callIdDisplay)}
                >
                  Copy
                </button>
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.videoSection}>
              <div className={styles.videoContainer}>
                {/* Local video */}
                <div
                  className={`${styles.videoWrapper} ${
                    speaking.has(studentId) ? styles.speaking : ''
                  }`}
                >
                  {isCameraOff ? (
                    <div className={styles.videoOffPlaceholder}>
                      <span>Camera Off</span>
                    </div>
                  ) : (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={styles.localVideo}
                    />
                  )}
                  <div className={styles.participantName}>
                    {user?.firstname} (You)
                    {isMuted && <span> 🔇</span>}
                    {isCameraOff && <span> 📷</span>}
                  </div>
                </div>
                {/* Remote participants */}
                {students
                  .filter((s) => s.id !== studentId)
                  .map((student) => (
                    <div
                      key={student.id}
                      className={`${styles.videoWrapper} ${
                        speaking.has(student.id) ? styles.speaking : ''
                      }`}
                    >
                      {student.camera_off || !remoteStreams.has(student.id) ? (
                        <div className={styles.videoOffPlaceholder}>
                          <span>Camera Off</span>
                        </div>
                      ) : (
                        <video
                          autoPlay
                          playsInline
                          className={styles.remoteVideo}
                          ref={(video) => {
                            if (video && remoteStreams.has(student.id)) {
                              video.srcObject = remoteStreams.get(student.id);
                            }
                          }}
                        />
                      )}
                      <div className={styles.participantName}>
                        {student.name}
                        {student.muted && <span> 🔇</span>}
                        {student.camera_off && <span> 📷</span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className={styles.controls}>
              <button className={styles.micButton} onClick={toggleMute}>
                <img src={isMuted ? MicIcon : MuteIcon} alt="Mute/Unmute" />
              </button>
              <button className={styles.camButton} onClick={toggleCamera}>
                <img
                  src={isCameraOff ? OffcamIcon : OpencamIcon}
                  alt="Toggle Camera"
                />
              </button>
              <button className={styles.screenButton} onClick={shareScreen}>
                <img src={SharescreenIcon} alt="Share Screen" />
              </button>
              <button className={styles.endButton} onClick={leaveMeeting}>
                <img src={EndcallIcon} alt="Leave Meeting" />
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
                    {student.muted && <span> 🔇</span>}
                    {student.camera_off && <span> 📷</span>}
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
              <div className={styles.chatBox} ref={chatBoxRef}>
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={styles.chatMessage}>
                      <strong>{msg.sender_name}</strong>{' '}
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      <p>{msg.message}</p>
                    </div>
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
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (sendMessage(), e.preventDefault())}
              />
              <button onClick={sendMessage} className={styles.actionButton}>
                Send
              </button>
            </div>
          </div>
        </div>
        {notifications.map((note, index) => (
          <Notification key={index} message={note} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default WebRTCComponent;