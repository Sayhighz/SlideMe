import express from 'express';
import { 
    addRequest, 
    getServiceHistory, 
    getRequests, 
    getRequestDetailForDriver, 
    updateServiceRequest,
    completeRequest,
    cancelRequest
} from '../controllers/requestController.js';

const router = express.Router();

router.post("/add_request", addRequest);
router.get("/service_history_customer", getServiceHistory);
router.get("/getRequests", getRequests);
router.get("/getRequestDetailForDriver", getRequestDetailForDriver);
router.post('/update_service_request',updateServiceRequest);
router.post('/complete_request', completeRequest)
router.post('/cancel_request' , cancelRequest)

export default router;
