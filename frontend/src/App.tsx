import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Note as model } from './models/note';
import Note from './components/Note';
import styles from './styles/NotesPage.module.css';
import stylesUtils from './styles/utils.module.css';
import * as notesAPI from "./network/notes_api";
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from "react-icons/fa";

function App() {
	const [notes, setNotes] = useState<model[]>([]);

	const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
	const [noteToEdit, setNoteToEdit] = useState<model|null>(null);

	useEffect(() => {
		async function loadNotes() {
			try {
				const notes = await notesAPI.fetchNotes();
				setNotes(notes);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		}

		loadNotes();
	}, []);

	async function deleteNote(note: model) {
		try {
			await notesAPI.deleteNote(note._id);
			setNotes(notes.filter(existingNote => existingNote._id !== note._id))
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	return (
		<Container>
			<Button 
				className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
				onClick={() => setShowAddNoteDialog(true)}>
					<FaPlus />
					Add new note</Button>	

			<Row xs={1} md={2} xl={3} className='g-4'>
				{notes.map(note => (
					<Col key={note._id}>
						<Note 
							note={note} 
							onNoteClicked={setNoteToEdit}
							onDeleteNoteClicked={deleteNote} 
							className={styles.note} />
					</Col>
				))}
			</Row>

			{ showAddNoteDialog && 
				<AddEditNoteDialog 
					onDismiss={() => setShowAddNoteDialog(false)} 
					onNoteSaved={(newNote) => {
						setNotes([...notes, newNote])
						setShowAddNoteDialog(false)
					}} /> 
			}

			{ noteToEdit &&
				<AddEditNoteDialog
					noteToEdit={noteToEdit}
					onDismiss={() => setNoteToEdit(null)}
					onNoteSaved={(updatedNote) => {
						setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
						setNoteToEdit(null);
					}} />
			}
		</Container>
	);
}

export default App;
