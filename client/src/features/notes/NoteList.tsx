import React from 'react';
import { Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addNote, deleteNote } from './notesSlice';
import { NoteItem } from './NoteItem';
import styles from './NoteList.module.css';

interface NoteListProps {
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ selectedNoteId, onSelectNote }) => {
  const notes = useAppSelector((state) => state.notes.notes);
  const dispatch = useAppDispatch();

  const handleAddNote = () => {
    const newNote = {
      title: '',
      content: '',
    };
    dispatch(addNote(newNote));
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id));
      if (selectedNoteId === id) {
        onSelectNote('');
      }
    }
  };

  // Sort notes by updatedAt descending
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Notes</h2>
        <button className={styles.addBtn} onClick={handleAddNote} title="New Note">
          <Plus size={20} />
        </button>
      </div>
      <div className={styles.list}>
        {sortedNotes.length === 0 ? (
          <div className={styles.empty}>No notes yet. Click + to add one.</div>
        ) : (
          sortedNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={selectedNoteId === note.id}
              onClick={() => onSelectNote(note.id)}
              onDelete={(e) => handleDeleteNote(e, note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
