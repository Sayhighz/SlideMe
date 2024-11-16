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
    booking_time,
    customer_message,
    status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,'pending')
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
  req.body.customer_message
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
    req.body.review_text
  ];
    
      con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, InsertId: result.insertId });
      });
    });

    router.post("/add_address", (req, res) => {
      const sql = `
      INSERT INTO addresses (
        user_id,
        address_name,
        address_detail,
        latitude,
        longitude
    ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.user_id,
      req.body.address_name,
      req.body.address_detail,
      req.body.latitude,
      req.body.longitude
    ];
      
        con.query(sql, values, (err, result) => {
          if (err) return res.json({ Status: false, Error: err.message });
          return res.json({ Status: true, InsertId: result.insertId });
        });
      });


      router.post("/update_address", (req, res) => {
        const sql = `
          UPDATE addresses 
          SET 
            address_name = ?, 
            address_detail = ?, 
            latitude = ?, 
            longitude = ?
          WHERE address_id = ?
        `;
      
        const values = [
          req.body.address_name,
          req.body.address_detail,
          req.body.latitude,
          req.body.longitude,
          req.body.address_id
        ];
        
        con.query(sql, values, (err, result) => {
          if (err) return res.json({ Status: false, Error: err.message });
          return res.json({ 
            Status: true, 
            AffectedRows: result.affectedRows 
          });
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
          req.body.user_id
        ];
        
        con.query(sql, values, (err, result) => {
          if (err) return res.json({ Status: false, Error: err.message });
          return res.json({ 
            Status: true, 
            AffectedRows: result.affectedRows 
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
        req.body.expiration_date
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
            req.body.payment_method_id
          ];
          
          con.query(sql, values, (err, result) => {
            if (err) return res.json({ Status: false, Error: err.message });
            return res.json({ 
              Status: true, 
              AffectedRows: result.affectedRows 
            });
          });
        });
        



export { router as adminRouter };
