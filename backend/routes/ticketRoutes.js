import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getMyTickets,
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getTickets).post(protect, createTicket);
router.route('/my-tickets').get(protect, getMyTickets);
router.route('/:id').get(protect, getTicketById).put(protect, updateTicket).delete(protect, admin, deleteTicket);

export default router;
