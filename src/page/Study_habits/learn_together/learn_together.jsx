import React, { useEffect, useRef, useState } from 'react';
import styles from './learn_together.module.css';
import Icon from '../../../icon/actual.png';
import CallIcon from '../../../icon/Call.png';
import EndcallIcon from '../../../icon/Endcall.png';
import MuteIcon from '../../../icon/Mutemic.png';
import SharescreenIcon from '../../../icon/Sharescreen.png';
import OffcamIcon from '../../../icon/Offcam.png';
import OpencamIcon from '../../../icon/Opencam.png';
import MicIcon from '../../../icon/Mic.png'; // Properly imported the new Mic icon
import Footer from '../../../Components/composables/Footer';
import Header from '../../../Components/composables/Header';

const WebRTCComponent = () => {
	const [students, setStudents] = useState([
		{ id: '1', name: 'Alice Johnson' },
		{ id: '2', name: 'Bob Smith' },
		{ id: '3', name: 'Charlie Davis' },
		{ id: '4', name: 'Diana King' },
	]);

	const [ws, setWs] = useState(null);
	const [peerConnection, setPeerConnection] = useState(null);
	const videoRef = useRef(null);
	const [message, setMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);
	const [isMuted, setIsMuted] = useState(false);
	const [isCameraOff, setIsCameraOff] = useState(false);
	const [stream, setStream] = useState(null);

	useEffect(() => {
		const studentId = prompt('Enter your student ID:');
		if (!studentId) return;

		const socket = new WebSocket(`ws://localhost:8000/ws/${studentId}`);
		setWs(socket);

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'active_students') {
				setStudents(data.students);
			} else if (data.type === 'chat') {
				setChatMessages((prevMessages) => [...prevMessages, data.message]);
			}
			console.log('Message from server:', event.data);
		};

		return () => socket.close();
	}, []);

	const startCall = async (targetStudentId) => {
		console.log('Starting Call...');
		try {
			const pc = new RTCPeerConnection();
			setPeerConnection(pc);

			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			if (!mediaStream) {
				console.log('Failed to get media stream');
				return;
			}

			videoRef.current.srcObject = mediaStream;
			setStream(mediaStream);

			mediaStream
				.getTracks()
				.forEach((track) => pc.addTrack(track, mediaStream));

			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);

			ws.send(
				JSON.stringify({ type: 'offer', target: targetStudentId, offer })
			);
			console.log('Call Started');
		} catch (error) {
			console.error('Error starting call:', error);
		}
	};

	const shareScreen = async () => {
		try {
			const screenStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
			});
			videoRef.current.srcObject = screenStream;
		} catch (error) {
			console.error('Error sharing screen:', error);
		}
	};

	const sendMessage = () => {
		if (message.trim() === '') return;
		ws.send(JSON.stringify({ type: 'chat', message }));
		setMessage('');
	};

	const endCall = () => {
		console.log('End Call Clicked');
		if (stream && stream.getTracks) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
	};

	const toggleMute = () => {
		console.log('Mute Button Clicked');
		if (!stream) {
			console.log('No active stream');
			return;
		}
		const audioTracks = stream.getAudioTracks();
		if (audioTracks.length === 0) {
			console.log('No audio tracks found');
			return;
		}
		audioTracks.forEach((track) => (track.enabled = !track.enabled));
		setIsMuted(!isMuted);
		console.log('Mic Toggled:', !isMuted);
	};

	const toggleCamera = () => {
		console.log('Camera Button Clicked');
		if (!stream) {
			console.log('No active stream');
			return;
		}
		const videoTracks = stream.getVideoTracks();
		if (videoTracks.length === 0) {
			console.log('No video tracks found');
			return;
		}
		videoTracks.forEach((track) => (track.enabled = !track.enabled));
		setIsCameraOff(!isCameraOff);
		console.log('Camera Toggled:', !isCameraOff);
	};

	return (
		<div className={styles.container}>
			<Header isStudyHabits={true}></Header>
			<div className={styles.content_wrapper}>
				

				<div className={styles.content_wrapper_video}>
					<div className={styles.mainContent}>
						{/* CBRC Logo */}
						<div className={styles.logoContainer}>
							<img src={Icon} alt="actual" className={styles.logo} />
						</div>

						<div className={styles.videoSection}>
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className={styles.mainVideo}
							></video>
						</div>

						{/* Controls */}
						<div className={styles.controls}>
							<button
								className={styles.callButton}
								onClick={() => startCall('some_student_id')}
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
						</div>
					</div>

					<div className={styles.sidebar}>
						<div className={styles.participantsSection}>
							<h3>Participants ({students.length})</h3>
							<ul>
								{students.map((student) => (
									<li key={student.id} className={styles.participantItem}>
										{student.name}
										<button
											onClick={() => startCall(student.id)}
											className={styles.inviteButton}
										>
											Invite
										</button>
									</li>
								))}
							</ul>
						</div>

						<div className={styles.chatSection}>
							<h3>Chat</h3>
							<div className={styles.chatBox}>
								{chatMessages.map((msg, index) => (
									<div key={index}>{msg}</div>
								))}
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
