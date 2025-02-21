import React, { useEffect, useRef, useState } from "react";
import styles from "./learn_together.module.css";

const WebRTCComponent = () => {
    const [students, setStudents] = useState([]);
    const [ws, setWs] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const studentId = prompt("Enter your student ID:");
        const socket = new WebSocket(`ws://localhost:8000/ws/${studentId}`);
        setWs(socket);

        socket.onmessage = (event) => {
            console.log("Message from server:", event.data);
        };

        return () => socket.close();
    }, []);

    const startCall = async (targetStudentId) => {
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: "offer", target: targetStudentId, offer }));
    };

    const shareScreen = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        videoRef.current.srcObject = stream;
    };

    return (
        <div className={styles.container}>
            <h2>WebRTC Call</h2>
            <div className={styles.videoContainer}>
                <video ref={videoRef} autoPlay playsInline></video>
            </div>
            <div className={styles.buttons}>
                <button onClick={() => startCall("student2")}>Start Call</button>
                <button onClick={shareScreen}>Share Screen</button>
            </div>
        </div>
    );
};

export default WebRTCComponent;