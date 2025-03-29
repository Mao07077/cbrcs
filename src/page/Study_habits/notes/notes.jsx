import { useState } from 'react';
import styles from './Notes.module.css';
import Header from '../../../Components/composables/Header';
import Study_Habits_Sidebar from '../../../Components/Study_Habits_Sidebar';
import Footer from '../../../Components/composables/Footer';

const Notes = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [showNoteModal, setShowNoteModal] = useState(false);
	const [notes, setNotes] = useState([]);
	const [showDropdown, setShowDropdown] = useState(null);
	const [editingIndex, setEditingIndex] = useState(null);
	const handleSave = () => {
		if (!title.trim() || !content.trim()) return;

		if (editingIndex !== null) {
			const updatedNotes = [...notes];
			updatedNotes[editingIndex] = { title, content };
			setNotes(updatedNotes);
			setEditingIndex(null);
		} else {
			setNotes([{ title, content }, ...notes]);
		}

		setTitle('');
		setContent('');
		setShowNoteModal(false);
	};

	const handleDelete = (index) => {
		const updatedNotes = notes.filter((_, i) => i !== index);
		setNotes(updatedNotes);
	};

	const handleEdit = (index) => {
		setTitle(notes[index].title);
		setContent(notes[index].content);
		setEditingIndex(index);
		setShowNoteModal(true);
	};

	return (
		<div className={styles.page_container}>
			<Header isStudyHabits={true}></Header>
			<div className={styles.container_wrapper}>
				<Study_Habits_Sidebar></Study_Habits_Sidebar>
				<div className={styles.content_wrapper}>
					<header className={styles.border}>
						<h2>My Notes</h2>
					</header>
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
										<h3>{note.title}</h3>
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
													<button onClick={() => handleEdit(index)}>
														Edit
													</button>
													<button onClick={() => handleDelete(index)}>
														Delete
													</button>
												</div>
											)}
										</div>
									</div>
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
			<Footer></Footer>
		</div>
	);
};

export default Notes;
