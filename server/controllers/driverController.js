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

export const score = (req, res) => {
  const driver_id = req.query.driver_id;
  const sql = `
    select
      AVG(r.rating) AS Score
    from
      reviews r
    where
      r.driver_id = ?
        `;
  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};

export const profitToday = (req, res) => {
  const driver_id = req.query.driver_id;
  const sql = `
          SELECT
              SUM(d.offered_price) AS profit_today
          FROM
              driveroffers d
          LEFT JOIN 
              servicerequests s ON s.request_id = d.request_id
          WHERE
              d.driver_id = ?
              AND s.status = 'completed'
              AND DATE(s.request_time) = CURDATE();
        `;
  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};

export const driverOffers = (req, res) => {
  const { request_id } = req.query;

  const sql = `
    SELECT * 
    FROM driveroffers 
    WHERE request_id = ? 
      AND offer_status = 'pending';
  `;

  con.query(sql, [request_id], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
};

export const getInfo = (req, res) => {
  const user_id = req.query.user_id;
  const sql = `
          select
            u.first_name,
            u.last_name,
            u.phone_number,
            d.license_plate,
            d.id_expiry_date
          from
            users u
          LEFT JOIN drivers d ON u.user_id = d.user_id
          where u.user_id = ?
        `;
  con.query(sql, [user_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};

export const chooseOffer = (req, res) => {
  const request_id = req.query.request_id || null;

  if (!request_id) {
    return res
      .status(400)
      .json({ Status: false, Message: "Invalid request_id" });
  }

  const sql = `
    SELECT 
      d.user_id,
      d.current_latitude,
      d.current_longitude,
      u.user_id,
      u.username,
      u.first_name,
      u.last_name,
      COALESCE(AVG(r.rating), 0) AS average_rating,
      do.offered_price,
      sr.pickup_lat,
      sr.pickup_long,
      sr.location_from,
      sr.dropoff_lat,
      sr.dropoff_long,
      sr.location_to,
      sr.customer_id,
      sr.request_id
    FROM driverdetails d
    INNER JOIN users u ON d.user_id = u.user_id
    LEFT JOIN reviews r ON u.user_id = r.driver_id
    INNER JOIN driveroffers do ON d.user_id = do.driver_id
    LEFT JOIN servicerequests sr ON sr.request_id = do.request_id
    WHERE do.request_id = ? AND do.offer_status = 'pending'
    GROUP BY d.user_id, d.current_latitude, d.current_longitude, u.user_id, u.username, u.first_name, u.last_name, do.offered_price, sr.pickup_lat, sr.pickup_long, sr.location_from, sr.dropoff_lat, sr.dropoff_long, sr.location_to;
  `;

  con.query(sql, [request_id], (err, result) => {
    if (err) {
      console.error("Error fetching drivers:", err);
      return res.status(500).json({ Status: false, Error: err.message });
    }

    if (result.length === 0) {
      const locationQuery = `
        SELECT 
          sr.pickup_lat,
          sr.pickup_long,
          sr.location_from,
          sr.dropoff_lat,
          sr.dropoff_long,
          sr.location_to
        FROM servicerequests sr
        WHERE sr.request_id = ?
      `;

      con.query(locationQuery, [request_id], (err, locationResult) => {
        if (err) {
          console.error("Error fetching pickup/dropoff info:", err);
          return res.status(500).json({ Status: false, Error: err.message });
        }

        if (locationResult.length > 0) {
          return res.status(200).json({
            Status: true,
            Result: [],
            PickupDropoffInfo: locationResult[0],
          });
        } else {
          return res.status(404).json({
            Status: false,
            Message: "No drivers or location data found",
          });
        }
      });

      return;
    }

    const pickupDropoffInfo = {
      pickup_lat: result[0].pickup_lat,
      pickup_long: result[0].pickup_long,
      location_from: result[0].location_from,
      dropoff_lat: result[0].dropoff_lat,
      dropoff_long: result[0].dropoff_long,
      location_to: result[0].location_to,
    };

    return res.status(200).json({
      Status: true,
      Result: result,
      PickupDropoffInfo: pickupDropoffInfo,
    });
  });
};

export const getHistory = (req, res) => {
  const driver_id = req.query.driver_id || null;
  const sql = `
    SELECT
      s.location_from AS origin,
      s.location_to AS destination,
      s.request_time AS start_time,
      s.status,
      d.offered_price AS profit
    FROM
      servicerequests s
    LEFT JOIN
      driveroffers d
    ON
      d.request_id = s.request_id
    WHERE
      s.accepted_driver_id = ?
      AND s.status != 'pending';
  `;
  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};

export const Notifications = (req, res) => {
  const driver_id = req.query.driver_id || null;
  const sql = `
    select
      d.request_id,
      s.location_from as orgin,
      s.pickup_lat,
      s.pickup_long,
      s.location_to as destination,
      s.dropoff_lat,
      s.dropoff_long,
      d.offered_price as profit
    from
      driveroffers d
    left join servicerequests s on
      s.request_id = d.request_id
    where
      d.driver_id = ?
      and d.offer_status = 'accepted'
      and s.status = 'accepted'
  `;
  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};

export const rejectAllOffers = (req, res) => {
  const sql = `
          UPDATE driveroffers
          SET offer_status = 'rejected'
          WHERE driver_id = ? and offer_status != 'accepted';
        `;

  const driver_id = req.body.driver_id || null;

  con.query(sql, driver_id, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
};

export const editProfile = (req, res) => {
  const sql = `
UPDATE drivers
SET id_expiry_date = ?
WHERE user_id = ?;
`;

  const { user_id, id_expiry_date } = req.body;

  con.query(sql, [id_expiry_date, user_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
};

export const driverLocation = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Driver ID required" });
  }

  const query = `
    SELECT current_latitude, current_longitude 
    FROM driverdetails 
    WHERE user_id = ?;
  `;

  con.query(query, [user_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error: " + err.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    return res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

export const UpdateLocation = (req, res) => {
  const { user_id, current_latitude, current_longitude } = req.body;

  const sql = `
          update
            driverdetails
          set
            current_latitude = ?,
            current_longitude = ?
          where
            user_id = ?
        `;

  con.query(
    sql,
    [current_latitude, current_longitude, user_id],
    (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({
        Status: true,
        AffectedRows: result.affectedRows,
      });
    }
  );
};

export const fetchDriverInfo = (req, res) => {
  const { customer_id, driver_id, request_id } = req.params; // Extract from URL

  if (!customer_id || !driver_id || !request_id) {
    return res
      .status(400)
      .json({ Status: false, Message: "Invalid parameters" });
  }

  const sql = `
  SELECT 
    d.user_id,
    sr.customer_id,
    sr.request_id,
    sr.pickup_lat,
    sr.pickup_long,
    sr.location_from,
    sr.dropoff_lat,
    sr.dropoff_long,
    sr.location_to,
    sr.booking_time,
    sr.request_time,
    u.first_name AS driver_first_name,
    u.last_name AS driver_last_name,
    u.phone_number AS driver_phone,
    COALESCE(AVG(r.rating), 0) AS average_rating, 
    d.current_latitude AS driver_latitude,
    d.current_longitude AS driver_longitude
  FROM servicerequests sr
  INNER JOIN driveroffers do ON sr.request_id = do.request_id
  INNER JOIN users u ON do.driver_id = u.user_id
  LEFT JOIN reviews r ON u.user_id = r.driver_id
  INNER JOIN driverdetails d ON do.driver_id = d.user_id
  WHERE sr.customer_id = ? AND do.driver_id = ? AND sr.request_id = ? AND do.offer_status = 'accepted' AND sr.status = 'accepted'
  GROUP BY 
    sr.request_id, sr.pickup_lat, sr.pickup_long, sr.location_from, 
    sr.dropoff_lat, sr.dropoff_long, sr.location_to, 
    sr.booking_time, sr.request_time, u.first_name, u.phone_number, 
    d.current_latitude, d.current_longitude;
`;

  con.query(sql, [customer_id, driver_id, request_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
};