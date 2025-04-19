import { IP_ADDRESS } from "../../config";
import { formatDateToMySQL } from "./utils";

// ฟังก์ชั่นดึงข้อมูลประเภทรถ
export const fetchVehicleTypes = async () => {
  try {
    const response = await fetch(
      `http://${IP_ADDRESS}:4000/api/v1/customer/request/vehicle_type`
    );
    
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    throw error;
  }
};

// ฟังก์ชั่นดึงข้อมูลบุ๊คมาร์ค
export const fetchBookmarks = async (userId) => {
  try {
    if (!userId) {
      console.warn("fetchBookmarks called without userId");
      return [];
    }
    
    const response = await fetch(
      `http://${IP_ADDRESS}:4000/customer/getuserbookmarks?user_id=${userId}`
    );
    
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.Status) {
      return data.Result;
    } else {
      console.error("Bookmark API error:", data.Error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message);
    throw error;
  }
};

// ฟังก์ชั่นส่งคำขอใหม่
export const submitRequest = async (requestData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    
    const response = await fetch(`http://${IP_ADDRESS}:4000/api/v1/customer/request/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting request:", error);
    throw error;
  }
};

// ฟังก์ชั่นส่งคำขอจากบุ๊คมาร์ค
export const submitRequestFromBookmark = async (userId, selectedBookmark, token) => {
  try {
    if (!userId || !selectedBookmark) {
      throw new Error("Missing required parameter: userId or bookmark data");
    }
    
    const requestData = {
      customer_id: userId,
      request_time: formatDateToMySQL(new Date()),
      pickup_lat: selectedBookmark.pickup_lat,
      pickup_long: selectedBookmark.pickup_long,
      location_from: selectedBookmark.location_from,
      dropoff_lat: selectedBookmark.dropoff_lat,
      dropoff_long: selectedBookmark.dropoff_long,
      location_to: selectedBookmark.location_to,
      vehicletype_id: selectedBookmark.vahicle_type, // ต้องตรวจสอบการสะกดชื่อตัวแปรนี้
      booking_time: formatDateToMySQL(new Date()),
      customer_message: null,
    };

    // ใช้ endpoint เดียวกับ submitRequest เนื่องจากโครงสร้างข้อมูลเหมือนกัน
    return await submitRequest(requestData, token);
  } catch (error) {
    console.error("Error submitting request from bookmark:", error);
    throw error;
  }
};