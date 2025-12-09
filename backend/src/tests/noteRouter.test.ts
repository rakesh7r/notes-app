// Must mock prisma before importing app/router
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@/generated/prisma/client';

// 1. Mock the specific module path
vi.mock('../prisma', () => ({
	__esModule: true,
	prisma: mockDeep<PrismaClient>(),
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { prisma } from '../prisma'; // Import the mocked prisma
import { app } from '../index';

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;

beforeEach(() => {
	mockReset(prismaMock);
});

// Mock Auth Middleware
vi.mock('../middleware/authMiddleware', () => ({
	authenticateToken: (req: any, res: any, next: any) => {
		req.user = { email: 'test@example.com', name: 'Test User' };
		next();
	},
}));

describe('Note Router', () => {
	describe('GET /notes', () => {
		it('should return a list of notes for the user', async () => {
			const mockNotes = [
				{
					id: '1',
					title: 'Note 1',
					content: 'Content 1',
					userId: 'test@example.com',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			prismaMock.note.findMany.mockResolvedValue(mockNotes as any);

			const response = await request(app).get('/notes').query({ email: 'test@example.com' });

			expect(response.status).toBe(200);
			expect(response.body[0].title).toBe('Note 1');
			expect(prismaMock.note.findMany).toHaveBeenCalledWith({
				where: { userId: 'test@example.com' },
				orderBy: { updatedAt: 'desc' },
			});
		});
	});

	describe('POST /notes', () => {
		it('should create a new note', async () => {
			const newNote = {
				title: 'New Note',
				content: 'New Content',
				id: 'new-id',
				email: 'test@example.com', // Required by implementation
				name: 'Test User',
			};
			const createdNote = { ...newNote, userId: 'test@example.com', createdAt: new Date(), updatedAt: new Date() };

			prismaMock.user.upsert.mockResolvedValue({} as any);
			prismaMock.note.create.mockResolvedValue(createdNote as any);

			const response = await request(app).post('/notes').send(newNote);

			expect(response.status).toBe(200); // Implementation returns 200 (res.json defaults to 200) not 201
			expect(response.body.title).toBe('New Note');
			expect(prismaMock.user.upsert).toHaveBeenCalled();
			expect(prismaMock.note.create).toHaveBeenCalled();
		});
	});

	describe('DELETE /notes/:id', () => {
		it('should delete a note', async () => {
			const noteId = '1';
			prismaMock.note.delete.mockResolvedValue({ id: noteId } as any);

			const response = await request(app).delete(`/notes/${noteId}`);

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Note deleted');
			expect(prismaMock.note.delete).toHaveBeenCalledWith({
				where: { id: noteId },
			});
		});
	});
});
