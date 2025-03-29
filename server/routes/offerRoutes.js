import express from 'express';
import { updateOfferStatus , chooseOffer } from '../controllers/offerController.js';

const router = express.Router();

router.post('/update_offer_status', updateOfferStatus);
router.get('/chooseoffer', chooseOffer)

export default router;