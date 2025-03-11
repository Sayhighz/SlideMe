import express from 'express';
import { loginUser, registerDriver, validateCustomer } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register_driver', registerDriver);
router.get('/validate_customer', validateCustomer)

export default router;
