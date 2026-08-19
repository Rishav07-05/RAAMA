import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import publicRoutes from './routes/publicRoutes';
import qrRoutes from './routes/qrRoutes';
import adminRoutes from './routes/adminRoutes';
import { SocketService } from './services/SocketService';
import { initCleanupHoldJob } from './jobs/CleanupHoldJob';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_raama';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security & Body Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

// 2. Register Routes
app.use('/api', publicRoutes);
app.use('/api', qrRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), service: 'Hotel Raama Backend API' });
});

// 3. Initialize Socket.IO Server & Cron Job
SocketService.init(httpServer, CLIENT_URL);
initCleanupHoldJob();

// 4. Connect MongoDB & Start HTTP Server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('[MongoDB] Connected successfully to hotel_raama database.');
    httpServer.listen(PORT, () => {
      console.log(`[Server] Hotel Raama Backend API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB Error] Connection failed:', err);
    process.exit(1);
  });

export { app, httpServer };
