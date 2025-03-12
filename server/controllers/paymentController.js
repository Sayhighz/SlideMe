import con from '../config/db.js';

export const addPaymentMethod = (req, res) => {
    const sql = `
        INSERT INTO payments (
            customer_id,
            payment_method,
            card_number,
            account_name,
            expiration_date,
            status
        ) VALUES (?, ?, ?, ?, ?, 'active')
    `;

    const values = [
        req.body.customer_id,
        req.body.payment_method,
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
        UPDATE payments 
        SET 
            payment_method = ?,
            card_number = ?,
            account_name = ?,
            expiration_date = ?,
            status = 'active'
        WHERE payment_id = ?
    `;

    const values = [
        req.body.payment_method,
        req.body.card_number,
        req.body.account_name,
        req.body.expiration_date,
        req.body.payment_id,
    ];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, AffectedRows: result.affectedRows });
    });
};

export const disablePaymentMethod = (req, res) => {
    const sql = `
        UPDATE payments 
        SET status = 'inactive'
        WHERE payment_id = ?
    `;

    con.query(sql, [req.body.payment_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, AffectedRows: result.affectedRows });
    });
};

export const getAllUserPaymentMethods = (req, res) => {
    const customer_id = req.query.customer_id || null;
    const sql = `
        SELECT
            payment_id,
            payment_method,
            card_number,
            account_name,
            expiration_date
        FROM
            payments
        WHERE
            customer_id = ?
            and status = 'active';
    `;

    con.query(sql, [customer_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
    });
};

export const getPaymentMethods = (req, res) => {
    const { customer_id } = req.query; // Fetch user_id from the query
    const sql = `
      SELECT payment_method, card_number, account_name , status
      FROM payments 
      WHERE customer_id = ? AND status = 'active'`; // Use WHERE to filter by user_id
    con.query(sql, [customer_id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, Result: result });
    });
};
