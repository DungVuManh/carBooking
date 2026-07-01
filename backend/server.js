import express from 'express';
import dotenv from 'dotenv';
import './config/db.js'; // Tự động kết nối MongoDB khi import

// Import Routes
import userRoutes from './routes/userRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Import Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware parse JSON
app.use(express.json());

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

// Route chính kiểm tra server
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chào mừng bạn đến với API Car Booking!',
  });
});

// Middleware xử lý 404 và Error
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`URL check: http://localhost:${PORT}`);
});