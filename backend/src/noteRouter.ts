import { Router } from 'express';
import { prisma } from './prisma';
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
		const notes = await prisma.note.findMany({
			where: { userId: email },
			orderBy: { updatedAt: 'desc' },
		});
		res.json(notes);
	} catch (error) {
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
		await prisma.user.upsert({
			where: { email },
			update: {},
			create: {
				email,
				name: name || 'Unknown',
			},
		});

		const note = await prisma.note.create({
			data: {
				id,
				title,
				content: content || '',
				userId: email,
			},
		});
		res.json(note);
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
		const note = await prisma.note.update({
			where: { id },
			data: {
				title,
				content,
			},
		});
		res.json(note);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update note' });
	}
});

// Delete a note
noteRouter.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		await prisma.note.delete({
			where: { id },
		});
		res.json({ message: 'Note deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete note' });
	}
});

export default noteRouter;
