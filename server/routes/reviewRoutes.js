import express from 'express';
import { addReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post("/add_reviews", addReview);

export default router;
