import express from 'express';
import { addBookmark, checkStatusOrder, disableBookmark, editAddress, getServiceInfo, getuserBookmarks, orderStatus , deleteBookmark} from '../controllers/customerController.js';

const router = express.Router();

/**
 * @swagger
*    tags:
 *   name: Customer
 *   description: Customer Operations (4 APIs)
 * /customer/edit_address:
 *   post:
 *     tags:
 *       - Customer
 * 
 *     summary: แก้ไขข้อมูลที่อยู่ของผู้ใช้
 *     description: |
 *       API นี้ใช้สำหรับการอัปเดตข้อมูลที่อยู่ของผู้ใช้ในระบบ
 * 
 *       จำเป็นต้องใช้ `address_id` เพื่อตั้งค่าที่อยู่ที่ต้องการแก้ไขและ `vehicletype_id` เพื่อตั้งค่าประเภทรถ
 * 
 *       และสามารถระบุ `save_name`, `location_from`, `pickup_lat`, `pickup_long`, `location_to`, `dropoff_lat`, `dropoff_long` หรือไม่ก็ได้
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               save_name:
 *                 type: string
 *                 description: ชื่อที่บันทึกไว้สำหรับที่อยู่
 *                 example: "บ้าน"
 *               location_from:
 *                 type: string
 *                 description: ที่อยู่จุดเริ่มต้น
 *                 example: "บ้าน"
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
 *               location_to:
 *                 type: string
 *                 description: ที่อยู่จุดปลายทาง
 *                 example: "สำนักงาน"
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
 *               vehicletype_id:
 *                 type: integer
 *                 description: รหัสประเภทยานพาหนะ
 *                 example: 1
 *               address_id:
 *                 type: integer
 *                 description: รหัสที่อยู่ที่ต้องการแก้ไข
 *                 example: 96
 *     responses:
 *       200:
 *         description: อัปเดตที่อยู่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: true
 *                 AffectedRows:
 *                   type: integer
 *                   example: 1
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
 *                   example: "กรุณาระบุ save_name, location_from, pickup_lat, pickup_long, location_to, dropoff_lat, dropoff_long, vehicletype_id และ address_id"
 *       404:
 *         description: ไม่พบที่อยู่ที่ต้องการแก้ไข
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
 *                   example: "ไม่พบที่อยู่ที่มี address_id นี้"
 *       500:
 *         description: เกิดข้อผิดพลาดในการอัปเดตข้อมูล
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

 

router.post('/edit_address', editAddress )

/**
 * @swagger
 * /customer/add_bookmark:
 *   post:
 *     tags:
 *       - Customer
 *     summary: เพิ่มที่อยู่ใน Bookmark
 *     description: |
 *       สามารถเพิ่มที่อยู่ใหม่เข้าไปในรายการ Bookmark ของตัวเอง 
 * 
 *       จำเป็นต้องระบุ `customer_id`
 * 
 *       โดยลูกค้าสามารถระบุข้อมูลที่อยู่ เช่น `save_name`, `location_from`, `pickup_lat`, `pickup_long`, `location_to`, `dropoff_lat`, `dropoff_long` หรือไม่ก็ได้
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 description: รหัสลูกค้า
 *                 example: 90
 *               save_name:
 *                 type: string
 *                 description: ชื่อที่บันทึกที่อยู่
 *                 example: "บ้าน"
 *               location_from:
 *                 type: string
 *                 description: ที่อยู่จุดเริ่มต้น
 *                 example: "บ้าน"
 *               pickup_lat:
 *                 type: number
 *                 format: double
 *                 description: ละติจูดจุดรับ
 *                 example: 13.7563
 *               pickup_long:
 *                 type: number
 *                 format: double
 *                 description: ลองจิจูดจุดรับ
 *                 example: 100.5018
 *               location_to:
 *                 type: string
 *                 description: ที่อยู่จุดปลายทาง
 *                 example: "สำนักงาน"
 *               dropoff_lat:
 *                 type: number
 *                 format: double
 *                 description: ละติจูดจุดส่ง
 *                 example: 13.7563
 *               dropoff_long:
 *                 type: number
 *                 format: double
 *                 description: ลองจิจูดจุดส่ง
 *                 example: 100.5018
 *               vehicletype_id:
 *                 type: integer
 *                 description: รหัสประเภทยานพาหนะ
 *                 example: 1
 *     responses:
 *       200:
 *         description: ที่อยู่ถูกเพิ่มเรียบร้อยแล้ว
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
 *                   example: "ที่อยู่ถูกเพิ่มเรียบร้อยแล้ว"    
 *       400:
 *         description: ข้อมูลที่กรอกไม่ถูกต้อง
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
 *                   example: "ข้อมูลที่กรอกไม่ถูกต้อง"
 *       404:
 *         description: ไม่พบที่อยู่
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
 *                   example: "ไม่พบที่อยู่"
 *       500:
 *         description: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
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
 *                   example: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์"
 */



