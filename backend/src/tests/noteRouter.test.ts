import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import pool from '../db';

// Mock the db module
vi.mock('../db', () => ({
	default: {
		query: vi.fn(),
	},
}));

// Mock Auth Middleware
vi.mock('../middleware/authMiddleware', () => ({
	authenticateToken: (req: any, res: any, next: any) => {
		req.user = { email: 'test@example.com', name: 'Test User' };
		next();
	},
}));

describe('Note Router', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /notes', () => {
		it('should return a list of notes for the user', async () => {
			const mockNotes = [
				{
					id: '1',
					title: 'Note 1',
					content: 'Content 1',
					userId: 'test@example.com',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];

			(pool.query as any).mockResolvedValue({ rows: mockNotes });

			const response = await request(app).get('/notes').query({ email: 'test@example.com' });

			expect(response.status).toBe(200);
			expect(response.body[0].title).toBe('Note 1');
			expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM "Note"'), ['test@example.com']);
		});
	});

	describe('POST /notes', () => {
		it('should create a new note', async () => {
			const newNote = {
				title: 'New Note',
				content: 'New Content',
				id: 'new-id',
				email: 'test@example.com',
				name: 'Test User',
			};
			const createdNote = {
				...newNote,
				userId: 'test@example.com',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			// Mock first query (User upsert)
			(pool.query as any).mockResolvedValueOnce({ rows: [] });
			// Mock second query (Note insert)
			(pool.query as any).mockResolvedValueOnce({ rows: [createdNote] });

			const response = await request(app).post('/notes').send(newNote);

			expect(response.status).toBe(200);
			expect(response.body.title).toBe('New Note');
			expect(pool.query).toHaveBeenCalledTimes(2);
		});
	});

	describe('DELETE /notes/:id', () => {
		it('should delete a note', async () => {
			const noteId = '1';
			(pool.query as any).mockResolvedValue({ rows: [] });

			const response = await request(app).delete(`/notes/${noteId}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Note deleted');
			expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM "Note"'), [noteId]);
		});
	});
});
