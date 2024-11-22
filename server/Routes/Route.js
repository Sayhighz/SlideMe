import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs"; // Added fs import

const router = express.Router();
const uploadsDir = path.resolve("uploads");
router.use("/uploads", express.static(uploadsDir));

// Configure multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/"; // Directory where images are saved
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

router.get("/fetch_image", (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res
      .status(400)
      .json({ Status: false, Error: "Filename is required" });
  }

  const filePath = path.join(uploadsDir, filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ Status: false, Error: "File not found" });
    }

    // Serve the file
    res.sendFile(filePath);
  });
});

router.post("/upload_before_service", upload.array("photos", 4), (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ Status: false, Error: "No files uploaded" });
  }

  const { request_id, driver_id } = req.body;

  if (!request_id || !driver_id) {
    return res
      .status(400)
      .json({ Status: false, Error: "request_id and driver_id are required" });
  }

  // Extract file paths of the uploaded images
  const photoPaths = req.files.map((file) => file.path);
  console.log("Photo Paths:", photoPaths); // Log paths for debugging

  // Convert the array of file paths to a JSON string for storage
  const photoPathsJSON = JSON.stringify(photoPaths);

  const sql = `
    INSERT INTO driverlogs (
      request_id,
      driver_id,
      photo_before_service
    ) VALUES (?, ?, ?)
  `;

  con.query(sql, [request_id, driver_id, photoPathsJSON], (err, result) => {
    if (err) {
      console.error("Database Insert Error:", err); // Log detailed error
      return res.status(500).json({ Status: false, Error: err.message });
    }
    res.json({
      Status: true,
      InsertId: result.insertId,
      FilePaths: photoPaths,
    });
  });
});

router.post("/upload_after_service", upload.array("photos", 4), (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ Status: false, Error: "No files uploaded" });
  }

  const { request_id, driver_id } = req.body;

  if (!request_id || !driver_id) {
    return res
      .status(400)
      .json({ Status: false, Error: "request_id and driver_id are required" });
  }

  const photoPaths = req.files.map((file) => file.path);
  console.log("Photo Paths:", photoPaths);

  const photoPathsJSON = JSON.stringify(photoPaths);

  const sql = `
    UPDATE driverlogs 
    SET photo_after_service = ?
    WHERE request_id = ? AND driver_id = ?
  `;

  con.query(sql, [photoPathsJSON, request_id, driver_id], (err, result) => {
    if (err) {
      console.error("Database Update Error:", err);
      return res.status(500).json({ Status: false, Error: err.message });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "No matching record found to update" });
    }

    res.json({
      Status: true,
      AffectedRows: result.affectedRows,
      FilePaths: photoPaths,
    });
  });
});

router.post("/add_request", (req, res) => {
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
    if (err) {
      return res.json({ Status: false, Error: err.message });
    }
    return res.json({ Status: true, request_id: result.insertId });
  });
});

router.get("/service_history_customer", (req, res) => {
  const customerId = req.query.customer_id || 1;
  const sql = `
      SELECT
      sr.vehicle_type,
      sr.request_time AS date,
      sr.status AS service_status,
      sr.location_from AS origin,
      sr.location_to AS destination,
      do.offered_price AS service_charge
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
});

router.get("/getAllDiscounts", (req, res) => {
  const customerId = req.query.customer_id || 1;
  const sql = `
      SELECT
        discount_code,
        discount_percentage,
        discount_message,
        expiration_date,
        type
      FROM
        slideme.discounts
    `;
  con.query(sql, [customerId], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/getAllUserPaymentMethods", (req, res) => {
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
});

router.post("/add_reviews", (req, res) => {
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
    req.body.request_id,
    req.body.customer_id,
    req.body.driver_id,
    req.body.rating,
    req.body.review_text,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, InsertId: result.insertId });
  });
});

router.get("/getRequests", (req, res) => {
  const sql = `
          select
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
});

router.post("/customer/add_bookmark", (req, res) => {
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
    vahicle_type
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
    req.body.vahicle_type,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, InsertId: result.insertId });
  });
});

