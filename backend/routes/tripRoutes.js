import express from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getTrips).post(protect, admin, createTrip);
router.route('/:id').get(getTripById).put(protect, admin, updateTrip).delete(protect, admin, deleteTrip);

export default router;
