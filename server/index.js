import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import matchRoutes from './routes/matches.js';
import circleRoutes from './routes/circles.js';
import projectRoutes from './routes/projects.js';
import pactRoutes from './routes/pact.js';
import valueRoutes from './routes/values.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/circles', circleRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/pact', pactRoutes);
app.use('/api/v1/values', valueRoutes);

// Santé du serveur
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '✨ Le Rêve Commun est éveillé', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`\n✨ Serveur Le Rêve Commun lancé sur http://localhost:${PORT}`);
  console.log(`   Santé : http://localhost:${PORT}/api/health\n`);
});

export default app;
