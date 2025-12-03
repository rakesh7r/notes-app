import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Note {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
    userId: string
}

interface NotesState {
    notes: Note[]
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: NotesState = {
    notes: [],
    status: "idle",
    error: null,
}

export const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setNotes: (state, action: PayloadAction<Note[]>) => {
            state.notes = action.payload
            state.status = "succeeded"
        },
        addNote: (state, action: PayloadAction<Note>) => {
            state.notes.push(action.payload)
        },
        updateNote: (state, action: PayloadAction<Note>) => {
            const index = state.notes.findIndex((note) => note.id === action.payload.id)
            if (index !== -1) {
                state.notes[index] = action.payload
            }
        },
        deleteNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter((note) => note.id !== action.payload)
        },
        setLoading: (state) => {
            state.status = "loading"
        },
        setError: (state, action: PayloadAction<string>) => {
            state.status = "failed"
            state.error = action.payload
        },
    },
})

export const { setNotes, addNote, updateNote, deleteNote, setLoading, setError } = notesSlice.actions

export default notesSlice.reducer
