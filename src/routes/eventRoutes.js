import express from 'express';
import { validateEvent } from '../middleware/validation.js';
import {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventLogs
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', validateEvent, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id/logs', getEventLogs);

export default router;



