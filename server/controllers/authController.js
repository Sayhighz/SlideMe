import jwt from "jsonwebtoken";
import con from "../config/db.js";



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: สำหรับเข้าสู่ระบบของคนขับ
 *     description: |
*       <ul>
*         <li>API นี้ใช้สำหรับเข้าสู่ระบบของคนขับรถ (Driver)</li>
*         <li>รับข้อมูล:
*           <ul>
*             <li><code>phone_number</code> เบอร์โทรศัพท์ของคนขับ</li>
*             <li><code>password</code> รหัสผ่าน</li>
*           </ul>
*         </li>
*         <li>ขั้นตอนการทำงาน:
*           <ul>
*             <li>ตรวจสอบว่ามีการกรอกเบอร์โทรศัพท์และรหัสผ่านครบหรือไม่</li>
*             <li>ตรวจสอบความถูกต้องของรหัสผ่านในฐานข้อมูล</li>
*             <li>ตรวจสอบสถานะการอนุมัติของบัญชี (ต้องเป็น <code>approved</code>)</li>
*             <li>หากข้อมูลถูกต้องและบัญชีได้รับการอนุมัติ ระบบจะสร้าง JWT Token คืนกลับ</li>
*           </ul>
*         </li>
*         <li>ผลลัพธ์ที่ส่งกลับ:
*           <ul>
*             <li><code>token</code> สำหรับการเข้าสู่ระบบ</li>
*             <li><code>driver_id</code> รหัสประจำตัวของคนขับ</li>
*             <li><code>role</code> บทบาทของผู้ใช้งาน</li>
*           </ul>
*         </li>
*         <li>กรณีที่เกิดข้อผิดพลาด เช่น รหัสผ่านไม่ถูกต้อง หรือบัญชีไม่ได้รับการอนุมัติ จะมีข้อความแจ้งเตือนที่เหมาะสม</li>
*       </ul>
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: Driver's phone number
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 description: Driver's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 driver_id:
 *                   type: integer
 *                   example: 1
 *                 role:
 *                   type: string
 *                   example: "driver"
 *       400:
 *         description: Missing phone number or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "กรุณาใส่เบอร์โทรศัพท์และรหัสผ่าน"
 *       401:
 *         description: Incorrect phone number or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "เบอร์โทรหรือรหัสผ่านผิด"
 *       403:
 *         description: Driver account not approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "บัญชีนี้ไม่ได้รับการอนุมัติ"
 *       500:
 *         description: Server or database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database error"
 */
export const loginUser = (req, res) => {
  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res
      .status(400)
      .json({ message: "กรุณาใส่เบอร์โทรศัพท์และรหัสผ่าน" });
  }

  const sql = `SELECT driver_id, password, approval_status FROM drivers  WHERE phone_number = ?`;

  con.query(sql, [phone_number], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: "เบอร์โทรหรือรหัสผ่านผิด" });
    }

    const driver = results[0];
    if (driver.approval_status !== "approved") {
      return res.status(403).json({ message: "บัญชีนี้ไม่ได้รับการอนุมัติ" });
    }

    const token = jwt.sign(
      { driver_id: driver.driver_id, role: driver.role },
      "jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      token,
      driver_id: driver.driver_id,
      role: driver.role,
    });
  });
}; //yes



/**
 * @swagger
 * /auth/register_driver:
 *   post:
 *     summary: สำหรับสมัครผู้ขับรถ
 *     description: |
*       <ul>
*         <li>API นี้ใช้สำหรับลงทะเบียนผู้ขับรถ (Driver) รายใหม่เข้าสู่ระบบ</li>
*         <li>ข้อมูลที่ต้องส่งมาในคำขอ (Request):
*           <ul>
*             <li><code>phone_number</code> เบอร์โทรศัพท์ (จำเป็นต้องระบุ)</li>
*             <li><code>password</code> รหัสผ่าน (จำเป็นต้องระบุ)</li>
*             <li><code>first_name</code> ชื่อจริง</li>
*             <li><code>last_name</code> นามสกุล</li>
*           </ul>
*         </li>
*         <li>ระบบจะทำการบันทึกข้อมูลคนขับลงในฐานข้อมูล <code>drivers</code></li>
*         <li>เมื่อบันทึกสำเร็จ จะส่งคืน:
*           <ul>
*             <li><code>status</code>: "success"</li>
*             <li><code>user_id</code>: หมายเลขผู้ขับที่เพิ่มเข้ามา (insertId)</li>
*           </ul>
*         </li>
*         <li>หากข้อมูลที่ส่งมาไม่ครบถ้วน ระบบจะตอบกลับด้วยสถานะ 400</li>
*         <li>หากเกิดข้อผิดพลาดจากฐานข้อมูล ระบบจะตอบกลับด้วยสถานะ 500 พร้อมข้อความแสดงข้อผิดพลาด</li>
*       </ul>
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: Driver's phone number
 *                 example: "1234567890"
 *               first_name:
 *                 type: string
 *                 description: Driver's first name
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: Driver's last name
 *                 example: "Doe"
 *               password:
 *                 type: string
 *                 description: Driver's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Driver successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ข้อมูลไม่ครบถ้วน"
 *       500:
 *         description: Server or database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database error"
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */

export const registerDriver = (req, res) => {
  const { phone_number, first_name, last_name, password } = req.body;

  if (!phone_number || !password) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }

  // ค่าที่ส่งเข้าไปใน INSERT จะมีเฉพาะคอลัมน์ที่ไม่ได้ตั้ง default
  const sql = `
      INSERT INTO drivers 
      (phone_number, first_name, last_name, password) 
      VALUES (?, ?, ?, ?)`;

  con.query(
    sql,
    [phone_number, first_name, last_name, password],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });

      res.json({ status: "success", user_id: result.insertId });
    }
  );
}; 

export const validateCustomer = (req, res) => {
  const customerId = req.body.customer_id;
  const sql = `SELECT * FROM servicerequests WHERE customer_id = ?`;

  con.query(sql, [customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({
        Status: false,
        Message: "No records found",
      });
    }

    return res.status(200).json({ Status: true, Result: result });
  });
}; //yes
