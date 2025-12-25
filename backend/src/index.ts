import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';

import noteRouter from './noteRouter';
import { initDB } from './db/init';

import { requestLogger } from './middleware/requestLogger';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/notes', noteRouter);

app.get('/health', (req: Request, res: Response) => {
	res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Export app for testing
export { app };

if (require.main === module) {
	initDB().then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	});
}
