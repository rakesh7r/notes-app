import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteList } from './index';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from '../notesSlice';
import authReducer from '../../auth/authSlice';
import * as api from '../../../services/api';

// Mock API
vi.mock('../../../services/api', () => ({
	fetchNotes: vi.fn(),
	createNote: vi.fn(),
	deleteNote: vi.fn(),
}));

vi.mock('../../../services/idb', () => ({
	default: {
		put: vi.fn(),
		get: vi.fn(),
		getAll: vi.fn(),
		delete: vi.fn(),
	},
}));

const mockNotes = [
	{
		id: '1',
		title: 'Note 1',
		content: 'Content 1',
		userId: 'user1',
		updatedAt: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	},
	{
		id: '2',
		title: 'Note 2',
		content: 'Content 2',
		userId: 'user1',
		updatedAt: new Date().toISOString(), // Older
		createdAt: new Date().toISOString(),
	},
];

const createTestStore = (preloadedNotes: any[] = []) => {
	return configureStore({
		reducer: {
			notes: notesReducer,
			auth: authReducer,
		},
		preloadedState: {
			auth: {
				user: {
					name: 'Test User',
					email: 'test@example.com',
					picture: 'url',
				},
				token: 'token',
			},
			notes: {
				notes: preloadedNotes,
				status: 'idle' as const,
				error: null,
			},
		},
	});
};

describe('NoteList', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders empty state when no notes', async () => {
		const store = createTestStore([]);
		// Mock fetchNotes response
		(api.fetchNotes as any).mockResolvedValue([]);

		render(
			<Provider store={store}>
				<NoteList
					selectedNoteId={null}
					onSelectNote={vi.fn()}
				/>
			</Provider>
		);

		await waitFor(() => {
			expect(screen.getByText('No notes yet. Click + to add one.')).toBeInTheDocument();
		});
	});

	it('renders list of notes', () => {
		const store = createTestStore(mockNotes as any);
		(api.fetchNotes as any).mockResolvedValue(mockNotes);

		render(
			<Provider store={store}>
				<NoteList
					selectedNoteId={null}
					onSelectNote={vi.fn()}
				/>
			</Provider>
		);

		expect(screen.getByText('Note 1')).toBeInTheDocument();
		expect(screen.getByText('Note 2')).toBeInTheDocument();
	});

	it('can create a new note', async () => {
		const store = createTestStore([]);
		(api.fetchNotes as any).mockResolvedValue([]);
		(api.createNote as any).mockResolvedValue({
			id: 'new-id',
			title: 'New Note',
			content: '',
			userId: 'test@example.com',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		render(
			<Provider store={store}>
				<NoteList
					selectedNoteId={null}
					onSelectNote={vi.fn()}
				/>
			</Provider>
		);

		const addBtn = screen.getByTitle('New Note');
		fireEvent.click(addBtn);

		await waitFor(() => {
			expect(api.createNote).toHaveBeenCalled();
			expect(screen.getByText('New Note')).toBeInTheDocument();
		});
	});

	it('can delete a note', async () => {
		const store = createTestStore(mockNotes as any);
		(api.fetchNotes as any).mockResolvedValue(mockNotes);
		(api.deleteNote as any).mockResolvedValue({});

		// Mock window.confirm
		const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

		render(
			<Provider store={store}>
				<NoteList
					selectedNoteId={null}
					onSelectNote={vi.fn()}
				/>
			</Provider>
		);

		const deleteBtns = screen.getAllByTitle('Delete note');
		fireEvent.click(deleteBtns[0]); // Delete first note

		await waitFor(() => {
			expect(api.deleteNote).toHaveBeenCalledWith('1');
			expect(screen.queryByText('Note 1')).not.toBeInTheDocument();
		});

		confirmSpy.mockRestore();
	});
});
