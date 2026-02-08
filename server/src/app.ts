import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Routes
import authRoutes from './routes/api/v1/auth';
import postRoutes from './routes/api/v1/posts';
import opportunityRoutes from './routes/api/v1/opportunities';
import recommendationRoutes from './routes/api/v1/recommendations';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;