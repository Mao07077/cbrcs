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
    const wsRef = useRef(null);

    const API_URL = "http://127.0.0.1:8000";

    // Update wsRef when ws changes
    useEffect(() => {
        wsRef.current = ws;
    }, [ws]);

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
            const cleanAPI_URL = API_URL.replace(/^https?:\/\//, '').replace(/^ws?:\/\//, '');
            const isProduction = process.env.NODE_ENV === 'production';
            const protocol = isProduction ? 'wss://' : 'ws://';
            const wsUrl = `${protocol}${cleanAPI_URL}/ws/${callId || 'random'}`;

            console.log(`Attempting to connect to WebSocket: ${wsUrl}`);

            let socket;
            try {
                socket = new WebSocket(wsUrl);
                setWs(socket);
            } catch (err) {
                console.error('Failed to create WebSocket:', err);
                setError('Failed to connect to WebSocket server. Please check the backend URL.');
                return;
            }

            socket.onopen = () => {
                console.log('WebSocket connection established');
                socket.send(JSON.stringify({ 
                    id_number: user.id_number, 
                    firstname: user.firstname 
                }));
            };

            socket.onmessage = async (event) => {
                let data;
                try {
                    data = JSON.parse(event.data);
                    console.log('WebSocket message received:', data);
                } catch (err) {
                    console.error('Invalid WebSocket message:', event.data, err);
                    setError('Received invalid data from server. Please try reconnecting.');
                    return;
                }

                if (data.type === 'student_id') {
                    setStudentId(data.studentId);
                    setCallIdDisplay(data.callId);
                } else if (data.type === 'active_students') {
                    setStudents(data.students);
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
                console.log('WebSocket connection closed:', event);
                setWs(null);
                setStream(null);
                if (localVideoRef.current) localVideoRef.current.srcObject = null;
                setRemoteStreams(new Map());
                setPeerConnections(new Map());
                setShowCallOptions(true);
                setCallIdDisplay(null);
                setError(
                    event.reason
                        ? `Connection closed: ${event.reason}. Please try reconnecting.`
                        : 'Connection lost. Please try reconnecting.'
                );
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('WebSocket connection failed. Please check your network or backend configuration.');
            };

            return () => {
                console.log('Cleaning up WebSocket connection');
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            };
        }
    }, [showCallOptions, callId, user]);

    // Initiate calls when students list or stream changes
    useEffect(() => {
        if (studentId && students.length > 0 && stream) {
            students.forEach((student) => {
                if (student.id !== studentId && !peerConnections.has(student.id)) {
                    startCall(student.id);
                }
            });
        }
    }, [students, studentId, stream]);

    const initializeMediaStream = async () => {
        try {
            console.log('Requesting media stream with constraints: video=true, audio=true');
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, frameRate: 30 },
                audio: true,
            });

            console.log('Media stream acquired:', mediaStream);
            const videoTracks = mediaStream.getVideoTracks();
            const audioTracks = mediaStream.getAudioTracks();
            console.log('Video tracks:', videoTracks);
            console.log('Audio tracks:', audioTracks);

            if (videoTracks.length === 0) {
                setError('No video tracks available. Please check your camera.');
                return null;
            }
            if (audioTracks.length === 0) {
                setError('No audio tracks available. Please check your microphone.');
            }

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
                console.log('Local video srcObject set:', mediaStream);
                localVideoRef.current.play().catch((err) => {
                    console.error('Failed to play local video:', err);
                    setError('Failed to play local video. Please check your browser settings.');
                });
            } else {
                console.warn('localVideoRef is not available');
            }

            setStream(mediaStream);

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
            console.error('Failed to initialize media stream:', error);
            setError(`Failed to access camera/microphone: ${error.message}. Please grant permissions and check your devices.`);
            return null;
        }
    };

    const createCall = async () => {
        if (!user?.id_number) {
            setError('Please log in to create a call.');
            return;
        }
        const newMeetingId = Math.random().toString(36).substring(2, 10);
        setCallId(newMeetingId);
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

    const reconnect = () => {
        setError(null);
        setShowCallOptions(false);
    };

    const handleOffer = async (from, offer) => {
        try {
            console.log(`Handling offer from ${from}`);
            let localStream = stream;
            if (!localStream) {
                console.log('No local stream, initializing...');
                localStream = await initializeMediaStream();
                if (!localStream) {
                    console.error('Failed to initialize stream for offer');
                    setError('Failed to access camera/microphone. Please check permissions.');
                    return;
                }
                setStream(localStream);
            }

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });
            setPeerConnections((prev) => new Map(prev).set(from, pc));

            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
                console.log(`Added track to peer connection: ${track.kind}, enabled: ${track.enabled}`);
            });

            pc.onicecandidate = (event) => {
                if (event.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(
                        JSON.stringify({
                            type: 'ice-candidate',
                            target: from,
                            candidate: event.candidate,
                        })
                    );
                    console.log('Sent ICE candidate to:', from);
                } else if (!event.candidate) {
                    console.log('No more ICE candidates');
                } else {
                    console.error('WebSocket is not open when sending ICE candidate');
                }
            };

            pc.ontrack = (event) => {
                console.log(`Received remote stream from ${from}:`, event.streams[0]);
                const tracks = event.streams[0].getTracks();
                console.log(`Remote stream tracks:`, tracks);
                setRemoteStreams((prev) => new Map(prev).set(from, event.streams[0]));
            };

            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            console.log('Set remote description:', offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log('Created and set answer:', answer);

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        type: 'answer',
                        target: from,
                        answer,
                    })
                );
                console.log('Sent answer to:', from);
            } else {
                console.error('WebSocket is not open when sending answer');
                setError('Failed to send answer. Please check your connection.');
            }
        } catch (error) {
            console.error('Failed to handle offer:', error);
            setError('Failed to establish call. Please try again.');
        }
    };

    const handleAnswer = async (from, answer) => {
        const pc = peerConnections.get(from);
        if (pc) {
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
                console.log(`Set answer from ${from}:`, answer);
            } catch (error) {
                console.error(`Failed to set answer from ${from}:`, error);
                setError('Failed to process answer. Please try again.');
            }
        } else {
            console.warn(`No peer connection found for ${from}`);
        }
    };

    const handleIceCandidate = async (from, candidate) => {
        const pc = peerConnections.get(from);
        if (pc) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
                console.log(`Added ICE candidate from ${from}`);
            } catch (error) {
                console.error(`Failed to add ICE candidate from ${from}:`, error);
                setError('Failed to add ICE candidate. Please try again.');
            }
        } else {
            console.warn(`No peer connection found for ${from}`);
        }
    };

    const startCall = async (targetStudentId) => {
        if (!targetStudentId || peerConnections.has(targetStudentId)) return;
        try {
            let localStream = stream;
            if (!localStream) {
                console.log('No local stream, initializing...');
                localStream = await initializeMediaStream();
                if (!localStream) {
                    console.error('Failed to initialize stream for call');
                    setError('Failed to access camera/microphone. Please check permissions.');
                    return;
                }
                setStream(localStream);
            }

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });
            setPeerConnections((prev) => new Map(prev).set(targetStudentId, pc));

            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
                console.log(`Added track to peer connection: ${track.kind}, enabled: ${track.enabled}`);
            });

            pc.onicecandidate = (event) => {
                if (event.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(
                        JSON.stringify({
                            type: 'ice-candidate',
                            target: targetStudentId,
                            candidate: event.candidate,
                        })
                    );
                    console.log('Sent ICE candidate to:', targetStudentId);
                } else if (!event.candidate) {
                    console.log('No more ICE candidates');
                } else {
                    console.error('WebSocket is not open when sending ICE candidate');
                }
            };

            pc.ontrack = (event) => {
                console.log(`Received remote stream from ${targetStudentId}:`, event.streams[0]);
                const tracks = event.streams[0].getTracks();
                console.log(`Remote stream tracks:`, tracks);
                setRemoteStreams((prev) => new Map(prev).set(targetStudentId, event.streams[0]));
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log('Created and set offer:', offer);

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        type: 'offer',
                        target: targetStudentId,
                        offer,
                    })
                );
                console.log('Sent offer to:', targetStudentId);
            } else {
                console.error('WebSocket is not open when sending offer');
                setError('Failed to send offer. Please check your connection.');
            }
        } catch (error) {
            console.error('Failed to start call:', error);
            setError('Failed to start call. Please try again.');
        }
    };

    const shareScreen = async () => {
        try {
            console.log('Requesting screen share');
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream;
                console.log('Set screen share stream to local video');
            }
            setStream(screenStream);
            peerConnections.forEach((pc, targetId) => {
                const videoTrack = screenStream.getVideoTracks()[0];
                const sender = pc.getSenders().find((s) => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                    console.log(`Replaced video track for ${targetId}`);
                }
            });
        } catch (error) {
            console.error('Failed to share screen:', error);
            setError('Failed to share screen. Please try again.');
        }
    };

    const sendMessage = () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            setError('No active WebSocket connection. Please reconnect.');
            return;
        }
        wsRef.current.send(JSON.stringify({ 
            type: 'chat', 
            message, 
            sender_name: user?.firstname || "User"
        }));
        setMessage('');
    };

    const endCall = () => {
        console.log('Ending call');
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'leave' }));
        }
        if (stream && stream.getTracks) {
            stream.getTracks().forEach((track) => {
                track.stop();
                console.log(`Stopped track: ${track.kind}`);
            });
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
            console.error('No stream for toggleMute');
            return;
        }
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
            setError('No audio tracks available.');
            console.error('No audio tracks for toggleMute');
            return;
        }
        audioTracks.forEach((track) => {
            track.enabled = !track.enabled;
            console.log(`Toggled audio track: enabled=${track.enabled}`);
        });
        setIsMuted(!isMuted);
        console.log(`Mute state: isMuted=${!isMuted}`);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'status_update', muted: !isMuted, camera_off: isCameraOff }));
        } else {
            console.error('WebSocket is not open when sending status update');
            setError('Failed to send status update. Please check your connection.');
        }
    };

    const toggleCamera = () => {
        if (!stream) {
            setError('No stream available to toggle camera.');
            console.error('No stream for toggleCamera');
            return;
        }
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length === 0) {
            setError('No video tracks available.');
            console.error('No video tracks for toggleCamera');
            return;
        }
        videoTracks.forEach((track) => {
            track.enabled = !track.enabled;
            console.log(`Toggled video track: enabled=${track.enabled}`);
        });
        setIsCameraOff(!isCameraOff);
        console.log(`Camera state: isCameraOff=${!isCameraOff}`);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'status_update', muted: isMuted, camera_off: !isCameraOff }));
        } else {
            console.error('WebSocket is not open when sending status update');
            setError('Failed to send status update. Please check your connection.');
        }
    };

    if (showCallOptions) {
        return (
            <div className={styles.container}>
                <Header isStudyHabits={true} />
                <div className={styles.content_wrapper}>
                    <div className={styles.callOptions}>
                        <h2 className={styles.callOptionsTitle}>Join or Create a Meeting</h2>
                        {error && (
                            <div className={styles.error}>
                                <p>{error}</p>
                                {error.includes('Connection') && (
                                    <button className={styles.actionButton} onClick={reconnect}>
                                        Reconnect
                                    </button>
                                )}
                            </div>
                        )}
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
                        {error && (
                            <div className={styles.error}>
                                <p>{error}</p>
                                {error.includes('Connection') && (
                                    <button className={styles.actionButton} onClick={reconnect}>
                                        Reconnect
                                    </button>
                                )}
                            </div>
                        )}
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
                                            onError={(e) => console.error('Local video error:', e)}
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
                                                            const stream = remoteStreams.get(student.id);
                                                            if (video.srcObject !== stream) {
                                                                video.srcObject = stream;
                                                                console.log(`Set remote video srcObject for ${student.id}:`, stream);
                                                                video.play().catch((err) => {
                                                                    console.error(`Failed to play remote video for ${student.id}:`, err);
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    onError={(e) => console.error(`Remote video error for ${student.id}:`, e)}
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
                                    src={isCameraOff ? OpencamIcon : OffcamIcon}
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