import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();

// //end upload

router.post("/add_request", (req, res) => {
    const sql = `
      INSERT INTO requests (
        customer_id,
        driver_id,
        request_time,
        pickup_location_lat,
        pickup_location_long,
        pickup_name,
        dropoff_location_lat,
        dropoff_location_long,
        dropoff_name,
        vehicle_type,
        status
      ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
  
    const values = [
      req.body.customer_id,
      req.body.driver_id,
      req.body.request_time,
      req.body.pickup_location_lat,
      req.body.pickup_location_long,
      req.body.pickup_name,
      req.body.dropoff_location_lat,
      req.body.dropoff_location_long,
      req.body.dropoff_name,
      req.body.vehicle_type,
      req.body.status,
    ];
  
    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, InsertId: result.insertId });
    });
  });

// // req orderNo
export { router as adminRouter };
