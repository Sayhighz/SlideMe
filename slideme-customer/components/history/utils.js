import { Dimensions } from "react-native";

export const PRIMARY_COLOR = "#60B876";
export const PRIMARY_DARK = "#4C9A61";
export const PRIMARY_LIGHT = "#7DC990";
export const SCREEN_WIDTH = Dimensions.get('window').width;

// Utility functions
export const formatThaiDate = (dateString) => {
  if (!dateString) return "ไม่ระบุ";
  
  const monthsThai = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  
  try {
    const [dayStr, monthStr, yearStr] = dateString.split("/");
    const day = parseInt(dayStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;
    const yearBE = parseInt(yearStr, 10) + 543 - 2500; // ตัดเหลือ 2 หลักท้าย พ.ศ.

    const monthThai = monthsThai[monthIndex];
    return `${day} ${monthThai} ${yearBE}`;
  } catch (e) {
    console.error("Date format error:", e);
    return "ไม่ระบุ";
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return "ไม่ระบุ";
  return timeString;
};

export const formatDistance = (distance) => {
  if (!distance) return "ไม่ระบุ";
  return `${distance} กม.`;
};

export const formatDuration = (minutes) => {
  if (!minutes) return "ไม่ระบุ";
  
  if (minutes < 60) {
    return `${minutes} นาที`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ชั่วโมง`;
    } else {
      return `${hours} ชั่วโมง ${remainingMinutes} นาที`;
    }
  }
};

export const mapServiceStatus = (status) => {
  switch (status) {
    case "completed":
      return "สำเร็จ";
    case "cancelled":
      return "ยกเลิก";
    case "pickup_in_progress":
      return "กำลังไปรับ";
    case "waiting_for_driver":
      return "รอคนขับรับงาน";
    case "in_progress":
      return "กำลังเดินทาง";
    case "confirmed":
      return "ยืนยันแล้ว";
    default:
      return "กำลังดำเนินการ";
  }
};

export const getStatusInfo = (status) => {
  switch (status) {
    case "completed":
      return { 
        icon: "checkmark-circle", 
        color: "#28a745", 
        bgColor: "#d4edda",
        label: "สำเร็จ" 
      };
    case "cancelled":
      return { 
        icon: "close-circle", 
        color: "#dc3545", 
        bgColor: "#f8d7da",
        label: "ยกเลิก" 
      };
    case "pickup_in_progress":
      return { 
        icon: "car", 
        color: "#007bff", 
        bgColor: "#cce5ff",
        label: "กำลังไปรับ" 
      };
    case "waiting_for_driver":
      return { 
        icon: "time", 
        color: "#ffc107", 
        bgColor: "#fff3cd",
        label: "รอคนขับ" 
      };
    case "in_progress":
      return { 
        icon: "navigate", 
        color: "#17a2b8", 
        bgColor: "#d1ecf1",
        label: "กำลังเดินทาง" 
      };
    case "confirmed":
      return { 
        icon: "thumbs-up", 
        color: "#6f42c1", 
        bgColor: "#e2d9f3",
        label: "ยืนยันแล้ว" 
      };
    default:
      return { 
        icon: "hourglass", 
        color: "#6c757d", 
        bgColor: "#e9ecef",
        label: "กำลังดำเนินการ" 
      };
  }
};

export const formatNumberWithCommas = (number) => {
  if (!number) return "0";
  
  // ถ้าเป็น string ที่มี format อยู่แล้ว เช่น "฿1,000.00"
  if (typeof number === 'string' && number.includes(',')) {
    return number;
  }
  
  // แปลงเป็น string และจัด format
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// แปลงรูปภาพ Array ที่เก็บใน JSON string ให้เป็น Array ของ URL รูปภาพ
export const parsePhotos = (photosString) => {
  if (!photosString) return [];
  
  try {
    // ถ้าเป็น array อยู่แล้ว
    if (Array.isArray(photosString)) {
      return photosString.filter(photo => photo !== null && photo !== undefined);
    }
    
    // ถ้าเป็น string ที่เก็บ JSON
    try {
      const photos = JSON.parse(photosString);
      if (Array.isArray(photos)) {
        return photos.filter(photo => photo !== null && photo !== undefined);
      }
    } catch (parseError) {
      // If parsing fails, it might be a single string URL
      if (typeof photosString === 'string') {
        return [photosString];
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error parsing photos:", error);
    return [];
  }
};

export const hasPhotos = (item) => {
  if (!item) return false;
  
  const beforePhotos = item.photos_before_service || [];
  const afterPhotos = item.photos_after_service || [];
//   console.log(beforePhotos)
  
  return beforePhotos.length > 0 || afterPhotos.length > 0;
};