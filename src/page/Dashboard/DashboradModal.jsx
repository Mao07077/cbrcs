import React from "react";
import Modal from "react-modal";
import Dashboard from "./Dashboard";

Modal.setAppElement("#root"); // Ensure accessibility

function DashboardModal({ studentId, onClose }) {
    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Student Dashboard"
            style={{
                content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    height: "90%",
                },
            }}
        >
            <button onClick={onClose} style={{ float: "right", marginBottom: "10px" }}>
                Close
            </button>
            <Dashboard studentId={studentId} isModal={true} />
        </Modal>
    );
}

export default DashboardModal;
