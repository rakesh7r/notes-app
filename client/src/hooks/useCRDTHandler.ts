import { useEffect, useRef } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { getAllNotesFromIDB } from '../utils/idb.ts';
import { createNote, deleteNote, updateNote } from '../services/api.ts';
import idb from '../services/idb.ts';

const performAction = async (note: any) => {
	switch (note.action) {
		case 'createNote':
			return await createNote(note.body, note.body.id, note.body.email);
		case 'updateNote':
			return await updateNote(note.body);
		case 'deleteNote':
			return await deleteNote(note.body.id);
		default:
			return;
	}
};

export function useCRDTHandler() {
	const isOnline = useOnlineStatus();
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		if (isOnline) {
			const syncNotes = async () => {
				getAllNotesFromIDB().then(async (notes) => {
					// for each note, send the request, if success, remove it from the idb else retry after the current queue
					notes.forEach(async (note) => {
						try {
							await performAction(note);
							await idb.delete('offline-notes', note.id);
						} catch (error) {
							console.error('Failed to sync note:', error);
							timerRef.current = setTimeout(() => {
								syncNotes();
							}, 5000);
						}
					});
				});
			};
			syncNotes();
		}
		return () => {
			clearTimeout(timerRef.current);
		};
	}, [isOnline]);
}
