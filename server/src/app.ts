import express from 'express';
import cors from 'cors';
import { initDB } from './utils/db';

import authRouter from './routes/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import analyticsRouter from './routes/analytics';
import paymentRouter from './routes/payment';

// Seed and initialize JSON-file database
initDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for simplicity in local and preview testing
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API Mounts
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/payment', paymentRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express Error:', err);
  res.status(500).json({ error: 'حدث خطأ ما في الخادم الداخلي' });
});

export default app;
