import con from "../config/db.js";

// ✅ เพิ่มวิธีการชำระเงินใหม่ (Insert into `paymentmethod` และ `payments`)
export const addPaymentMethod = (req, res) => {
    const sqlPaymentMethod = `
        INSERT INTO paymentmethod (
            method_name,
            card_number,
            card_expiry,
            card_cvv,
            cardholder_name
        ) VALUES (?, ?, ?, ?, ?)
    `;

    const valuesPaymentMethod = [
        req.body.method_name,      // Visa, Mastercard, PayPal, Bank Transfer
        req.body.card_number,
        req.body.card_expiry,      // รูปแบบ MM/YYYY
        req.body.card_cvv,         // 3-digit CVV
        req.body.cardholder_name,
    ];

    con.query(sqlPaymentMethod, valuesPaymentMethod, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: err.message });

        const payment_method_id = result.insertId; // ดึง payment_method_id ที่เพิ่มใหม่

        const sqlPayment = `
            INSERT INTO payments (
                customer_id,
                amount,
                payment_status,
                payment_method_id,
                is_default
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const valuesPayment = [
            req.body.customer_id,
            req.body.amount || 0.00,    // ค่าเริ่มต้นเป็น 0.00
            "Pending",                  // สถานะเริ่มต้นเป็น Pending
            payment_method_id,
            req.body.is_default || 0    // ค่าเริ่มต้นไม่เป็น default (0)
        ];

        con.query(sqlPayment, valuesPayment, (err, result) => {
            if (err) return res.status(500).json({ Status: false, Error: err.message });
            return res.status(201).json({
                Status: true,
                Message: "เพิ่มวิธีการชำระเงินเรียบร้อย !",
                PaymentMethodId: payment_method_id,
                PaymentId: result.insertId
            });
        });
    });
};

// ✅ อัปเดตข้อมูลวิธีการชำระเงิน (ใน `paymentmethod`)
export const updatePaymentMethod = (req, res) => {
    const sql = `
        UPDATE paymentmethod
        SET 
            method_name = ?,
            card_number = ?,
            card_expiry = ?,
            card_cvv = ?,
            cardholder_name = ?
        WHERE payment_method_id = ?
    `;

    const values = [
        req.body.method_name,
        req.body.card_number,
        req.body.card_expiry,
        req.body.card_cvv,
        req.body.cardholder_name,
        req.body.payment_method_id
    ];

    con.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ Status: false, Error: "ไม่พบวิธีการชำระเงิน" });
        }

        return res.status(200).json({
            Status: true,
            Message: "อัปเดตวิธีการชำระเงินเรียบร้อย !",
            AffectedRows: result.affectedRows
        });
    });
};

// ✅ ปิดการใช้งานวิธีการชำระเงิน (Disable)
export const disablePaymentMethod = (req, res) => {
    const sql = `
        UPDATE payments
        SET payment_status = 'Failed'
        WHERE payment_id = ?
    `;

    con.query(sql, [req.body.payment_id], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ Status: false, Error: "ไม่พบวิธีการชำระเงิน" });
        }

        return res.status(200).json({
            Status: true,
            Message: "ปิดการใช้งานวิธีการชำระเงินเรียบร้อย !",
            AffectedRows: result.affectedRows
        });
    });
};

// ✅ ดึงวิธีการชำระเงินทั้งหมดของผู้ใช้
export const getAllUserPaymentMethods = (req, res) => {
    const customer_id = req.query.customer_id || null;

    if (!customer_id) {
        return res.status(400).json({ Status: false, Error: "กรุณาระบุ customer_id" });
    }

    const sql = `
        SELECT
            p.payment_id,
            pm.payment_method_id,
            pm.method_name,
            pm.card_number,
            pm.card_expiry,
            pm.cardholder_name,
            p.payment_status,
            p.is_default
        FROM payments p
        JOIN paymentmethod pm ON p.payment_method_id = pm.payment_method_id
        WHERE p.customer_id = ?;
    `;

    con.query(sql, [customer_id], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ Status: false, Error: "ไม่พบวิธีการชำระเงินของผู้ใช้คนนี้" });
        }

        return res.status(200).json({ Status: true, Result: result });
    });
};

// ✅ ดึงข้อมูลวิธีการชำระเงินเฉพาะของลูกค้า
export const getPaymentMethod = (req, res) => {
    const { customer_id } = req.query;

    if (!customer_id) {
        return res.status(400).json({ Status: false, Error: "กรุณาระบุ customer_id" });
    }

    const sql = `
        SELECT 
            pm.method_name, 
            pm.card_number, 
            pm.card_expiry, 
            pm.cardholder_name, 
            p.payment_status,
            p.is_default
        FROM payments p
        JOIN paymentmethod pm ON p.payment_method_id = pm.payment_method_id
        WHERE p.customer_id = ?;
    `;

    con.query(sql, [customer_id], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ Status: false, Error: "ไม่พบวิธีการชำระเงินของผู้ใช้คนนี้" });
        }

        return res.status(200).json({ Status: true, Result: result });
    });
};
