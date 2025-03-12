import con from "../config/db.js";

export const updateOfferStatus = (req, res) => {
  const { request_id, chosen_driver_id } = req.body;

  if (!request_id || !chosen_driver_id) {
    return res
      .status(400)
      .json({ Status: false, Message: "Invalid parameters" });
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

  con.query(
    sqlUpdateAccepted,
    [request_id, chosen_driver_id],
    (err, result) => {
      if (err) {
        console.error("Error updating accepted offer:", err);
        return res.status(500).json({ Status: false, Error: err.message });
      }

      con.query(
        sqlUpdateRejected,
        [request_id, chosen_driver_id],
        (err, result) => {
          if (err) {
            console.error("Error updating rejected offers:", err);
            return res.status(500).json({ Status: false, Error: err.message });
          }

          return res.status(200).json({
            Status: true,
            Message: "Offer status updated successfully",
          });
        }
      );
    }
  );
};
