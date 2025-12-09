import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { NoteEditor } from './index';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from '../notesSlice';
import * as api from '../../../services/api';

vi.mock('../../../services/api', () => ({
	updateNote: vi.fn(),
}));

vi.mock('../../../services/idb', () => ({
	default: {
		put: vi.fn(),
	},
}));

const mockNote = {
	id: '1',
	title: 'Test Note',
	content: 'Initial content',
	userId: 'user1',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const createTestStore = (notes = []) => {
	return configureStore({
		reducer: {
			notes: notesReducer,
		},
		preloadedState: {
			notes: {
				notes: notes,
				status: 'idle' as 'idle',
				error: null,
			},
		},
	});
};

describe('NoteEditor', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders empty state when no note selected', () => {
		const store = createTestStore();
		render(
			<Provider store={store}>
				<NoteEditor noteId={null} />
			</Provider>
		);

		expect(screen.getByText('Select a note to view or edit')).toBeInTheDocument();
	});

	it('renders editor with note content', () => {
		const store = createTestStore([mockNote] as any);
		render(
			<Provider store={store}>
				<NoteEditor noteId='1' />
			</Provider>
		);

		expect(screen.getByPlaceholderText('Note Title')).toHaveValue('Test Note');
		expect(screen.getByPlaceholderText('Start typing...')).toHaveValue('Initial content');
	});

	it('updates note on input change (debounced)', async () => {
		const store = createTestStore([mockNote] as any);
		(api.updateNote as any).mockResolvedValue({
			...mockNote,
			title: 'Updated Title',
		});

		render(
			<Provider store={store}>
				<NoteEditor noteId='1' />
			</Provider>
		);

		const titleInput = screen.getByPlaceholderText('Note Title');
		fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

		// Fast-forward time for debounce (real timers)
		await new Promise((r) => setTimeout(r, 600));

		await waitFor(() => {
			expect(api.updateNote).toHaveBeenCalledWith({
				id: '1',
				title: 'Updated Title',
				content: 'Initial content',
			});
		});
	});
});
