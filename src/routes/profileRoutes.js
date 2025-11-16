import express from 'express';
import { validateProfile } from '../middleware/validation.js';
import {
  createProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
  getProfileEvents
} from '../controllers/profileController.js';

const router = express.Router();

router.post('/', validateProfile, createProfile);
router.get('/', getAllProfiles);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);
router.get('/:id/events', getProfileEvents);

export default router;
