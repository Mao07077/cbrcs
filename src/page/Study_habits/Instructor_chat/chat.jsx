import { useState, useEffect } from 'react'; 
import styles from './Chat.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    // Get user details from localStorage
    const userRole = localStorage.getItem('userRole');
    const firstname = localStorage.getItem('firstname') || '';
    const lastname = localStorage.getItem('lastname') || '';
    const userFullName = `${firstname} ${lastname}`.trim();
    const userId = localStorage.getItem("userIdNumber"); // ✅ Get user ID

    // Dynamically set the API_URL based on the environment
    const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://cbrcs.onrender.com");


    useEffect(() => {
        const endpoint = userRole === 'Instructor' 
            ? `${API_URL}/instructor-chats/${userId}` // ✅ Only get students who messaged
            : `${API_URL}/instructors`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Users:", data);
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setUsers([]);
            });
    }, [userRole, userId, API_URL]);

    const selectUser = (user) => {
        if (!user || !user.firstname || !user.lastname) {
            console.error("Error: Selected user is missing firstname or lastname.");
            return;
        }

        const selectedUserFullName = `${user.firstname} ${user.lastname}`.trim();
        console.log("Selected User Full Name:", selectedUserFullName);

        setSelectedUser(user);

        fetch(`${API_URL}/messages/${encodeURIComponent(selectedUserFullName)}`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Messages:", data);
                setMessages(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
                setMessages([]);
            });
    };

    const sendMessage = () => {
        if (message.trim() && selectedUser) {
            const receiverFullName = `${selectedUser.firstname} ${selectedUser.lastname}`.trim();
            const newMessage = {
                sender: userFullName,
                receiver: receiverFullName,
                text: message
            };

            fetch(`${API_URL}/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            })
                .then(() => {
                    setMessages([...messages, newMessage]);
                    setMessage('');
                })
                .catch(error => console.error('Error sending message:', error));
        }
    };

    return (
        <div className={styles.chatContainer}>
            <Header isStudyHabits={true} />
            <div className={styles.content_Wrapper}>
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
                                    <div
                                        key={index}
                                        className={msg.sender === userFullName ? styles.userMessage : styles.instructorMessage}
                                    >
                                        <div className={styles.messageBubble}>{msg.text}</div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className={styles.input}
                                    placeholder="Type your message here..."
                                />
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
