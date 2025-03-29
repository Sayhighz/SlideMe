import express from 'express';
import { 
    offerPrice, 
    getOffersFromDriver, 
    cancelOffer, 
    getDrivers, 
    score,
    profitToday,
    driverOffers,
    getInfo,
    getHistory,
    Notifications,
    rejectAllOffers,
    editProfile,
    driverLocation,
    UpdateLocation,
    fetchDriverInfo
} from '../controllers/driverController.js';

const router = express.Router();

router.post("/offer_price", offerPrice);
router.get("/getOffersFromDriver", getOffersFromDriver);
router.post("/cancel_offer", cancelOffer);
router.get("/drivers", getDrivers);

router.get('/score', score);
router.get('/profitToday' , profitToday)
router.get('/driveroffers', driverOffers)
router.get('/getinfo', getInfo)
router.get('/getHistory', getHistory)
router.get('/notifications', Notifications)
router.post('/reject_all_offers', rejectAllOffers)
router.post('/edit_profile', editProfile)

/**
 * @swagger
 * /driver/driverlocation/{driver_id}:
 *   get:
 *     summary: ดึงตำแหน่งปัจจุบันของคนขับ
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: driver_id
 *         required: true
 *         description: ID ของคนขับที่ต้องการค้นหาตำแหน่ง
 *         schema:
 *           type: integer
 *           example: 91
 *     responses:
 *       200:
 *         description: ตำแหน่งปัจจุบันของคนขับ
 *       400:
 *         description: ค่า driver_id ไม่ถูกต้อง
 *       404:
 *         description: ไม่พบคนขับในระบบ
 *       500:
 *         description: ข้อผิดพลาดของฐานข้อมูล
 */
router.get('/driverlocation/:driver_id', driverLocation)
router.post('/update_location', UpdateLocation)

/**
 * @swagger
 * /driver/fetch_driver_info/{customer_id}/{driver_id}/{request_id}:
 *   get:
 *     summary: ดึงข้อมูลของคนขับที่รับงาน
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         description: ID ของลูกค้า
 *         schema:
 *           type: integer
 *           example: 90
 *       - in: path
 *         name: driver_id
 *         required: true
 *         description: ID ของคนขับ
 *         schema:
 *           type: integer
 *           example: 86
 *       - in: path
 *         name: request_id
 *         required: true
 *         description: ID ของคำขอบริการ
 *         schema:
 *           type: integer
 *           example: 353
 *     responses:
 *       200:
 *         description: ดึงข้อมูลของคนขับที่ได้รับงานสำเร็จ
 *       400:
 *         description: ข้อมูลที่ส่งมาไม่ถูกต้อง
 *       500:
 *         description: ข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.get('/fetch_driver_info/:customer_id/:driver_id/:request_id',fetchDriverInfo)

export default router;
