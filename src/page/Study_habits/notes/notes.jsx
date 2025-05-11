import { useState, useEffect } from 'react';
import styles from './Notes.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

// Define the API_URL depending on the environment
const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://14c1-2405-8d40-4479-50f0-25aa-3e85-9a34-71e6.ngrok-free.app ");

const Notes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState(''); // Add state for selected color
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
        if (!title.trim() || !content.trim() || !color) {
            console.error("All fields (title, content, color) are required.");
            return;
        }

        const note = { title, content, color }; // Include color in the note object

        try {
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

                if (!response.ok) {
                    throw new Error(`Failed to update note: ${response.statusText}`);
                }

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

                if (!response.ok) {
                    throw new Error(`Failed to save note: ${response.statusText}`);
                }

                const result = await response.json();
                if (result.success) {
                    setNotes([note, ...notes]);
                }
            }

            setTitle('');
            setContent('');
            setColor('');
            setShowNoteModal(false);
            setEditingIndex(null);
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save the note. Please try again.");
        }
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
        setColor(notes[index].color);
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
                        onClick={() => {
                            setShowNoteModal(true);
                            setEditingIndex(null); // Reset editingIndex to ensure it's a new note
                            setTitle(''); // Clear the title field
                            setContent(''); // Clear the content field
                            setColor(''); // Clear the color selection
                        }}
                    >
                        Create New Note
                    </button>

                    <div className={styles.notes_grid}>
                        {notes.length > 0 ? (
                            notes.map((note, index) => (
                                <div
                                    key={index}
                                    className={styles.note_card}
                                    style={{ backgroundColor: note.color }} // Apply color as the background
                                >
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
                                <label className={styles.label}>Category Color:</label>
                                <div className={styles.colorPicker}>
                                    {['#FFB3BA', '#B3E5FC', '#D4E157', '#FFCCBC'].map((c) => (
                                        <button
                                            key={c}
                                            className={`${styles.colorOption} ${color === c ? styles.selected : ''}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setColor(c)}
                                        />
                                    ))}
                                </div>
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
