import con from '../config/db.js';

export const addPaymentMethod = (req, res) => {
    const sql = `
        INSERT INTO paymentmethods (
            user_id,
            payment_type,
            card_number,
            account_name,
            expiration_date,
            status
        ) VALUES (?, ?, ?, ?, ?, 'active')
    `;

    const values = [
        req.body.user_id,
        req.body.payment_type,
        req.body.card_number,
        req.body.account_name,
        req.body.expiration_date,
    ];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, InsertId: result.insertId });
    });
};

export const updatePaymentMethod = (req, res) => {
    const sql = `
        UPDATE paymentmethods 
        SET 
            payment_type = ?,
            card_number = ?,
            account_name = ?,
            expiration_date = ?,
            status = 'active'
        WHERE payment_method_id = ?
    `;

    const values = [
        req.body.payment_type,
        req.body.card_number,
        req.body.account_name,
        req.body.expiration_date,
        req.body.payment_method_id,
    ];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, AffectedRows: result.affectedRows });
    });
};

export const disablePaymentMethod = (req, res) => {
    const sql = `
        UPDATE paymentmethods 
        SET status = 'inactive'
        WHERE payment_method_id = ?
    `;

    con.query(sql, [req.body.payment_method_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, AffectedRows: result.affectedRows });
    });
};

export const getAllUserPaymentMethods = (req, res) => {
    const userId = req.query.user_id || null;
    const sql = `
        SELECT
            payment_method_id,
            payment_type,
            card_number,
            account_name,
            expiration_date
        FROM
            slideme.paymentmethods
        WHERE
            user_id = ?
            and status = 'active';
    `;

    con.query(sql, [userId], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
    });
};
