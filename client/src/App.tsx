import { useState } from 'react';
import { NoteList } from './features/notes/NoteList';
import { NoteEditor } from './features/notes/NoteEditor';
import './App.css';

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <div className="app-container">
      <NoteList 
        selectedNoteId={selectedNoteId} 
        onSelectNote={setSelectedNoteId} 
      />
      <NoteEditor noteId={selectedNoteId} />
    </div>
  );
}

export default App;
