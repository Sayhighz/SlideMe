import express from 'express';
import { 
    addPaymentMethod, 
    updatePaymentMethod, 
    disablePaymentMethod, 
    getAllUserPaymentMethods, 
    getPaymentMethod
} from '../controllers/paymentController.js';

const router = express.Router();

router.post("/add_payment_method", addPaymentMethod);
router.post("/update_payment_method", updatePaymentMethod);
router.post("/disable_payment_method", disablePaymentMethod);
router.get("/getAllUserPaymentMethods", getAllUserPaymentMethods);
router.get('/get_payments_method',getPaymentMethod)

export default router;
