import jwt from 'jsonwebtoken';

// Middleware สำหรับตรวจสอบ token และสิทธิ์ของผู้ใช้
const verifyToken = (req, res, next) => {
  // ตรวจสอบว่ามี token ใน cookies หรือไม่
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'ไม่พบ Token ในคุกกี้' });
  }

  // ถอดรหัส token เพื่อเข้าถึงข้อมูล
  jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
    req.user = decoded; // เก็บข้อมูลผู้ใช้ใน req.user เพื่อให้ middleware ถัดไปใช้งาน
    next();
  });
};

export { verifyToken };
