import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateNote } from './notesSlice';
import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  noteId: string | null;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) => 
    state.notes.notes.find((n) => n.id === noteId)
  );

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (noteId) {
      dispatch(updateNote({ id: noteId, title: newTitle, content }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (noteId) {
      dispatch(updateNote({ id: noteId, title, content: newContent }));
    }
  };

  if (!noteId || !note) {
    return (
      <div className={styles.emptyState}>
        Select a note to view or edit
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.titleInput}
        placeholder="Note Title"
        value={title}
        onChange={handleTitleChange}
      />
      <textarea
        className={styles.contentInput}
        placeholder="Start typing..."
        value={content}
        onChange={handleContentChange}
      />
    </div>
  );
};
