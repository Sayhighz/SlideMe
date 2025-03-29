import express from 'express';
import { addBookmark, checkStatusOrder, disableBookmark, editAddress, getServiceInfo, getuserBookmarks, orderStatus } from '../controllers/customerController.js';

const router = express.Router();

router.post('/edit_address', editAddress )
router.post('/add_bookmark', addBookmark)
router.post('/disable_bookmark', disableBookmark)
router.get('/getuserbookmarks', getuserBookmarks)
router.get('/getServiceInfo', getServiceInfo)
router.get('/order_status/:customer_id', orderStatus)

/**
 * @swagger
 * /customer/checkStatusOrder/{request_id}:
 *   get:
 *     summary: ตรวจสอบสถานะคำขอ
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: request_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: หมายเลขคำขอที่ต้องการตรวจสอบ
 *     responses:
 *       200:
 *         description: สถานะของ request_id
 *       400:
 *         description: request_id ต้องเป็นตัวเลข
 *       404:
 *         description: ไม่พบคำขอ
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get('/checkStatusOrder/:request_id', checkStatusOrder) //yes

export default router;
