import React, { useEffect, useRef, useState } from "react";
import styles from "./learn_together.module.css";
import Header from "../../../Components/Header";
import Icon from '../../../icon/actual.png';

const WebRTCComponent = () => {
    // Pre-fill sample participants for testing
    const [students, setStudents] = useState([
        { id: "1", name: "Alice Johnson" },
        { id: "2", name: "Bob Smith" },
        { id: "3", name: "Charlie Davis" },
        { id: "4", name: "Diana King" }
    ]);

    const [ws, setWs] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const videoRef = useRef(null);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const studentId = prompt("Enter your student ID:");
        if (!studentId) return;
        
        const socket = new WebSocket(`ws://localhost:8000/ws/${studentId}`);
        setWs(socket);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "active_students") {
                setStudents(data.students); // Replace sample names with real ones when data arrives
            } else if (data.type === "chat") {
                setChatMessages(prevMessages => [...prevMessages, data.message]);
            }
            console.log("Message from server:", event.data);
        };

        return () => socket.close();
    }, []);

    const startCall = async (targetStudentId) => {
        try {
            const pc = new RTCPeerConnection();
            setPeerConnection(pc);

            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            
            mediaStream.getTracks().forEach((track) => pc.addTrack(track, mediaStream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            ws.send(JSON.stringify({ type: "offer", target: targetStudentId, offer }));
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    const shareScreen = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            videoRef.current.srcObject = screenStream;
        } catch (error) {
            console.error("Error sharing screen:", error);
        }
    };

    const sendMessage = () => {
        if (message.trim() === "") return;
        ws.send(JSON.stringify({ type: "chat", message }));
        setMessage(""); 
    };

    const endCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.srcObject = null;
        setStream(null);
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
            setIsMuted(!isMuted);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
            setIsCameraOff(!isCameraOff);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.mainContent}>

                {/* CBRC Logo */}
                <div className={styles.logoContainer}>
                    <img src={Icon} alt="actual" className={styles.logo} />
                </div>

                <div className={styles.videoSection}>
                    <video ref={videoRef} autoPlay playsInline className={styles.mainVideo}></video>
                </div>
                
                <div className={styles.controls}>
                    <button onClick={shareScreen} className={styles.actionButton}>Share Screen</button>
                    <button onClick={() => startCall(students[0]?.id)} className={styles.actionButton}>Start a Call</button>
                    <button onClick={endCall} className={styles.endButton}>End Call</button>
                    <button onClick={toggleMute} className={styles.actionButton}>
                        {isMuted ? "Unmute" : "Mute"} Audio
                    </button>
                    <button onClick={toggleCamera} className={styles.actionButton}>
                        {isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
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
                                <button onClick={() => startCall(student.id)} className={styles.inviteButton}>
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
                    <button onClick={sendMessage} className={styles.actionButton}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default WebRTCComponent;
