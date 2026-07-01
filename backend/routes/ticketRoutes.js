import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getTickets).post(createTicket); // Khách hàng có thể tạo ticket, nhưng admin getTickets
router.route('/:id').get(protect, admin, getTicketById).put(protect, admin, updateTicket).delete(protect, admin, deleteTicket);

export default router;
