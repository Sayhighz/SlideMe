import express from 'express';
import { addReview } from '../controllers/reviewController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *     name: Review
 *     description: Review Operations (1 API)
 * 
 * /review/add_reviews:
 *   post:
 *     tags:
 *       - Review
 *     summary: เพิ่มรีวิวสําหรับคนขับ
 *     description: |
 *       API สำหรับเพิ่มรีวิวสําหรับคนขับ
 * 
 *       จำเป็นต้องระบุ `request_id`, `customer_id`, `driver_id`, `rating`, `review_text`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: integer
 *                 description: รหัสคำขอที่เชื่อมโยงกับการเดินทาง
 *                 example: 353
 *               customer_id:
 *                 type: integer
 *                 description: รหัสลูกค้าที่เพิ่มรีวิว
 *                 example: 90
 *               driver_id:
 *                 type: integer
 *                 description: รหัสคนขับ
 *                 example: 86
 *               rating:
 *                 type: integer
 *                 description: คะแนนที่ให้กับคนขับ (1 ถึง 5)
 *                 example: 4
 *               review_text:
 *                 type: string
 *                 description: ข้อความรีวิวที่ลูกค้าเขียนให้กับคนขับ
 *                 example: "คนขับขับดีและสุภาพ"
 *     responses:
 *       200:
 *         description: รีวิวถูกเพิ่มเรียบร้อยแล้ว
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: true
 *                 InsertId:
 *                   type: integer
 *                   example: 123
 *                 Message:
 *                   type: string
 *                   example: "รีวิวถูกเพิ่มเรียบร้อย"
 *       400:
 *         description: ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: false
 *                 Message:
 *                   type: string
 *                   example: "กรุณาระบุ request_id, customer_id, driver_id, rating, และ review_text"
 *       500:
 *         description: เกิดข้อผิดพลาดในการเพิ่มรีวิว (เช่น ข้อผิดพลาดที่ฐานข้อมูล)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: false
 *                 Error:
 *                   type: string
 *                   example: "ข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล"
 *                 Message:
 *                   type: string
 *                   example: "เกิดข้อผิดพลาดในการเพิ่มรีวิว"
 */


router.post("/add_reviews", addReview);

export default router;
