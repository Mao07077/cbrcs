import { useState } from "react";
import styles from "./Notes.module.css";
import Header from "../../../Components/Header";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [notes, setNotes] = useState([]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const newNote = { title, content };
    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    setShowNoteModal(false);
  };

  return (
    <div className={styles.page_container}>
      <Header />
      <header className={styles.border}>
        <h2>My Notes</h2>
      </header>
      <button className={styles.create_note_btn} onClick={() => setShowNoteModal(true)}>
        Create New Note
      </button>

      <div className={styles.notes_grid}>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={index} className={styles.note_card}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
          ))
        ) : (
          <p className={styles.no_notes}>No notes available. Create one!</p>
        )}
      </div>

      {showNoteModal && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <button className={styles.closeBtn} onClick={() => setShowNoteModal(false)}>×</button>
            <h2 className={styles.modalTitle}>Create a New Note</h2>
            <label className={styles.label}>Title:</label>
            <input
              type="text"
              className={styles.titleInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className={styles.label}>Content:</label>
            <textarea
              className={styles.textArea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
            <button className={styles.saveBtn} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
