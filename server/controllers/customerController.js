import con from "../config/db.js";

export const editAddress = (req, res) => {
  const sql = `
                UPDATE addresses 
                SET 
                  save_name = ?, 
                  location_from = ?,
                  pickup_lat = ?,
                  pickup_long = ?,
                  location_to = ?,
                  dropoff_lat = ?, 
                  dropoff_long = ?,
                  type_id = ?
                WHERE address_id = ?
              `;

  const values = [
    req.body.save_name,
    req.body.location_from,
    req.body.pickup_lat,
    req.body.pickup_long,
    req.body.location_to,
    req.body.dropoff_lat,
    req.body.dropoff_long,
    req.body.type_id,
    req.body.address_id,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
};

export const addBookmark = (req, res) => {
    const sql = `
    INSERT INTO addresses (
      user_id,
      save_name,
      location_from,
      pickup_lat,
      pickup_long,
      location_to,
      dropoff_lat,  
      dropoff_long,
      type_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
    const values = [
      req.body.user_id,
      req.body.save_name,
      req.body.location_from,
      req.body.pickup_lat,
      req.body.pickup_long,
      req.body.location_to,
      req.body.dropoff_lat,
      req.body.dropoff_long,
      req.body.type_id,
    ];
  
    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, InsertId: result.insertId });
    });
}

export const disableBookmark = (req, res) => {
    const sql = `
    UPDATE addresses 
    SET 
      is_deleted = 1
    WHERE address_id = ?
  `;

    const values = [req.body.address_id];

    con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
    Status: true,
    AffectedRows: result.affectedRows,
    });
});
}

export const getuserBookmarks = (req, res) => {
    const user_id = req.query.user_id || null;
    console.log("Received user_id:", user_id); // Log the received user_id for debugging
  
    if (!user_id) {
      return res
        .status(400)
        .json({ Status: false, Error: "user_id is required" });
    }
    const sql = `
        SELECT
          address_id,
          save_name,
          location_from,
          pickup_lat,
          pickup_long,
          location_to,
          dropoff_lat,
          dropoff_long,
          type_id
        FROM
          addresses
        WHERE
          user_id = ?
          and is_deleted = 0;
      `;
    con.query(sql, [user_id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, Result: result });
    });
}

export const getServiceInfo = (req, res) => {
    const request_id = req.query.request_id || null;
    const sql = `
     SELECT 
          u.first_name,
          u.last_name,
          AVG(r.rating) AS average_rating,
          sr.price_offer as price,
          sr.location_from,
          sr.pickup_lat,
          sr.pickup_long,
          sr.location_to,
          sr.dropoff_lat,
          sr.dropoff_long
      FROM
          servicerequests sr
      INNER JOIN users u 
          ON sr.accepted_driver_id = u.user_id
      LEFT JOIN reviews r 
          ON u.user_id = r.driver_id
      WHERE
          sr.request_id = ?
      GROUP BY
          sr.request_id,
          u.first_name,
          u.last_name,
          sr.price_offer,
          sr.pickup_lat,
          sr.pickup_long,
          sr.location_from,
          sr.dropoff_lat,
          sr.dropoff_long,
          sr.location_to;
  
    `;
    con.query(sql, [request_id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, Result: result });
    });
}

export const orderStatus = (req, res) => {
  const { user_id } = req.params
  const sql = `
    SELECT request_id, accepted_driver_id, status
    FROM servicerequests
    WHERE customer_id = ? AND status = 'accepted'
    ORDER BY request_time DESC
    LIMIT 1
  `;

  con.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({
        Status: false,
        Message: `No accepted records found for customer_id`,
      });
    }

    return res.status(200).json({ Status: true, Result: result[0] });
  });
}

export const checkStatusOrder = (req, res) => {
  const requestId = req.params.request_id;
  const query = `SELECT status FROM servicerequests WHERE request_id = ?`;

  con.query(query, [requestId], (err, result) => {
    if (err) {
      res.status(500).send("Database error");
    } else if (result.length > 0) {
      res.status(200).json({ status: result[0].status });
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  });
}