router.post("/customer/edit_address", (req, res) => {
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
            vahicle_type = ?
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
    req.body.vahicle_type,
    req.body.address_id,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.post("/customer/disable_bookmark", (req, res) => {
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
});

router.get("/customer/getuserbookmarks", (req, res) => {
  const user_id = req.query.user_id || null;
  console.log("Received user_id:", user_id); // Log the received user_id for debugging

  if (!user_id) {
    return res.status(400).json({ Status: false, Error: "user_id is required" });
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
        vahicle_type
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
});

router.post("/edit_profile", (req, res) => {
  const sql = `
          UPDATE users 
          SET 
            email = ?, 
            first_name = ?, 
            last_name = ?
          WHERE user_id = ?
        `;

  const values = [
    req.body.email,
    req.body.first_name,
    req.body.last_name,
    req.body.user_id,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.post("/add_payment_method", (req, res) => {
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
});

router.post("/update_payment_method", (req, res) => {
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
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.post("/disable_payment_method", (req, res) => {
  const sql = `
            UPDATE paymentmethods 
            SET 
              status = 'inactive'
            WHERE payment_method_id = ?
          `;

  const values = [req.body.payment_method_id];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.post("/add_user_info", (req, res) => {
  const { phone_number, email, username, first_name, last_name } = req.body;

  if (!phone_number) {
    return res.json({ Status: false, Error: "Phone number is required" });
  }

  const sql = `
          INSERT INTO users (
              phone_number,
              email,
              username,
              first_name,
              last_name,
              role,
              created_at
          ) VALUES (?, ?, ?, ?, ?, 'customer', NOW())
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
    return res.json({ Status: true, InsertId: result.insertId });
  });
});

router.post("/check_user_phone", (req, res) => {
  const { phone_number } = req.body;
  const sql = `SELECT * FROM users WHERE phone_number = ?`;
  con.query(sql, [phone_number], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    if (result.length > 0) {
      return res.json({
        Status: true,
        Exists: true,
        Message: "Phone number exists",
      });
    } else {
      return res.json({
        Status: true,
        Exists: false,
        Message: "Phone number does not exist",
      });
    }
  });
});

router.get("/getRequests", (req, res) => {
  const sql = `
          select
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
});

router.post("/offer_price", (req, res) => {
  const sql = `
              INSERT INTO driveroffers (
              request_id,
              driver_id,
              offered_price,
              offer_status
          ) VALUES (?, ?, ?, 'pending')
          `;

  const values = [
    req.body.request_id,
    req.body.driver_id,
    req.body.offered_price,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.get("/getOffersFromDriver", (req, res) => {
  const driver_id = req.query.driver_id || null;

  const sql = `
          SELECT
            s.request_id,
            d.offer_id,
            s.location_from,
            s.location_to,
            s.vehicle_type,
            d.offered_price,
            d.offer_status
          FROM
            driveroffers d
          LEFT JOIN servicerequests s
          ON
            d.request_id = s.request_id
          WHERE
            d.driver_id = ? and d.offer_status != 'rejected' and s.status != 'completed';
        `;

  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/cancle_offer", (req, res) => {
  const sql = `
          update
            driveroffers
          set
            offer_status = 'rejected'
          where
            offer_id = ?
        `;

  const values = [req.body.offer_id];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.get("/getRequestDetailForDriver", (req, res) => {
  const request_id = req.query.request_id || 0;

  const sql = `
SELECT DISTINCT
    s.request_id,
    s.pickup_lat,
    s.pickup_long,
    s.location_from,
    s.dropoff_lat,
    s.dropoff_long,
    s.location_to,
    u.first_name AS customer_name,
    u.phone_number AS customer_phone
FROM
    servicerequests s
LEFT JOIN users u
    ON u.user_id = s.customer_id
LEFT JOIN driveroffers d
    ON d.request_id = s.request_id
WHERE
    s.request_id = ?;
        `;

  con.query(sql, [request_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/drivers", (req, res) => {
  const sql = `SELECT * FROM driverdetails;`;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/drivers/chooseoffer", (req, res) => {
  const request_id = req.query.request_id || null;

  if (!request_id) {
    return res
      .status(400)
      .json({ Status: false, Message: "Invalid request_id" });
  }

  const sql = `
    SELECT 
      d.driver_id,
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
    INNER JOIN users u ON d.driver_id = u.user_id
    LEFT JOIN reviews r ON u.user_id = r.driver_id
    INNER JOIN driveroffers do ON d.driver_id = do.driver_id
    LEFT JOIN servicerequests sr ON sr.request_id = do.request_id
    WHERE do.request_id = ? AND do.offer_status = 'pending'
    GROUP BY d.driver_id, d.current_latitude, d.current_longitude, u.user_id, u.username, u.first_name, u.last_name, do.offered_price, sr.pickup_lat, sr.pickup_long, sr.location_from, sr.dropoff_lat, sr.dropoff_long, sr.location_to;
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
});

router.get("/get_payments_method", (req, res) => {
  const { user_id } = req.query; // Fetch user_id from the query
  const sql = `SELECT payment_type, card_number, account_name FROM paymentmethods WHERE user_id = ?`; // Use WHERE to filter by user_id
  con.query(sql, [user_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/validate_customer", (req, res) => {
  const customerId = 10;
  const sql = `SELECT * FROM servicerequests WHERE customer_id = ?`;

  con.query(sql, [customerId], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({
        Status: false,
        Message: "No records found for customer_id 10",
      });
    }

    return res.status(200).json({ Status: true, Result: result });
  });
});

router.get("/fetch_driver_info/:customer_id/:driver_id", (req, res) => {
  const { customer_id, driver_id } = req.params; // Extract from URL

  if (!customer_id || !driver_id) {
    return res
      .status(400)
      .json({ Status: false, Message: "Invalid parameters" });
  }

  const sql = `
    SELECT 
      d.driver_id,
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
    INNER JOIN driverdetails d ON do.driver_id = d.driver_id
    WHERE sr.customer_id = ? AND do.driver_id = ? AND do.offer_status = 'accepted' AND sr.status = 'accepted'
    GROUP BY 
      sr.request_id, sr.pickup_lat, sr.pickup_long, sr.location_from, 
      sr.dropoff_lat, sr.dropoff_long, sr.location_to, 
      sr.booking_time, sr.request_time, u.first_name, u.phone_number, 
      d.current_latitude, d.current_longitude;
  `;

  con.query(sql, [customer_id, driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/update_offer_status", (req, res) => {
  const { request_id, chosen_driver_id } = req.body;

  if (!request_id || !chosen_driver_id) {
    return res.status(400).json({ Status: false, Message: "Invalid parameters" });
  }

  const sqlUpdateAccepted = `
    UPDATE driveroffers
    SET offer_status = 'accepted'
    WHERE request_id = ? AND driver_id = ?
  `;

  const sqlUpdateRejected = `
    UPDATE driveroffers
    SET offer_status = 'rejected'
    WHERE request_id = ? AND driver_id != ? AND offer_status = 'pending'
  `;

  con.query(sqlUpdateAccepted, [request_id, chosen_driver_id], (err, result) => {
    if (err) {
      console.error("Error updating accepted offer:", err);
      return res.status(500).json({ Status: false, Error: err.message });
    }

    con.query(sqlUpdateRejected, [request_id, chosen_driver_id], (err, result) => {
      if (err) {
        console.error("Error updating rejected offers:", err);
        return res.status(500).json({ Status: false, Error: err.message });
      }

      return res.status(200).json({ Status: true, Message: "Offer status updated successfully" });
    });
  });
});

router.post("/update_service_request", (req, res) => {
  const { request_id, customer_id, driver_id, price } = req.body;

  // Validate input
  if (!request_id || !customer_id || !driver_id || !price) {
    return res.status(400).json({ Status: false, Message: "Invalid parameters" });
  }

  const sqlUpdate = `
    UPDATE servicerequests
    SET status = 'accepted',
        accepted_driver_id = ?,
        price_offer = ?
    WHERE request_id = ? AND customer_id = ? 
  `;

  con.query(sqlUpdate, [driver_id, price, request_id, customer_id], (err, result) => {
    if (err) {
      console.error("Error updating service request:", err);
      return res.status(500).json({ Status: false, Error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Message: "No matching data found or already updated" });
    }

    return res.status(200).json({ Status: true, Message: "Service request updated successfully" });
  });
});

router.post("/complete_request", (req, res) => {
  const sql = `
          UPDATE servicerequests
          SET 
            status = 'completed'
          WHERE request_id = ?
        `;

  const request_id = req.body.request_id || null;

  con.query(sql, request_id, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.get("/driver/getHistory", (req, res) => {
  const driver_id = req.query.driver_id || null;
  const sql = `
    select
      location_from as origin,
      location_to as destination,
      request_time as start_time,
      status,
      price_offer as profit
    from
      servicerequests
    where accepted_driver_id = ? and status != 'pending'
  `;
  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/driver/notifications", (req, res) => {
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
});

router.post("/driver/reject_all_offers", (req, res) => {
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
});

router.post("/register_driver", (req, res) => {
  const {
      phone_number,
      email,
      username,
      first_name,
      last_name,
      password,
      id_number,
      birth_date,
      id_expiry_date,
      license_plate,
      province,
      vehicle_type,
  } = req.body;

  // Validation
  if (!phone_number || !password || !id_number || !birth_date || !id_expiry_date || !license_plate || !province || !vehicle_type) {
      return res.json({
          Status: false,
          Error: "กรุณากรอกข้อมูลให้ครบถ้วน (เบอร์โทร, จังหวัด และประเภทรถเป็นข้อมูลที่จำเป็น)",
      });
  }

  const sql = `
      INSERT INTO users (
          phone_number, email, username, first_name, last_name, password,
          role, id_number, birth_date, id_expiry_date, license_plate,
          province, vehicle_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'driver', ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
      phone_number, email || null, username || null, first_name, last_name, password,
      id_number, birth_date, id_expiry_date, license_plate, province, vehicle_type,
  ];

  con.query(sql, values, (err, result) => {
      if (err) {
          return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true, InsertId: result.insertId });
  });
});


router.post("/login", (req, res) => {
  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res
      .status(400)
      .json({ Status: false, Error: "กรุณาใส่เบอร์โทรศัพท์และรหัสผ่าน" });
  }

  const sql = "SELECT * FROM users WHERE phone_number = ?";
  con.query(sql, [phone_number], (err, results) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ Status: false, Error: "เบอร์โทรหรือรหัสผ่านผิด" });
    }

    const user = results[0];

    // ตรวจสอบรหัสผ่าน
    if (user.password !== password) {
      return res
        .status(401)
        .json({ Status: false, Error: "เบอร์โทรหรือรหัสผ่านผิด" });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      "YOUR_SECRET_KEY",
      { expiresIn: "1h" }
    );

    // ส่งข้อมูลผู้ใช้กลับไป
    return res.json({
      Status: true,
      // Message: "เข้าสู่ระบบสำเร็จ",
      Token: token,
      User: {
        user_id: user.user_id,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  });
});

router.get("/customer/getServiceInfo", (req, res) => {
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
});

router.get("/driver/getinfo", (req, res) => {
  const driver_id = req.query.driver_id;
  const sql = `
          select
            u.first_name,
            u.last_name,
            u.phone_number,
            d.license_plate,
            d.driver_license_expiration
          from
            users u
          left join driverdetails d on
            d.driver_id = u.user_id
          where d.driver_id = ?
        `;
  con.query(sql, [driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/driver/edit_profile", (req, res) => {
  const sql = `
          UPDATE driverdetails
          SET 
            driver_license_expiration = ?
          WHERE driver_id = ?
        `;

  const { driver_id, driver_license_expiration } = req.body;

  con.query(sql, [driver_license_expiration, driver_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.post("/driver/cancel_request", (req, res) => {
  const request_id = req.body.request_id;

  const sql = `
          UPDATE servicerequests AS sr
          JOIN driveroffers AS dof ON sr.request_id = dof.request_id
          SET sr.status = 'cancelled',
              dof.offer_status = 'rejected'
          WHERE sr.request_id = ?;
        `;

  con.query(sql, [request_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({
      Status: true,
      AffectedRows: result.affectedRows,
    });
  });
});

router.post("/driver/update_location", (req, res) => {
  const { driver_id, current_latitude, current_longitude } = req.body;

  const sql = `
          update
            driverdetails
          set
            current_latitude = ?,
            current_longitude = ?
          where
            driver_id = ?
        `;

  con.query(
    sql,
    [current_latitude, current_longitude, driver_id],
    (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({
        Status: true,
        AffectedRows: result.affectedRows,
      });
    }
  );
});

export { router as adminRouter };
