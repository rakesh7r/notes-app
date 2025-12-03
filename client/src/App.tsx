import { useState } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { logout } from './features/auth/authSlice';
import { Login } from './features/auth/Login';
import { NoteList } from './features/notes/NoteList';
import { NoteEditor } from './features/notes/NoteEditor';
import './App.css';

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
         <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
      <NoteList 
        selectedNoteId={selectedNoteId} 
        onSelectNote={setSelectedNoteId} 
      />
      <NoteEditor noteId={selectedNoteId} />
    </div>
  );
}

export default App;
