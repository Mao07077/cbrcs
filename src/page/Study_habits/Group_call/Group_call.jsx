import React, { useState } from "react";
import styles from "./Group_call.module.css"; // Import CSS module

const GroupCall = () => {
  const [inCall, setInCall] = useState(false);
  const users = [
    { id: "User1", active: true },
    { id: "User2", active: true },
    { id: "User3", active: true },
    { id: "User4", active: true },
    { id: "User5", active: true },
  ];

  const startCall = () => {
    setInCall(true);
  };

  return (
    <div className={styles.container}>
      <h2>Active Users</h2>
      <div className={styles.userList}>
        {users.map((user) => (
          <div key={user.id} className={styles.userItem}>
            <span>{user.id}</span>
            <button className={styles.inviteButton} onClick={startCall}>
              INVITE
            </button>
          </div>
        ))}
      </div>
      {inCall && (
        <div className={styles.videoContainer}>
          <h3>In Call with Users</h3>
          <div className={styles.callBox}>
            <div className={styles.callUser}>User1</div>
            <div className={styles.callUser}>User2</div>
            <div className={styles.callUser}>User3</div>
            <div className={styles.callUser}>User4</div>
          </div>
          <button className={styles.endCallButton} onClick={() => setInCall(false)}>End Call</button>
        </div>
      )}
    </div>
  );
};

export default GroupCall;
