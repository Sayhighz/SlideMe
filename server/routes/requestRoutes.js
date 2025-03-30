import express from "express";
import {
  addRequest,
  getServiceHistory,
  getRequests,
  getRequestDetailForDriver,
  updateServiceRequest,
  completeRequest,
  cancelRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/add_request", addRequest);
router.get("/service_history_customer", getServiceHistory);
router.get("/getRequests", getRequests);
router.get("/getRequestDetailForDriver", getRequestDetailForDriver);

/**
 * @swagger
 * /request/update_service_request:
 *   post:
 *     summary: อัปเดตคำขอบริการ, การชำระเงิน, และข้อเสนอจากคนขับ
 *     description: |
 *       - สร้าง row ใหม่ในตาราง payments
 *       - อัปเดตราคาข้อเสนอ
 *     tags: [Requests]
 *     requestBody:
 *       description: ข้อมูลสำหรับการอัปเดตคำขอบริการ, การชำระเงิน, และข้อเสนอจากคนขับ
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: integer
 *                 example: 352
 *               customer_id:
 *                 type: integer
 *                 example: 90
 *               offer_id:
 *                 type: integer
 *                 example: 300
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 2500.50
 *               payment_method_id:
 *                 type: integer
 *                 example: 5
 *             required:
 *               - request_id
 *               - customer_id
 *               - offer_id
 *               - price
 *               - payment_method_id
 *     responses:
 *       200:
 *         description: อัปเดตคำขอบริการ, การชำระเงิน, และข้อเสนอจากคนขับสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบข้อมูลที่ตรงกันหรือข้อมูลได้ถูกอัปเดตแล้ว
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */

router.post("/update_service_request", updateServiceRequest); //yes
router.post("/complete_request", completeRequest);

/**
 * @swagger
 * /request/cancel_request:
 *   put:
 *     summary: ยกเลิกคำขอบริการ
 *     description: ยกเลิกคำขอบริการ
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: integer
 *                 description: รหัสคำขอที่ต้องการยกเลิก
 *                 example: 354
 *     responses:
 *       200:
 *         description: ยกเลิกคำขอเรียบร้อยแล้ว
 *       400:
 *         description: กรุณาระบุ request_id
 *       404:
 *         description: ไม่พบคำขอที่ต้องการยกเลิก
 *       500:
 *         description: เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์
 */
router.put("/cancel_request", cancelRequest); //yes

export default router;
