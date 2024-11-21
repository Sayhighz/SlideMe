import React, { useEffect } from "react";
// import Geolocation from "@react-native-community/geolocation";
import { Alert } from "react-native";
import { IP_ADDRESS } from "../config";
// import * as Location from "expo-location";

export default function DriverLocation({ driver_id }) {
  const [location, setLocation] = React.useState({});

  const locationWatcher = React.useRef(null);

  const updateLocation = async () => {
    try {
      // ขออนุญาตการใช้งานตำแหน่ง
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "กรุณาอนุญาตการใช้งานตำแหน่งในแอปเพื่อให้สามารถใช้งานฟีเจอร์นี้ได้"
        );
        console.warn("Permission to access location was denied");
        return;
      }

      // เฝ้าดูตำแหน่งของผู้ใช้แบบเรียลไทม์
      locationWatcher.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // ใช้ GPS ที่มีความแม่นยำสูง
          timeInterval: 100000, // อัปเดตทุก 1 วินาที
          distanceInterval: 10, // อัปเดตเมื่อเคลื่อนที่อย่างน้อย 1 เมตร
        },
        async (location) => {
          const { latitude, longitude } = location.coords;

          // ข้อมูลที่ต้องส่งไปยังเซิร์ฟเวอร์
          const data = {
            driver_id,
            current_latitude: latitude.toString(),
            current_longitude: longitude.toString(),
          };

          console.log(data);
          setLocation(data);
        }
      );
    } catch (error) {
      // Alert.alert(
      //   "Error Fetching Location",
      //   "เกิดข้อผิดพลาดในการดึงข้อมูลตำแหน่งของคุณ กรุณาลองอีกครั้ง"
      // );
      // console.warn("Error fetching location", error);
    }
  };

  const updateLocationToDB = async () => {
    console.log(location);

    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/driver/update_location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(location),
        }
      );

      const responseData = await response.json();

      if (!responseData.Status) {
        console.error("API Error:", responseData.Error);
      } else {
        console.log("Location updated successfully:", responseData);
      }
    } catch (error) {
      console.error("Network Error:", error.message);
    }
  };

  useEffect(() => {
    updateLocationToDB();
  }, [location]);

  // เรียกใช้ฟังก์ชันเมื่อ component ถูก mount
  useEffect(() => {
    updateLocation();

    // ยกเลิก watcher เมื่อ component ถูก unmount
    return () => {
      if (locationWatcher.current) {
        locationWatcher.current.remove();
        console.log("Location watcher removed");
      }
    };
  }, []);

  // เรียกใช้ updateLocation ทุก ๆ 10 วินาที
  locationInterval = setInterval(() => {
    updateLocation();
  }, 10000);

  return () => {
    if (locationInterval) {
      clearInterval(locationInterval);
    }
  };

  return null; // ไม่มี UI สำหรับ component นี้
}
