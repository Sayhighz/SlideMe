import express from 'express';
import { 
    addRequest, 
    getServiceHistory, 
    getRequests, 
    getRequestDetailForDriver, 
    updateServiceRequest,
    completeRequest,
    cancelRequest
} from '../controllers/requestController.js';

const router = express.Router();


/**
 * @swagger
 * /request/add_Request:
 *   post:
 *     tags:
 *       - ServiceRequest
 *     summary: เพิ่มคำขอใหม่สำหรับลูกค้า
 *     description: |
 *       API นี้ใช้สำหรับเพิ่มคำขอใหม่สำหรับลูกค้าที่ต้องการใช้บริการ
 *
 *       โดยลูกค้าจะต้องกรอกข้อมูลที่อยู่และรายละเอียดการจองต่าง ๆ เช่น `pickup_lat`, `pickup_long`, `location_from`, `dropoff_lat`, `dropoff_long`, และ `vehicletype_id`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 description: รหัสลูกค้าที่ทำการจองบริการ
 *                 example: 90
 *               request_time:
 *                 type: string
 *                 format: date-time
 *                 description: เวลาที่ทำการขอจอง
 *                 example: "2023-04-01T10:00:00"
 *               pickup_lat:
 *                 type: number
 *                 format: float
 *                 description: ละติจูดจุดรับ
 *                 example: 13.7563
 *               pickup_long:
 *                 type: number
 *                 format: float
 *                 description: ลองจิจูดจุดรับ
 *                 example: 100.5018
 *               location_from:
 *                 type: string
 *                 description: ที่อยู่จุดเริ่มต้น
 *                 example: "บ้าน"
 *               dropoff_lat:
 *                 type: number
 *                 format: float
 *                 description: ละติจูดจุดส่ง
 *                 example: 13.7563
 *               dropoff_long:
 *                 type: number
 *                 format: float
 *                 description: ลองจิจูดจุดส่ง
 *                 example: 100.5018
 *               location_to:
 *                 type: string
 *                 description: ที่อยู่จุดปลายทาง
 *                 example: "สำนักงาน"
 *               vehicletype_id:
 *                 type: integer
 *                 description: รหัสประเภทของยานพาหนะ
 *                 example: 1
 *               booking_time:
 *                 type: string
 *                 format: date-time
 *                 description: เวลาที่ทำการจอง
 *                 example: "2023-04-01T10:30:00"
 *               customer_message:
 *                 type: string
 *                 description: ข้อความจากลูกค้า
 *                 example: "โปรดมารับตรงเวลาที่บ้าน"
 *     responses:
 *       201:
 *         description: คำขอถูกเพิ่มเรียบร้อยแล้ว
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: true
 *                 request_id:
 *                   type: integer
 *                   example: 123
 *                 Message:
 *                   type: string
 *                   example: "คำขอถูกเพิ่มเรียบร้อยแล้ว"
 *       400:
 *         description: ข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน
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
 *                   example: "กรุณาระบุ customer_id, request_time, pickup_lat, pickup_long, location_from, dropoff_lat, dropoff_long, location_to, vehicletype_id, booking_time, และ customer_message"
 *       500:
 *         description: เกิดข้อผิดพลาดในการเพิ่มคำขอ
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
 *                   example: "เกิดข้อผิดพลาดในการเพิ่มคำขอ"
 */
router.post("/add_request", addRequest);

/**
 * @swagger
 * /tags: ServiceRequest
 * tags:
 *   name: ServiceRequest
 *   description: ServiceRequest Operations (3 APIs)
 * /request/service_history_customer:
 *   get:
 *     tags:
 *       - ServiceRequest
 *     summary: ดึงประวัติการบริการของลูกค้าตาม customer_id
 *     description: |
 *       API นี้จะดึงประวัติการบริการทั้งหมดของลูกค้าจากฐานข้อมูล
 *       โดยใช้ `customer_id` เพื่อค้นหาประวัติการบริการของลูกค้า
 *     parameters:
 *       - name: customer_id
 *         in: query
 *         description: รหัสลูกค้า (customer_id)
 *         required: true
 *         schema:
 *           type: integer
 *           example: 90
 *     responses:
 *       200:
 *         description: คำขอสำเร็จและดึงข้อมูลประวัติการบริการเรียบร้อย
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: true
 *                 Result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicle_type:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       service_status:
 *                         type: string
 *                       origin:
 *                         type: string
 *                       destination:
 *                         type: string
 *                       service_charge:
 *                         type: number
 *                         format: float
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
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
 *                   example: "กรุณาระบุ customer_id"
 *       404:
 *         description: ไม่พบประวัติการบริการสำหรับ customer_id นี้
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
 *                   example: "ไม่พบประวัติการบริการสำหรับ customer_id นี้"
 *       500:
 *         description: เกิดข้อผิดพลาดในการดึงข้อมูล
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
 */


router.get("/service_history_customer", getServiceHistory);

/**
 * @swagger
 * /request/getRequests:
 *   get:
 *     tags:
 *       - ServiceRequest
 *     summary: ดึงข้อมูลคำขอที่มีสถานะ "pending"
 *     description: API นี้จะดึงข้อมูลคำขอทั้งหมดที่มีสถานะ "pending" จากฐานข้อมูล
 *     responses:
 *       200:
 *         description: คำขอสำเร็จและดึงข้อมูลคำขอที่มีสถานะ "pending" มาเรียบร้อย
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: true
 *                 Result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       request_id:
 *                         type: integer
 *                       pickup_lat:
 *                         type: number
 *                         format: float
 *                       pickup_long:
 *                         type: number
 *                         format: float
 *                       location_from:
 *                         type: string
 *                       dropoff_lat:
 *                         type: number
 *                         format: float
 *                       dropoff_long:
 *                         type: number
 *                         format: float
 *                       location_to:
 *                         type: string
 *                       booking_time:
 *                         type: string
 *                         format: date-time
 *                       vehicle_type:
 *                         type: string
 *                       customer_message:
 *                         type: string
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
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
 *                   example: "กรุณาตรวจสอบข้อมูลคำขอ"
 *       404:
 *         description: ไม่พบคำขอที่มีสถานะ "pending" ในระบบ
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
 *                   example: "ไม่พบคำขอที่มีสถานะ 'pending' ในระบบ"
 *       500:
 *         description: เกิดข้อผิดพลาดในการดึงข้อมูล
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
 */


router.get("/getRequests", getRequests);


router.get("/getRequestDetailForDriver", getRequestDetailForDriver);
router.post('/update_service_request',updateServiceRequest);
router.post('/complete_request', completeRequest)
router.post('/cancel_request' , cancelRequest)

export default router;
