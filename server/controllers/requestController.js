import con from '../config/db.js';

export const addRequest = (req, res) => {
    const sql = `
        INSERT INTO servicerequests (
            customer_id,
            request_time,
            pickup_lat,
            pickup_long,
            location_from,
            dropoff_lat,
            dropoff_long,
            location_to,
            vehicle_type,
            booking_time,
            customer_message,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const values = [
        req.body.customer_id,
        req.body.request_time,
        req.body.pickup_lat,
        req.body.pickup_long,
        req.body.location_from,
        req.body.dropoff_lat,
        req.body.dropoff_long,
        req.body.location_to,
        req.body.vehicle_type,
        req.body.booking_time,
        req.body.customer_message,
    ];

    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, request_id: result.insertId });
    });
};

export const getServiceHistory = (req, res) => {
    const customerId = req.query.customer_id || 1;
    const sql = `
        SELECT
        sr.vehicle_type,
        sr.request_time AS date,
        sr.status AS service_status,
        sr.location_from AS origin,
        sr.location_to AS destination,
        sr.price_offer AS service_charge
        FROM
            ServiceRequests sr
        LEFT JOIN
            DriverOffers do ON sr.request_id = do.request_id AND do.offer_status = 'accepted'
        WHERE
            sr.customer_id = ? 
        ORDER BY
            sr.request_time DESC;
    `;
    
    con.query(sql, [customerId], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
    });
};

export const getRequests = (req, res) => {
    const sql = `
        SELECT
            s.request_id,
            s.pickup_lat,
            s.pickup_long,
            s.location_from,
            s.dropoff_lat,
            s.dropoff_long,
            s.location_to,
            s.booking_time,
            s.vehicle_type,
            s.customer_message
        FROM servicerequests s
        WHERE s.status = 'pending';
    `;
    
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
    });
};

export const getRequestDetailForDriver = (req, res) => {
    const request_id = req.query.request_id || null;

    const sql = `
        SELECT DISTINCT
            s.request_id,
            s.pickup_lat,
            s.pickup_long,
            s.location_from,
            s.customer_message,
            s.dropoff_lat,
            s.dropoff_long,
            s.location_to,
            u.first_name AS customer_name,
            u.phone_number AS customer_phone
        FROM
            servicerequests s
        LEFT JOIN users u
            ON u.user_id = s.customer_id
        WHERE
            s.request_id = ?;
    `;

    con.query(sql, [request_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
    });
};
