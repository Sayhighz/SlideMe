import express from 'express';
import { 
    addPaymentMethod, 
    updatePaymentMethod, 
    disablePaymentMethod, 
    getAllUserPaymentMethods, 
    getPaymentMethods
} from '../controllers/paymentController.js';

const router = express.Router();

router.post("/add_payment_method", addPaymentMethod);
router.post("/update_payment_method", updatePaymentMethod);
router.post("/disable_payment_method", disablePaymentMethod);
router.get("/getAllUserPaymentMethods", getAllUserPaymentMethods);
router.get('/get_payment_methods',getPaymentMethods)

export default router;
