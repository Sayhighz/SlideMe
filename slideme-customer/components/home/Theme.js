// Theme.js - ไฟล์ที่รวมค่าคงที่ต่างๆ สำหรับธีมของแอปพลิเคชัน

// สีหลักของแอปพลิเคชัน
export const COLORS = {
    primary: "#4CAF50", // สีเขียวหลัก
    primaryLight: "#81C784", // สีเขียวอ่อน
    primaryDark: "#388E3C", // สีเขียวเข้ม
    secondary: "#FFC107", // สีรอง (เหลือง)
    accent: "#FF5722", // สีเน้น (ส้ม)
    
    // สีพื้นฐาน
    white: "#FFFFFF",
    black: "#212121",
    gray: "#E0E0E0",
    lightGray: "#F5F5F5",
    darkGray: "#757575",
    
    // สีพื้นหลัง
    background: "#F5F9F6", // สีพื้นหลังอ่อนๆ (เขียวนิดหน่อย)
    card: "#FFFFFF", // สีพื้นหลังการ์ด
    
    // สีสถานะ
    success: "#4CAF50", // สีสำเร็จ (เขียว)
    error: "#F44336", // สีผิดพลาด (แดง)
    warning: "#FFC107", // สีเตือน (เหลือง)
    info: "#2196F3", // สีข้อมูล (ฟ้า)
    
    // สีเงา
    shadow: "rgba(76, 175, 80, 0.24)", // เงาสีเขียวโปร่งแสง
  };
  
  // ขนาดต่างๆ สำหรับองค์ประกอบ UI
  export const SIZES = {
    // ขนาดตัวอักษร
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    
    // ขนาดขอบมน
    radiusSm: 8,
    radiusMd: 16,
    radiusLg: 20,
    radiusXl: 30,
    
    // ขนาดระยะห่าง (padding, margin)
    spacingSm: 8,
    spacingMd: 16,
    spacingLg: 20,
    spacingXl: 24,
  };
  
  // รูปแบบเงา
  export const SHADOWS = {
    small: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 10,
    },
  };
  
  // สไตล์ข้อความ
  export const FONTS = {
    heading: {
      fontFamily: "Mitr-Regular",
      fontWeight: "600",
      fontSize: SIZES.lg,
      color: COLORS.black,
    },
    subheading: {
      fontFamily: "Mitr-Regular",
      fontSize: SIZES.md,
      color: COLORS.darkGray,
    },
    body: {
      fontFamily: "Mitr-Regular",
      fontSize: SIZES.sm,
      color: COLORS.black,
    },
    caption: {
      fontFamily: "Mitr-Regular",
      fontSize: SIZES.xs,
      color: COLORS.darkGray,
    },
    button: {
      fontFamily: "Mitr-Regular",
      fontSize: SIZES.sm,
      fontWeight: "600",
      color: COLORS.white,
    },
  };
  
  export default {
    COLORS,
    SIZES,
    SHADOWS,
    FONTS,
  };