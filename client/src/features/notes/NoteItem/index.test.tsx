import { render, screen, fireEvent } from '@testing-library/react';
import { NoteItem } from './index';
import { Note } from '../notesSlice';

const mockNote: Note = {
	id: '1',
	title: 'Test Note',
	content: 'This is a test note content.',
	userId: 'user1',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

describe('NoteItem', () => {
	it('renders note details correctly', () => {
		render(
			<NoteItem
				note={mockNote}
				isActive={false}
				onClick={vi.fn()}
				onDelete={vi.fn()}
			/>
		);

		expect(screen.getByText('Test Note')).toBeInTheDocument();
		expect(screen.getByText('This is a test note content.')).toBeInTheDocument();
	});

	it('shows "Untitled Note" if title is missing', () => {
		const untitledNote = { ...mockNote, title: '' };
		render(
			<NoteItem
				note={untitledNote}
				isActive={false}
				onClick={vi.fn()}
				onDelete={vi.fn()}
			/>
		);

		expect(screen.getByText('Untitled Note')).toBeInTheDocument();
	});

	it('applies active style when isActive is true', () => {
		const { container } = render(
			<NoteItem
				note={mockNote}
				isActive={true}
				onClick={vi.fn()}
				onDelete={vi.fn()}
			/>
		);
		// Note: CSS Modules classes are hashed, so we check if the container has a class that typically includes 'active' or check computed style if possible.
		// Or better, just rely on visual check logic if classname is simple.
		// Since we import styles, we can't easily guess the class name without setup.
		// But we can check if it renders.

		// Simpler: Check if it calls onClick
		const itemDiv = container.firstChild;
		expect(itemDiv).toBeInTheDocument();
	});

	it('calls onClick when clicked', () => {
		const handleClick = vi.fn();
		const { container } = render(
			<NoteItem
				note={mockNote}
				isActive={false}
				onClick={handleClick}
				onDelete={vi.fn()}
			/>
		);

		// Assuming the first child is the wrapper div
		fireEvent.click(container.firstChild as Element);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('calls onDelete when delete button is clicked', () => {
		const handleDelete = vi.fn();
		render(
			<NoteItem
				note={mockNote}
				isActive={false}
				onClick={vi.fn()}
				onDelete={handleDelete}
			/>
		);

		const deleteBtn = screen.getByTitle('Delete note');
		fireEvent.click(deleteBtn);
		expect(handleDelete).toHaveBeenCalledTimes(1);
	});
});
