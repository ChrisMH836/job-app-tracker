import { config } from 'dotenv';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { connectDB, disconnectDB } from './config/db';

config();
connectDB();
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Working');
});

const PORT: number = 5001;

const server = app.listen(PORT, () => {
  console.log(`server created on port ${PORT}`);
});

//
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err);
  await disconnectDB();
  process.exit(1);
});

process.on('SIGTERMS', () => {
  console.log('SIGTERM recieved, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
