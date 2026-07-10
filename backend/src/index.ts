import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { getPrisma } from './db.js';
import { initSocket } from './sockets/quizSocket.js';
import quizRoutes from './routes/quiz.js';
import { createSessionRouter } from './routes/session.js';
import resultsRoutes from './routes/results.js';
import leaderboardRoutes from './routes/leaderboard.js';
import metricsRoutes from './routes/metrics.js';
import { createTambolaRouter } from './routes/tambola.js';

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Initialize Prisma client
getPrisma();

// Routes that don't need the Socket.io instance
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/metrics', metricsRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Create HTTP server and attach Socket.io
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
});

// Initialize Socket.io
initSocket(io);

// Mount routes that push real-time updates after io is created
app.use('/api', createSessionRouter(io));
app.use('/api/tambola', createTambolaRouter(io));

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
