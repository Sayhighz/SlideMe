import express from 'express';
import { getAllNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/getAllNotifications', getAllNotifications);

export default router;
