import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import { chatController } from './controllers/chat.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello World!' });
});

app.post('/api/chat', chatController.sendMessage);

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
