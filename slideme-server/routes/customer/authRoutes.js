import express from 'express';
import { 
  registerCustomer, 
  validateCustomer ,
  checkPhoneNumber
} from '../../controllers/customer/authController.js';

const router = express.Router();


// routes/customer.js

/**
 * @swagger
 * /api/v1/customer/auth/check-phone:
 *   post:
 *     summary: ตรวจสอบเบอร์โทรศัพท์
 *     description: | 
 *       - ตรวจสอบเบอร์โทรศัพท์
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "0812345678"
 *     responses:
 *       200:
 *         description: เบอร์โทรถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     phone_number:
 *                       type: string
 *                       example: "0812345678"
 *       400:
 *         description: กรุณาใส่เบอร์โทรศัพท์
 *       409:
 *         description: เบอร์โทรศัพท์ถูกใช้แล้ว
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.post("/check-phone", checkPhoneNumber);


/**
 * @swagger
 * /api/v1/customer/auth/register:
 *   post:
 *     summary: ลงทะเบียนลูกค้าใหม่
 *     description: | 
 *       - สร้างบัญชีลูกค้าใหม่ในระบบ
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "0812345678"
 *               first_name:
 *                 type: string
 *                 example: "สมชาย"
 *               last_name:
 *                 type: string
 *                 example: "ใจดี"
 *               email:
 *                 type: string
 *                 example: "somchai@example.com"
 *               username:
 *                 type: string
 *                 example: "somchai123"
 *     responses:
 *       201:
 *         description: ลงทะเบียนสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: integer
 *                     token:
 *                       type: string
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน
 *       409:
 *         description: เบอร์โทรศัพท์นี้ลงทะเบียนแล้ว
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.post('/register', registerCustomer);



export default router;