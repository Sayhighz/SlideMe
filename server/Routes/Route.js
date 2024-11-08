import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();


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

  router.get("/service_history_customer", (req, res) => {
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
        sr.customer_id = 1  -- Replace '?' with the actual customer_id or use it as a placeholder for prepared statements
    ORDER BY 
        sr.request_time DESC;

    `;
  
    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, InsertId: result.insertId });
    });
  });


// // req orderNo
export { router as adminRouter };
