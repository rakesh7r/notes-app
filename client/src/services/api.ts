import axios from "axios"
import type { Note } from "../features/notes/notesSlice"

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

const api = axios.create({
    baseURL: `${API_URL}/notes`,
    headers: {
        "Content-Type": "application/json",
    },
})

export const fetchNotes = async (email: string): Promise<Note[]> => {
    const response = await api.get(`/?email=${email}`)
    return response.data
}

export const createNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "userId">, email: string, name: string): Promise<Note> => {
    const response = await api.post("/", { ...note, email, name })
    return response.data
}

export const updateNote = async (note: Pick<Note, "id" | "title" | "content">): Promise<Note> => {
    const response = await api.put(`/${note.id}`, note)
    return response.data
}

export const deleteNote = async (id: string): Promise<void> => {
    await api.delete(`/${id}`)
}

export default api
