import React from 'react';
import { Trash2 } from 'lucide-react';
import { type Note } from '../notesSlice';
import styles from './index.module.css';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({ note, isActive, onClick, onDelete }) => {
  return (
    <div 
      className={`${styles.item} ${isActive ? styles.active : ''}`} 
      onClick={onClick}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{note.title || 'Untitled Note'}</h3>
        <button 
          className={styles.deleteBtn} 
          onClick={onDelete}
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className={styles.preview}>
        {note.content || 'No content'}
      </p>
      <span className={styles.date}>
        {new Date(note.updatedAt).toLocaleDateString()}
      </span>
    </div>
  );
};
