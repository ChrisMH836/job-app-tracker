import { config } from 'dotenv';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { connectDB, disconnectDB } from './config/db';
import authRoutes from './routes/authRoutes';

config();
connectDB();
const app: Express = express();

//middlewares
app.use(express.json());

app.use('/auth', authRoutes);

const PORT: number = 5001;

const server = app
  .listen(PORT, () => {
    console.log(`server created on port ${PORT}`);
  })
  .on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
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

process.on('SIGTERM', () => {
  console.log('SIGTERM recieved, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
