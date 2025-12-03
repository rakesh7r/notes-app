import React, { useEffect } from "react"
import { Plus } from "lucide-react"
import { useAppSelector, useAppDispatch } from "../../../app/hooks"
import { setNotes, addNote, deleteNote } from "../notesSlice"
import { fetchNotes, createNote, deleteNote as deleteNoteApi } from "../../../services/api"
import { NoteItem } from "../NoteItem"
import styles from "./index.module.css"

interface NoteListProps {
    selectedNoteId: string | null
    onSelectNote: (id: string) => void
}

export const NoteList: React.FC<NoteListProps> = ({ selectedNoteId, onSelectNote }) => {
    const notes = useAppSelector((state) => state.notes.notes)
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user?.email) {
            fetchNotes(user.email).then((data) => {
                dispatch(setNotes(data))
            })
        }
    }, [dispatch, user?.email])

    const handleAddNote = async () => {
        if (!user?.email) return

        const newNoteData = {
            title: "New Note",
            content: "",
        }

        try {
            const createdNote = await createNote(newNoteData, user.email, user.name || "Unknown")
            dispatch(addNote(createdNote))
        } catch (error) {
            console.error("Failed to create note:", error)
        }
    }

    const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                await deleteNoteApi(id)
                dispatch(deleteNote(id))
                if (selectedNoteId === id) {
                    onSelectNote("")
                }
            } catch (error) {
                console.error("Failed to delete note:", error)
            }
        }
    }

    // Sort notes by updatedAt descending
    const sortedNotes = notes && notes.length ? [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) : []
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
    )
}
