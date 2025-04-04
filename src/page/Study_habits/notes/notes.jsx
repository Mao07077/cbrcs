import { useState, useEffect } from 'react';
import styles from './Notes.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

// Define the API_URL depending on the environment
const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://cbrcs.onrender.com");
const Notes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [userIdNumber, setUserIdNumber] = useState(localStorage.getItem('userIdNumber')); // Assuming userId is stored in localStorage

  // Fetch notes on component mount
  useEffect(() => {
    if (userIdNumber) {
      fetchNotes();
    }
  }, [userIdNumber]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/get_notes/${userIdNumber}`);
      const data = await response.json();
      if (data.notes) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    const note = { title, content };

    // If editing, update the note
    if (editingIndex !== null) {
      const response = await fetch(`${API_URL}/update_note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_number: userIdNumber,
          index: editingIndex,
          note,
        }),
      });
      const result = await response.json();
      if (result.success) {
        const updatedNotes = [...notes];
        updatedNotes[editingIndex] = note;
        setNotes(updatedNotes);
      }
    } else {
      // If creating new note
      const response = await fetch(`${API_URL}/save_note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_number: userIdNumber,
          note,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setNotes([note, ...notes]);
      }
    }

    setTitle('');
    setContent('');
    setShowNoteModal(false);
    setEditingIndex(null);
  };

  const handleDelete = async (index) => {
    const response = await fetch(`${API_URL}/delete_note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_number: userIdNumber,
        index,
      }),
    });
    const result = await response.json();
    if (result.success) {
      const updatedNotes = notes.filter((_, i) => i !== index);
      setNotes(updatedNotes);
    }
  };

  const handleEdit = (index) => {
    setTitle(notes[index].title);
    setContent(notes[index].content);
    setEditingIndex(index);
    setShowNoteModal(true);
    setShowDropdown(null);
  };

  return (
    <div className={styles.page_container}>
      <Header isStudyHabits={true} />
      <div className={styles.container_wrapper}>
        <div className={styles.content_wrapper}>
          <div className={styles.border}>
            <h2> My Notes </h2>
          </div>
          <button
            className={styles.create_note_btn}
            onClick={() => setShowNoteModal(true)}
          >
            Create New Note
          </button>

          <div className={styles.notes_grid}>
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <div key={index} className={styles.note_card}>
                  <div className={styles.note_header}>
                    <h3 className={styles.note_title}>{note.title}</h3>
                    <div className={styles.dropdown_container}>
                      <button
                        className={styles.dropdown_button}
                        onClick={() =>
                          setShowDropdown(showDropdown === index ? null : index)
                        }
                      >
                        ⋮
                      </button>
                      {showDropdown === index && (
                        <div className={styles.dropdown_menu}>
                          <button onClick={() => handleEdit(index)}>Edit</button>
                          <button onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={styles.note_content}>{note.content}</p>
                </div>
              ))
            ) : (
              <p className={styles.no_notes}>No notes available. Create one!</p>
            )}
          </div>

          {showNoteModal && (
            <div className={styles.modal_overlay}>
              <div className={styles.modal_content}>
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowNoteModal(false)}
                >
                  ×
                </button>
                <h2 className={styles.modalTitle}>
                  {editingIndex !== null ? 'Edit Note' : 'Create a New Note'}
                </h2>
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
                  {editingIndex !== null ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notes;
