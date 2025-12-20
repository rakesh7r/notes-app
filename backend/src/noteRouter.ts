import { Router } from 'express';
import pool from './db';
import { authenticateToken } from './middleware/authMiddleware';

const noteRouter = Router();

noteRouter.use(authenticateToken);

// Get all notes for a user
noteRouter.get('/', async (req, res) => {
	const { email } = req.query;

	if (!email || typeof email !== 'string') {
		res.status(400).json({ error: 'Email is required' });
		return;
	}

	try {
		const result = await pool.query('SELECT * FROM "Note" WHERE "userId" = $1 ORDER BY "updatedAt" DESC', [email]);
		res.json(result.rows);
	} catch (error) {
		console.error('Error fetching notes:', error);
		res.status(500).json({ error: 'Failed to fetch notes' });
	}
});

// Create a note
noteRouter.post('/', async (req, res) => {
	const { title, content, email, name, id } = req.body;

	if (!email || !title) {
		res.status(400).json({ error: 'Email and title are required' });
		return;
	}

	try {
		// Ensure user exists
		await pool.query(
			'INSERT INTO "User" ("email", "name") VALUES ($1, $2) ON CONFLICT ("email") DO UPDATE SET "name" = COALESCE($2, "User"."name")',
			[email, name || 'Unknown']
		);

		const result = await pool.query(
			'INSERT INTO "Note" ("id", "title", "content", "userId", "updatedAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
			[id, title, content || '', email]
		);

		res.json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to create note' });
	}
});

// Update a note
noteRouter.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;

	try {
		const result = await pool.query(
			'UPDATE "Note" SET "title" = $1, "content" = $2, "updatedAt" = NOW() WHERE "id" = $3 RETURNING *',
			[title, content, id]
		);
		res.json(result.rows[0]);
	} catch (error) {
		console.error('Error updating note:', error);
		res.status(500).json({ error: 'Failed to update note' });
	}
});

// Delete a note
noteRouter.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		await pool.query('DELETE FROM "Note" WHERE "id" = $1', [id]);
		res.json({ message: 'Note deleted' });
	} catch (error) {
		console.error('Error deleting note:', error);
		res.status(500).json({ error: 'Failed to delete note' });
	}
});

export default noteRouter;
