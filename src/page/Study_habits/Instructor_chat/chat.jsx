import { useState, useEffect } from 'react';
import styles from './Chat.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';
import Instructor_Sidebar from '../../../Components/Instructor_Sidebar'; // Import Instructor Sidebar

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userRole, setUserRole] = useState('');

    const firstname = localStorage.getItem('firstname') || '';
    const lastname = localStorage.getItem('lastname') || '';
    const userFullName = `${firstname} ${lastname}`.trim().toLowerCase();
    const userId = localStorage.getItem("userIdNumber");

    const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
      : "https://g28s4zdq-8000.asse.devtunnels.ms/");
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole') || '';
        setUserRole(storedRole);
    }, []);

    useEffect(() => {
        if (!userFullName || !userRole) return;

        const endpoint = userRole.toLowerCase() === 'instructor'
            ? `${API_URL}/instructor-chats/${encodeURIComponent(userFullName)}`
            : `${API_URL}/instructors`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (userRole.toLowerCase() === 'instructor') {
                    setUsers(data.student_ids.map(name => {
                        const [firstname, ...lastnameParts] = name.split(' ');
                        return { firstname, lastname: lastnameParts.join(' ') || '' };
                    }));
                } else {
                    setUsers(Array.isArray(data) ? data : []);
                }
            })
            .catch(() => setUsers([]));
    }, [userRole, userFullName, API_URL]);

    const selectUser = (user) => {
        if (!user || !user.firstname) return;

        setSelectedUser(user);
        const receiverFullName = `${user.firstname} ${user.lastname}`.trim().toLowerCase();

        fetch(`${API_URL}/messages/${encodeURIComponent(userFullName)}/${encodeURIComponent(receiverFullName)}`)
            .then(response => response.json())
            .then(data => setMessages(Array.isArray(data) ? data : []))
            .catch(() => setMessages([]));
    };

    const sendMessage = () => {
        if (message.trim() && selectedUser) {
            const receiverFullName = `${selectedUser.firstname} ${selectedUser.lastname}`.trim().toLowerCase();
            const newMessage = { sender: userFullName, receiver: receiverFullName, text: message };

            fetch(`${API_URL}/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setMessages(prevMessages => [...prevMessages, newMessage]);
                        setMessage('');
                    }
                })
                .catch(console.error);
        }
    };

    return (
        <div className={styles.chatContainer}>
            {/* Hide "Back to Study Habits" for instructors */}
            <Header isStudyHabits={userRole.toLowerCase() !== 'instructor'} />

            <div className={styles.content_Wrapper}>
                {/* Show Instructor Sidebar only if user is an instructor */}
                {userRole.toLowerCase() === 'instructor' && <Instructor_Sidebar />}
                
                <div className={styles.sidebar}>
                    <h3>Messages</h3>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <div
                                key={index}
                                className={styles.instructorItem}
                                onClick={() => selectUser(user)}
                            >
                                <div className={styles.instructorAvatar}></div>
                                <div className={styles.instructorInfo}>
                                    <strong>{user.firstname} {user.lastname}</strong>
                                    <p className={styles.activeStatus}>
                                        <span className={styles.statusDot}></span>
                                        Active now
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No users available.</p>
                    )}
                </div>
                
                <div className={styles.chatSection}>
                    {selectedUser ? (
                        <>
                            <div className={styles.chatHeader}>
                                <div className={styles.instructorAvatar}></div>
                                <h3>{selectedUser.firstname} {selectedUser.lastname}</h3>
                            </div>
                            <div className={styles.messages}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={msg.sender === userFullName ? styles.userMessage : styles.instructorMessage}>
                                        <div className={styles.messageBubble}>{msg.text}</div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.inputContainer}>
                                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className={styles.input} placeholder="Type your message here..." />
                                <button onClick={sendMessage} className={styles.sendButton}>➤</button>
                            </div>
                        </>
                    ) : (
                        <p>Select a user to start a chat</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Chat;
