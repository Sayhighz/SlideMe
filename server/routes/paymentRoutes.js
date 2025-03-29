import express from "express";
import { 
    addPaymentMethod, 
    updatePaymentMethod, 
    disablePaymentMethod, 
    getAllUserPaymentMethods, 
    getPaymentMethod
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @swagger
 * /payment/payment-method/add:
 *   post:
 *     summary: เพิ่มวิธีการชำระเงินใหม่
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method_name:
 *                 type: string
 *                 example: Mastercard
 *               card_number:
 *                 type: string
 *                 example: "1234567890123456"
 *               card_expiry:
 *                 type: string
 *                 example: "12/26"
 *               card_cvv:
 *                 type: string
 *                 example: "123"
 *               cardholder_name:
 *                 type: string
 *                 example: "นนท์ธีร์"
 *               customer_id:
 *                 type: integer
 *                 example: 96
 *               amount:
 *                 type: number
 *                 example: 1000.01
 *               is_default:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: เพิ่มวิธีการชำระเงินเรียบร้อย !
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.post("/payment-method/add", addPaymentMethod);

/**
 * @swagger
 * /payment/payment-method/update:
 *   put:
 *     summary: อัปเดตข้อมูลวิธีการชำระเงิน
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_method_id
 *               - method_name
 *               - card_number
 *               - card_expiry
 *               - card_cvv
 *               - cardholder_name
 *             properties:
 *               payment_method_id:
 *                 type: integer
 *                 example: 4
 *               method_name:
 *                 type: string
 *                 example: Mastercard
 *               card_number:
 *                 type: string
 *                 example: "0987654321012345"
 *               card_expiry:
 *                 type: string
 *                 example: "12/40"
 *               card_cvv:
 *                 type: string
 *                 example: "456"
 *               cardholder_name:
 *                 type: string
 *                 example: "นนท์ธีร์ ปานะถึก"
 *     responses:
 *       200:
 *         description: อัปเดตวิธีการชำระเงินเรียบร้อย !
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: true
 *                 Message:
 *                   type: string
 *                   example: "อัปเดตวิธีการชำระเงินเรียบร้อย !"
 *                 AffectedRows:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน
 *       404:
 *         description: ไม่พบวิธีการชำระเงิน
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.put("/payment-method/update", updatePaymentMethod);


router.post("/payment-method/disable", disablePaymentMethod);


router.get("/payment-methods", getAllUserPaymentMethods);


router.get("/payment-method", getPaymentMethod);

export default router;
