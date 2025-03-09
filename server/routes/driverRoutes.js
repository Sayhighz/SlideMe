import express from 'express';
import { 
    offerPrice, 
    getOffersFromDriver, 
    cancelOffer, 
    getDrivers 
} from '../controllers/driverController.js';

const router = express.Router();

router.post("/offer_price", offerPrice);
router.get("/getOffersFromDriver", getOffersFromDriver);
router.post("/cancel_offer", cancelOffer);
router.get("/drivers", getDrivers);

export default router;
