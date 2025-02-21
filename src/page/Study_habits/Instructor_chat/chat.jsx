import { useState } from "react";
import styles from "./Chat.module.css";

const Chat = () => {
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const instructors = [
    { name: "Instructor A", active: true },
    { name: "Instructor B", active: true },
    { name: "Instructor C", active: true },
    { name: "Instructor D", active: true },
    { name: "Instructor E", active: true }
  ];

  const selectInstructor = (instructor) => {
    setSelectedInstructor(instructor.name);
    setMessages([{ sender: instructor.name, text: "Hello, how can I help you?" }]);
  };

  const sendMessage = () => {
    if (message.trim() && selectedInstructor) {
      setMessages([...messages, { sender: "You", text: message }]);
      setMessage("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      {!selectedInstructor ? (
        <div className={styles.instructorList}>
          {instructors.map((instructor, index) => (
            <div key={index} className={styles.instructorItem}>
              <div className={styles.instructorDetails}>
                <div className={styles.instructorAvatar}></div>
                <div>
                  <strong>{instructor.name}</strong>
                  <p className={styles.activeStatus}>🟢 Active</p>
                </div>
              </div>
              <button 
                className={styles.chatButton} 
                onClick={() => selectInstructor(instructor)}
              >
                ...
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h3>Chatting with {selectedInstructor}</h3>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={styles.message}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.input}
          />
          <button onClick={sendMessage} className={styles.button}>Send</button>
        </>
      )}
    </div>
  );
};

export default Chat;