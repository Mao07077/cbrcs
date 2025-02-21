import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./Notes.module.css";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    const response = await fetch("http://localhost:8000/add_note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert("Note saved!");
      setTitle("");
      setContent("");
    } else {
      alert("Error saving note.");
    }
  };

  return (
    <div className={styles.noteContainer}>
      <button className={styles.closeBtn}>×</button>
      <label className={styles.label}>Title:</label>
      <input
        type="text"
        className={styles.titleInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill
        className={styles.textEditor}
        value={content}
        onChange={setContent}
        theme="snow"
      />
      <button className={styles.saveBtn} onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default Notes;
