import con from "../config/db.js";

export const offerPrice = (req, res) => {
  const sql = `
        INSERT INTO driveroffers (
            request_id,
            driver_id,
            offered_price,
            offer_status
        ) 
        SELECT ?, ?, ?, 'pending' 
        FROM servicerequests s
        WHERE s.request_id = ? AND s.status != 'cancelled'
    `;

  const values = [
    req.body.request_id,
    req.body.driver_id,
    req.body.offered_price,
    req.body.request_id,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, AffectedRows: result.affectedRows });
  });
};

export const getOffersFromDriver = (req, res) => {
  const driver_id = req.query.driver_id || null;

  const sql = `
        SELECT
            s.request_id,
            s.location_from,
            s.location_to,
            v.type_name AS vehicle_type,
            d.offer_id,
            d.offered_price,
            d.offer_status
        FROM
            driveroffers d
        LEFT JOIN servicerequests s
            ON d.request_id = s.request_id
        LEFT JOIN vehicle_types v  
            ON s.type_id = v.type_id    
        WHERE
            d.driver_id = ? 
            AND d.offer_status != 'rejected' 
            AND s.status != 'completed';
    `;

  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};

export const cancelOffer = (req, res) => {
  const sql = `
        UPDATE driveroffers
        SET offer_status = 'rejected'
        WHERE offer_id = ?
    `;

  con.query(sql, [req.body.offer_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, AffectedRows: result.affectedRows });
  });
};

export const getDrivers = (req, res) => {
  const sql = `SELECT * FROM driverdetails;`;

  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};
