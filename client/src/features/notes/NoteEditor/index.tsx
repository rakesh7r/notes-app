import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateNote, type Note } from '../notesSlice';
import { updateNote as updateNoteApi } from '../../../services/api';
import styles from './index.module.css';
import idb from '../../../services/idb';
import { v4 as uuidv4 } from 'uuid';

interface NoteEditorProps {
	noteId: string | null;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
	const dispatch = useAppDispatch();
	const notes = useAppSelector((state) => state.notes);
	const note = notes.notes?.find((n) => n?.id === noteId);

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (note) {
			setTitle(note.title);
			setContent(note.content);
		}
	}, [note]);

	const debouncedUpdate = (id: string, newTitle: string, newContent: string) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			try {
				const updatedNote = await updateNoteApi({ id, title: newTitle, content: newContent });
				dispatch(updateNote(updatedNote));
			} catch (error: any) {
				console.error('Failed to update note:', error);
				if (error?.code === 'ERR_NETWORK') {
					const idempotencyKey = uuidv4();
					await idb.put(
						'offline-notes',
						{
							action: 'updateNote',
							body: { id, title: newTitle, content: newContent },
						},
						idempotencyKey
					);
					dispatch(updateNote({ id, title: newTitle, content: newContent } as Note));
				}
			}
		}, 500);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTitle(newTitle);
		if (noteId) {
			debouncedUpdate(noteId, newTitle, content);
		}
	};

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value;
		setContent(newContent);
		if (noteId) {
			debouncedUpdate(noteId, title, newContent);
		}
	};

	if (!noteId || !note) {
		return <div className={styles.emptyState}>Select a note to view or edit</div>;
	}

	return (
		<div className={styles.container}>
			<input
				type='text'
				className={styles.titleInput}
				placeholder='Note Title'
				value={title}
				onChange={handleTitleChange}
			/>
			<textarea
				className={styles.contentInput}
				placeholder='Start typing...'
				value={content}
				onChange={handleContentChange}
			/>
		</div>
	);
};
