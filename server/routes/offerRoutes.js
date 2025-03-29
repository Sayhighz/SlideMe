import express from 'express';
import { updateOfferStatus , chooseOffer } from '../controllers/offerController.js';

const router = express.Router();

/**
 * @swagger
 * /offer/update_offer_status:
 *   post:
 *     summary: อัปเดตสถานะข้อเสนอจากคนขับ
 *     tags: [Offers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - request_id
 *               - driver_id
 *             properties:
 *               request_id:
 *                 type: integer
 *                 example: 352
 *               driver_id:
 *                 type: integer
 *                 example: 91
 *     responses:
 *       200:
 *         description: อัปเดตสถานะข้อเสนอเรียบร้อย
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง (request_id หรือ driver_id)
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */

router.post('/update_offer_status', updateOfferStatus);

/**
 * @swagger
 * /offer/chooseoffer:
 *   get:
 *     summary: ดึงข้อเสนอจากคนขับ
 *     tags: [Offers]
 *     parameters:
 *       - name: request_id
 *         in: query
 *         description: ID คำขอข้อเสนอ
 *         required: true
 *         schema:
 *           type: integer
 *           example: 352
 *     responses:
 *       200:
 *         description: การดึงข้อมูลข้อเสนอและตำแหน่ง รับรถ/ส่งรถ สำเร็จ
 *       400:
 *         description: กรุณาระบุ request_id
 *       404:
 *         description: ไม่พบข้อมูลข้อเสนอหรือข้อมูลตำแหน่ง
 *       500:
 *         description: ข้อผิดพลาดภายในเซิร์ฟเวอร์
 */

router.get('/chooseoffer', chooseOffer)

export default router;