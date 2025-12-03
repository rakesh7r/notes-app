import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
}

const loadNotes = (): Note[] => {
  try {
    const serializedNotes = localStorage.getItem('notes');
    if (serializedNotes === null) {
      return [];
    }
    return JSON.parse(serializedNotes);
  } catch (err) {
    return [];
  }
};

const initialState: NotesState = {
  notes: loadNotes(),
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<{ title: string; content: string }>) => {
      const newNote: Note = {
        id: uuidv4(),
        title: action.payload.title,
        content: action.payload.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.notes.push(newNote);
      localStorage.setItem('notes', JSON.stringify(state.notes));
    },
    updateNote: (state, action: PayloadAction<{ id: string; title: string; content: string }>) => {
      const { id, title, content } = action.payload;
      const existingNote = state.notes.find((note) => note.id === id);
      if (existingNote) {
        existingNote.title = title;
        existingNote.content = content;
        existingNote.updatedAt = new Date().toISOString();
        localStorage.setItem('notes', JSON.stringify(state.notes));
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      localStorage.setItem('notes', JSON.stringify(state.notes));
    },
  },
});

export const { addNote, updateNote, deleteNote } = notesSlice.actions;

export default notesSlice.reducer;
