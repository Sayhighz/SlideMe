import express from 'express';
import { updateOfferStatus } from '../controllers/offerController.js';

const router = express.Router();

router.post('/update_offer_status', updateOfferStatus);

export default router;