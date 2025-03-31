import con from '../config/db.js';

/**
 * @swagger
 * /user/add_user_info:
 *   post:
 *     summary: เพิ่มข้อมูลส่วนตัวสำหรับผู้ใช้
  *     description: |
 *       <ul>
 *         <li>API นี้ใช้สำหรับเพิ่มข้อมูลส่วนตัวของผู้ใช้งานเข้าสู่ระบบ</li>
 *         <li>ข้อมูลที่รับประกอบด้วย:
 *           <ul>
 *             <li>เบอร์โทรศัพท์ (จำเป็นต้องระบุ)</li>
 *             <li>อีเมล</li>
 *             <li>ชื่อผู้ใช้งาน</li>
 *             <li>ชื่อจริง</li>
 *             <li>นามสกุล</li>
 *           </ul>
 *         </li>
 *         <li>ระบบจะบันทึกวันที่และเวลาที่เพิ่มข้อมูลให้อัตโนมัติ</li>
 *         <li>หากเพิ่มข้อมูลสำเร็จ จะได้รับสถานะและหมายเลขผู้ใช้ (InsertId)</li>
 *         <li>หากข้อมูลไม่ถูกต้องหรือเกิดข้อผิดพลาด จะได้รับข้อความแจ้งข้อผิดพลาด</li>
 *       </ul>
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                 InsertId:
 *                   type: integer
 *       400:
 *         description: Missing required fields or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                 Error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                 Error:
 *                   type: string
 */

export const addUserInfo = (req, res) => {
    const { phone_number, email, username, first_name, last_name } = req.body;

    if (!phone_number) {
        return res.json({ Status: false, Error: "Phone number is required" });
    }

    const sql = `
        INSERT INTO customers (
            phone_number,
            email,
            username,
            first_name,
            last_name,
            created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const values = [
        phone_number,
        email || null,
        username || null,
        first_name || null,
        last_name || null,
    ];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, InsertId: result.insertId, user_id: result.insertId });
    });
}; 



/**
 * @swagger
 * /user/check_user_phone:
 *   get:
 *     summary: ตรวจสอบว่าเบอร์โทรศัพท์มีอยู่ในระบบหรือไม่สำหรับผู้ใช้
 *     description: |
 *       <ul>
 *         <li>API นี้ใช้เพื่อตรวจสอบว่าเบอร์โทรศัพท์ที่ระบุมีอยู่ในระบบลูกค้าหรือไม่</li>
 *         <li>รับค่า <code>phone_number</code> ผ่าน query string เช่น <code>?phone_number=0812345678</code></li>
 *         <li>หากเบอร์โทรศัพท์มีอยู่ในระบบ:
 *           <ul>
 *             <li>ส่งคืนสถานะ <b>true</b></li>
 *             <li>ระบุว่า <code>Exists: true</code></li>
 *             <li>แนบข้อมูลผู้ใช้งานที่พบในฟิลด์ <code>User</code></li>
 *           </ul>
 *         </li>
 *         <li>หากไม่มีข้อมูล:
 *           <ul>
 *             <li>ส่งคืนสถานะ <b>true</b> เช่นกัน</li>
 *             <li>แต่ <code>Exists: false</code></li>
 *             <li>ไม่มีฟิลด์ <code>User</code></li>
 *           </ul>
 *         </li>
 *         <li>หากเกิดข้อผิดพลาดจากระบบหรือฐานข้อมูล จะส่งคืน <code>Status: false</code> พร้อมข้อความ Error</li>
 *       </ul>
 *     tags: [Users]
 *     parameters:
 *       - name: phone_number
 *         in: query
 *         required: true
 *         description: Phone number to check
 *         schema:
 *           type: string
 *           example: "1234567890"
 *     responses:
 *       200:
 *         description: Phone number exists or not
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: boolean
 *                   example: true
 *                 Exists:
 *                   type: boolean
 *                   example: true
 *                 Message:
 *                   type: string
 *                   example: "Phone number exists"
 *                 User:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     phone_number:
 *                       type: string
 *                       example: "1234567890"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       500:
 *         description: Server error
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
 *                   example: "Database error"
 */

export const checkUserPhone = (req, res) => {
    const { phone_number } = req.query;  // ใช้ query parameter แทน request body
    if (!phone_number) {
        return res.json({ Status: false, Error: "Phone number is required" });
    }
    const sql = `SELECT * FROM customers WHERE phone_number = ?`;

    con.query(sql, [phone_number], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        if (result.length > 0) {
            return res.json({ Status: true, Exists: true, Message: "Phone number exists", User: result[0] });
        } else {
            return res.json({ Status: true, Exists: false, Message: "Phone number does not exist" });
        }
    });
};



export const editProfile = (req, res) => {
    const sql = `
        UPDATE customers 
        SET email = ?, first_name = ?, last_name = ?
        WHERE customer_id = ?
    `;
    const values = [
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.body.customer_id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, AffectedRows: result.affectedRows });
    });
}; //yes
