import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fetchImage, uploadBeforeService, uploadAfterService } from '../controllers/uploadController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.get("/fetch_image", fetchImage);
router.post("/upload_before_service", upload.array("photos", 4), uploadBeforeService);
router.post("/upload_after_service", upload.array("photos", 4), uploadAfterService);

export default router;
