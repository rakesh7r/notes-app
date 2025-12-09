import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { logout } from './features/auth/authSlice';
import { Login } from './features/auth/Login';
import { NoteList } from './features/notes/NoteList';
import { NoteEditor } from './features/notes/NoteEditor';
import { ThemeToggle } from './features/theme/ThemeToggle';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import './App.css';
import { useCRDTHandler } from './hooks/useCRDTHandler';

function App() {
	const user = useAppSelector((state) => state.auth.user);
	const theme = useAppSelector((state) => state.theme.mode);
	const dispatch = useAppDispatch();
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const isOnline = useOnlineStatus();
	useCRDTHandler();

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	if (!user) {
		return <Login />;
	}
	// added dummy string to test github actions
	return (
		<div className='app-container'>
			{!isOnline && (
				<div
					style={{
						position: 'fixed',
						bottom: 0,
						left: 0,
						right: 0,
						backgroundColor: '#ce3b30ff',
						color: 'white',
						textAlign: 'center',
						padding: '0.5rem',
						zIndex: 1000,
					}}>
					You are currently offline. Changes will be saved locally and pushed to cloud when you're connected to the
					internet.
				</div>
			)}
			<div
				style={{
					position: 'absolute',
					top: '1rem',
					right: '1rem',
					zIndex: 100,
					display: 'flex',
					gap: '0.5rem',
					alignItems: 'center',
				}}>
				<ThemeToggle />
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