router.post('/add_bookmark', addBookmark)

/**
 * @swagger
 * /customer/disable_bookmark:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Disable a bookmark by marking it as deleted
 *     description: |
 *       API นี้จะทำการตั้งสถานะที่อยู่ให้เป็น "ลบ" (soft delete)
 *       ซึ่งจะทำให้ที่อยู่ไม่แสดงในรายการ Bookmark ของผู้ใช้
 * 
 *       จำเป็นให้ระบุ `address_id` เพื่อที่อยู่ที่จะถูกตั้งสถานะให้ลบ
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_id:
 *                 type: integer
 *                 description: รหัสที่อยู่ที่จะถูกตั้งสถานะให้ลบ
 *                 example: 100
 *     responses:
 *       200:
 *         description: ที่อยู่ถูกลบเรียบร้อยแล้ว
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
 *                   example: "ที่อยู่ถูกลบเรียบร้อยแล้ว"
 *       404:
 *         description: ไม่พบที่อยู่
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
 *                   example: "ไม่พบที่อยู่ที่ต้องการลบ"
 *       500:
 *         description: เกิดข้อผิดพลาดในการลบที่อยู่
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
 *                   example: "เกิดข้อผิดพลาดในการลบที่อยู่"
 */

router.post('/disable_bookmark', disableBookmark)



/**
 * @swagger
 * /customer/getuserBookmarks:
 *   get:
 *     tags:
 *       - Customer
 *         
 * 
 *     summary: ดึงข้อมูล Bookmark ของผู้ใช้ตาม customer_id
 *     description: API นี้จะดึงข้อมูล Bookmark ของผู้ใช้ที่ระบุ `customer_id`
 *     parameters:
 *       - name: customer_id
 *         in: query
 *         description: รหัสผู้ใช้ (customer_id)
 *         required: true
 *
 *         schema:
 *           type: integer
 *           example: 90
 *     responses:
 *       200:
 *         description: คำขอสำเร็จและข้อมูล Bookmark ถูกดึงมาเรียบร้อย
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
 *                       address_id:
 *                         type: integer
 *                       save_name:
 *                         type: string
 *                       location_from:
 *                         type: string
 *                       pickup_lat:
 *                         type: number
 *                         format: float
 *                       pickup_long:
 *                         type: number
 *                         format: float
 *                       location_to:
 *                         type: string
 *                       dropoff_lat:
 *                         type: number
 *                         format: float
 *                       dropoff_long:
 *                         type: number
 *                         format: float
 *                       vehicletype_id:
 *                         type: integer
 *       404:
 *         description: ไม่พบข้อมูล Bookmark สำหรับ customer_id นี้
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
 *                   example: "ไม่พบข้อมูล Bookmark"
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
 *                   example: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์"
 */

router.get('/getuserbookmarks', getuserBookmarks)


/**
 * @swagger
 * /customer/delete_bookmark/{address_id}:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: ลบ Bookmark ของผู้ใช้
 *     description: API นี้จะลบ Bookmark ของผู้ใช้ที่ระบุ `address_id`
 *     parameters:
 *       - name: address_id
 *         in: path
 *         description: รหัส Bookmark (address_id)
 *         required: true
 *         schema:
 *           type: integer
 *           example: 90
 *     responses:
 *       200:   
 *         description: คำขอสำเร็จและ Bookmark ถูกลบเรียบร้อย
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
 *                   example: "Bookmark ถูกลบเรียบร้อย"
 *       404:
 *         description: ไม่พบ Bookmark ที่ต้องการลบ
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
 *                   example: "ไม่พบ Bookmark"
 */


router.delete('/delete_bookmark/:address_id', deleteBookmark)

router.get('/getServiceInfo', getServiceInfo)
router.get('/order_status/:customer_id', orderStatus)
router.get('/checkStatusOrder/:request_id', checkStatusOrder)

export default router;
