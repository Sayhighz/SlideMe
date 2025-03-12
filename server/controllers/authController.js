import jwt from 'jsonwebtoken';
import con from '../config/db.js';

export const loginUser = (req, res) => {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({ message: 'กรุณาใส่เบอร์โทรศัพท์และรหัสผ่าน' });
    }

    const sql = `SELECT user_id, password, role FROM users WHERE phone_number = ?`;

    con.query(sql, [phone_number], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: "เบอร์โทรหรือรหัสผ่านผิด" });
        }

        const user = results[0];
        const token = jwt.sign({ user_id: user.user_id, role: user.role }, "jwt_secret_key", { expiresIn: "1h" });

        res.json({ token });
    });
};

export const registerDriver = (req, res) => {
    const { phone_number, first_name, last_name, password } = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    const sql = `INSERT INTO users (phone_number, first_name, last_name, password, role) VALUES (?, ?, ?, ?, 'driver')`;

    con.query(sql, [phone_number, first_name, last_name, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        res.json({ status: "success", user_id: result.insertId });
    });
};

export const validateCustomer = (req,res) => {
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
}; //ใช้ได้
