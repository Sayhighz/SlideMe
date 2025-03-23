import express from "express";
import { 
    addPaymentMethod, 
    updatePaymentMethod, 
    disablePaymentMethod, 
    getAllUserPaymentMethods, 
    getPaymentMethod
} from "../controllers/paymentController.js";

const router = express.Router();

// ✅ เพิ่มวิธีการชำระเงิน
router.post("/payment-method/add", addPaymentMethod);

// ✅ อัปเดตข้อมูลวิธีการชำระเงิน (ใช้ `POST` แทน `PUT`)
router.post("/payment-method/update", updatePaymentMethod);

// ✅ ปิดการใช้งานวิธีการชำระเงิน (ใช้ `POST` แทน `PUT`)
router.post("/payment-method/disable", disablePaymentMethod);

// ✅ ดึงรายการวิธีการชำระเงินทั้งหมดของลูกค้า
router.get("/payment-methods", getAllUserPaymentMethods);

// ✅ ดึงวิธีการชำระเงินเฉพาะของลูกค้า
router.get("/payment-method", getPaymentMethod);

export default router;
