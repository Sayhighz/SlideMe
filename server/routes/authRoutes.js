import express from 'express';
import { loginUser, registerDriver } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register_driver', registerDriver);

export default router;
