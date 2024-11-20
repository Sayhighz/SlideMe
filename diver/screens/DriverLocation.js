import React, { useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";
import { Alert } from "react-native";
import { IP_ADDRESS } from "../config";

export default function DriverLocation({ driver_id }) {
  useEffect(() => {
    let locationInterval;

    const updateLocation = async () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const data = {
            driver_id,
            current_latitude: latitude.toString(),
            current_longitude: longitude.toString(),
          };

          try {
            const response = await fetch(`http://${IP_ADDRESS}:3000/auth/driver/update_location`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!responseData.Status) {
              console.error("API Error:", responseData.Error);
            }
          } catch (error) {
            console.error("Network Error:", error.message);
          }
        },
        (error) => {
          console.error("GPS Error:", error.message);
          if (error.code === 1) {
            Alert.alert(
              "Permission Denied",
              "กรุณาเปิดใช้งาน GPS และอนุญาตให้แอปใช้งานตำแหน่ง"
            );
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    // เรียกใช้ updateLocation ทุก ๆ 10 วินาที
    locationInterval = setInterval(() => {
      updateLocation();
    }, 10000);

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [driver_id]);

  return null; // ไม่มี UI สำหรับ component นี้
}
