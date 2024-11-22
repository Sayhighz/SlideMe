import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { IP_ADDRESS } from "../config";
import * as Location from 'expo-location';

export default function DriverLocation({ driver_id }) {
  const [location, setLocation] = useState(null); // Store location data
  const locationWatcher = useRef(null); // To manage the location watcher reference

  // Function to start tracking location
  const startTrackingLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please enable location services.");
        return;
      }

      // Start watching the user's location
      locationWatcher.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update when moved by at least 1 meter
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation({ latitude, longitude }); // Update state with new location
          console.log("Updated Location:", { latitude, longitude });
        }
      );
    } catch (error) {
      console.error("Error starting location tracking:", error);
    }
  };

  // Function to stop tracking location
  const stopTrackingLocation = () => {
    if (locationWatcher.current) {
      locationWatcher.current.remove(); // Stop the watcher
      locationWatcher.current = null;
      console.log("Location watcher removed");
    }
  };

  // Function to update location to the server
  const updateLocationToDB = async (location) => {
    if (!location) return; // Ensure we have valid location data
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/driver/update_location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_id,                  // Send driver ID
            current_latitude: location.latitude,  // Explicitly define latitude
            current_longitude: location.longitude, // Explicitly define longitude
          }),
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

  // Start tracking on component mount and clean up on unmount
  useEffect(() => {
    startTrackingLocation();

    return () => {
      stopTrackingLocation(); // Clean up watcher
    };
  }, []);

  // Update location to DB whenever location state changes
  useEffect(() => {
    if (location) {
      updateLocationToDB(location);
    }
  }, [location]);

  return null; // This component does not render anything
}
