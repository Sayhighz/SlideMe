import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();


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
    status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
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
  req.body.vehicle_type
];
  
    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, InsertId: result.insertId });
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
    const userId = req.query.user_id || 1;
    const sql = `
      SELECT
        payment_type,
        card_number,
        account_name,
        expiration_date
      FROM
        slideme.paymentmethods
      WHERE
        user_id = ?
        and status = 1;
    `;
    con.query(sql, [userId], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true, Result: result });
    });
  });



export { router as adminRouter };
