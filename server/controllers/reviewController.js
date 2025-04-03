import con from '../config/db.js';

export const addReview = (req, res) => {
    // ตรวจสอบว่า request_id, customer_id, driver_id, rating, review_text ถูกต้องหรือไม่
    const { request_id, customer_id, driver_id, rating, review_text } = req.body;

    if (!request_id || !customer_id || !driver_id || !rating || !review_text) {
        return res.status(400).json({
            Status: false,
            Message: 'Missing required fields. Please provide request_id, customer_id, driver_id, rating, and review_text.'
        });
    }

    const sql = `
        INSERT INTO reviews (
            request_id,
            customer_id,
            driver_id,
            rating,
            review_text
        ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        request_id,
        customer_id,
        driver_id,
        rating,
        review_text,
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                Status: false,
                Error: err.message,
                Message: 'An error occurred while adding the review'
            });
        }
        return res.status(200).json({
            Status: true,
            InsertId: result.insertId,
            Message: 'Review added successfully'
        });
    });
};
