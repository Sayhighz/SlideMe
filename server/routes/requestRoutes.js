import express from 'express';
import { 
    addRequest, 
    getServiceHistory, 
    getRequests, 
    getRequestDetailForDriver 
} from '../controllers/requestController.js';

const router = express.Router();

router.post("/add_request", addRequest);
router.get("/service_history_customer", getServiceHistory);
router.get("/getRequests", getRequests);
router.get("/getRequestDetailForDriver", getRequestDetailForDriver);

export default router;
