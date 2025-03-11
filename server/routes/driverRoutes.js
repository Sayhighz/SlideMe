import express from 'express';
import { 
    offerPrice, 
    getOffersFromDriver, 
    cancelOffer, 
    getDrivers, 
    score,
    profitToday,
    driverOffers,
    getInfo,
    chooseOffer,
    getHistory,
    Notifications,
    rejectAllOffers,
    editProfile,
    driverLocation,
    UpdateLocation,
    fetchDriverInfo
} from '../controllers/driverController.js';

const router = express.Router();

router.post("/offer_price", offerPrice);
router.get("/getOffersFromDriver", getOffersFromDriver);
router.post("/cancel_offer", cancelOffer);
router.get("/drivers", getDrivers);

router.get('/score', score);
router.get('/profitToday' , profitToday)
router.get('/driveroffers', driverOffers)
router.get('/getinfo', getInfo)
router.get('/chooseoffer', chooseOffer)
router.get('/getHistory', getHistory)
router.get('/notifications', Notifications)
router.post('/reject_all_offers', rejectAllOffers)
router.post('/edit_profile', editProfile)
router.get('/driverlocation/:user_id', driverLocation)
router.post('/update_location', UpdateLocation)
router.get('/fetch_driver_info/:customer_id/:driver_id/:request_id',fetchDriverInfo)

export default router;
