import { useState, useEffect } from 'react';
import styles from './Notes.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
    : "https://g28s4zdq-8000.asse.devtunnels.ms/");
const Notes = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [notes, setNotes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userIdNumber] = useState(localStorage.getItem('userIdNumber')); // Assuming userId is stored in localStorage

    // Common headers for fetch requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    // Fetch notes on component mount
    useEffect(() => {
        if (userIdNumber) {
            fetchNotes();
        } else {
            setError('User not logged in. Please log in to view notes.');
            setIsLoading(false);
        }
    }, [userIdNumber]);

    const fetchNotes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/get_notes/${userIdNumber}`, {
                headers: requestHeaders, // Add headers here
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.notes) {
                setNotes(data.notes);
            } else {
                throw new Error(data.detail || 'No notes found');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            setError(error.message || 'Error fetching notes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim() || !color) {
            setError('All fields (title, content, color) are required.');
            return;
        }

        const note = { title, content, color };
        setError(null);

        try {
            if (editingIndex !== null) {
                // Update existing note
                const response = await fetch(`${API_URL}/update_note`, {
                    method: 'POST',
                    headers: requestHeaders, // Add headers here
                    body: JSON.stringify({
                        id_number: userIdNumber,
                        index: editingIndex,
                        note,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to update note: ${response.status} ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success) {
                    const updatedNotes = [...notes];
                    updatedNotes[editingIndex] = note;
                    setNotes(updatedNotes);
                } else {
                    throw new Error(result.detail || 'Failed to update note');
                }
            } else {
                // Create new note
                const response = await fetch(`${API_URL}/save_note`, {
                    method: 'POST',
                    headers: requestHeaders, // Add headers here
                    body: JSON.stringify({
                        id_number: userIdNumber,
                        note,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to save note: ${response.status} ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success) {
                    setNotes([note, ...notes]);
                } else {
                    throw new Error(result.detail || 'Failed to save note');
                }
            }

            setTitle('');
            setContent('');
            setColor('');
            setShowNoteModal(false);
            setEditingIndex(null);
        } catch (error) {
            console.error('Error saving note:', error);
            setError(error.message || 'Failed to save the note. Please try again.');
        }
    };

    const handleDelete = async (index) => {
        setError(null);
        try {
            const response = await fetch(`${API_URL}/delete_note`, {
                method: 'POST',
                headers: requestHeaders, // Add headers here
                body: JSON.stringify({
                    id_number: userIdNumber,
                    index,
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                const updatedNotes = notes.filter((_, i) => i !== index);
                setNotes(updatedNotes);
            } else {
                throw new Error(result.detail || 'Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            setError(error.message || 'Failed to delete the note. Please try again.');
        }
    };

    const handleEdit = (index) => {
        setTitle(notes[index].title);
        setContent(notes[index].content);
        setColor(notes[index].color);
        setEditingIndex(index);
        setShowNoteModal(true);
        setShowDropdown(null);
        setError(null);
    };

    if (isLoading) return <p className={styles.loading}>Loading notes...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

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
                            setEditingIndex(null);
                            setTitle('');
                            setContent('');
                            setColor('');
                            setError(null);
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
                                    style={{ backgroundColor: note.color }}
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