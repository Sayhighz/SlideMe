import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import tw from "twrnc";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons } from "@expo/vector-icons";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

export default function OrderMap({ 
  origin = {}, 
  destination = {}, 
  driverLocation = {}, 
  driverInformation = {},
  confirmFromDriver = false
}) {
  // ล็อกข้อมูลที่ได้รับเพื่อดีบั๊ก
  console.log("OrderMap props:", 
    JSON.stringify({
      origin: origin || {},
      destination: destination || {},
      driverLocation: driverLocation || {},
      driverInfo: driverInformation || {},
      confirmFromDriver
    }, null, 2)
  );

  const mapRef = useRef(null);
  
  // แปลงค่าพิกัดให้เป็นตัวเลขและตรวจสอบความถูกต้อง
  const originLat = typeof origin?.latitude === 'number' ? origin.latitude : 
                   (origin?.latitude ? parseFloat(origin.latitude) : null);
  const originLng = typeof origin?.longitude === 'number' ? origin.longitude : 
                   (origin?.longitude ? parseFloat(origin.longitude) : null);
  
  const destLat = typeof destination?.latitude === 'number' ? destination.latitude : 
                 (destination?.latitude ? parseFloat(destination.latitude) : null);
  const destLng = typeof destination?.longitude === 'number' ? destination.longitude : 
                 (destination?.longitude ? parseFloat(destination.longitude) : null);
  
  const driverLat = typeof driverLocation?.latitude === 'number' ? driverLocation.latitude : 
                   (driverLocation?.latitude ? parseFloat(driverLocation.latitude) : null);
  const driverLng = typeof driverLocation?.longitude === 'number' ? driverLocation.longitude : 
                   (driverLocation?.longitude ? parseFloat(driverLocation.longitude) : null);
  
  // ตรวจสอบว่ามีค่าพิกัดที่ถูกต้องหรือไม่
  const hasOrigin = originLat !== null && !isNaN(originLat) && originLng !== null && !isNaN(originLng);
  const hasDestination = destLat !== null && !isNaN(destLat) && destLng !== null && !isNaN(destLng);
  const hasDriverLocation = driverLat !== null && !isNaN(driverLat) && driverLng !== null && !isNaN(driverLng);
  
  console.log("Valid coordinates:", { hasOrigin, hasDestination, hasDriverLocation });
  console.log("Origin coords:", { originLat, originLng });
  console.log("Destination coords:", { destLat, destLng });
  console.log("Driver coords:", { driverLat, driverLng });
  
  // สร้าง coordinate objects ที่ถูกต้องสำหรับ Marker
  const originCoordinate = hasOrigin ? {
    latitude: originLat,
    longitude: originLng
  } : null;
  
  const destinationCoordinate = hasDestination ? {
    latitude: destLat,
    longitude: destLng
  } : null;
  
  const driverCoordinate = hasDriverLocation ? {
    latitude: driverLat,
    longitude: driverLng
  } : null;
  
  const customMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{"color": "#f5f5f5"}]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#616161"}]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{"color": "#f5f5f5"}]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{"color": "#ffffff"}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#757575"}]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{"color": "#dadada"}]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{"color": "#c9c9c9"}]
    }
  ];

  // Calculate map bounds to fit all markers
  useEffect(() => {
    if (!mapRef.current) {
      console.log("Map ref not available yet");
      return;
    }
    
    try {
      const points = [];
      
      if (originCoordinate) {
        points.push(originCoordinate);
      }
      
      if (destinationCoordinate) {
        points.push(destinationCoordinate);
      }
      
      if (driverCoordinate) {
        points.push(driverCoordinate);
      }
      
      if (points.length < 1) {
        console.log("No valid points for map bounds");
        return;
      }
      
      console.log("Fitting map to points:", points);
      
      // Wait a bit for map to be fully loaded
      const timer = setTimeout(() => {
        try {
          mapRef.current.fitToCoordinates(points, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true
          });
        } catch (error) {
          console.error("Error fitting to coordinates:", error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error in useEffect for map bounds:", error);
    }
  }, [originCoordinate, destinationCoordinate, driverCoordinate]);

  // Custom marker icons
  const MarkerIcon = ({ name, color, size = 22 }) => (
    <View style={tw`bg-white p-2 rounded-full shadow-md`}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );

  // Default Bangkok coordinates if no valid coordinates are available
  const defaultLat = 13.855890002666245;
  const defaultLng = 100.58553823947129;
  
  // Use the first valid coordinates for initialRegion
  const initialLatitude = originLat || driverLat || defaultLat;
  const initialLongitude = originLng || driverLng || defaultLng;

  // If we don't have enough data for the map, show an error message
  if (!hasOrigin && !hasDestination && !hasDriverLocation) {
    return (
      <View style={[tw`flex-1 rounded-lg overflow-hidden bg-gray-100 justify-center items-center`, { minHeight: 200 }]}>
        <Text style={tw`text-gray-500`}>ไม่มีข้อมูลตำแหน่งเพียงพอ</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 rounded-lg overflow-hidden`}>
      <MapView
        ref={mapRef}
        style={tw`flex-1`}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        zoomControlEnabled={false}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {/* Origin Marker - เฉพาะเมื่อมีพิกัดที่ถูกต้อง */}
        {originCoordinate && (
          <Marker
            coordinate={originCoordinate}
            title="ต้นทาง"
            description={origin?.name || ""}
          >
            <MarkerIcon name="trip-origin" color="#ef4444" />
          </Marker>
        )}

        {/* Destination Marker - เฉพาะเมื่อมีพิกัดที่ถูกต้อง */}
        {destinationCoordinate && (
          <Marker
            coordinate={destinationCoordinate}
            title="ปลายทาง"
            description={destination?.name || ""}
          >
            <MarkerIcon name="place" color="#10b981" />
          </Marker>
        )}

        {/* Driver Marker - เฉพาะเมื่อมีพิกัดที่ถูกต้อง */}
        {driverCoordinate && (
          <Marker
            coordinate={driverCoordinate}
            title="คนขับ"
            description={(driverInformation && driverInformation.name) || ""}
          >
            <View style={tw`items-center`}>
              <View style={tw`bg-blue-500 p-2 rounded-full shadow-lg`}>
                <MaterialIcons name="directions-car" size={20} color="white" />
              </View>
              {/* Shadow effect under marker */}
              <View style={tw`bg-black opacity-20 h-1 w-4 rounded-full mt-1`} />
            </View>
          </Marker>
        )}

        {/* เส้นทางจากตำแหน่งคนขับไปยังจุดหมาย - เฉพาะเมื่อมีพิกัดที่ถูกต้อง */}
        {driverCoordinate && originCoordinate && destinationCoordinate && (
          <MapViewDirections
            origin={`${driverLat},${driverLng}`}
            destination={
              confirmFromDriver
                ? `${destLat},${destLng}`
                : `${originLat},${originLng}`
            }
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#3b82f6"
            lineDashPattern={[0]}
            mode="DRIVING"
            precision="high"
            departureTime="now"
            onError={(errorMessage) => {
              console.log("Error fetching directions: ", errorMessage);
            }}
          />
        )}

        {/* เส้นทางจากต้นทางไปยังปลายทาง - เฉพาะเมื่อมีพิกัดที่ถูกต้องและอยู่ในโหมด confirmFromDriver */}
        {confirmFromDriver && originCoordinate && destinationCoordinate && (
          <MapViewDirections
            origin={`${originLat},${originLng}`}
            destination={`${destLat},${destLng}`}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="#9ca3af"
            lineDashPattern={[1]}
            mode="DRIVING"
            precision="high"
            departureTime="now"
            onError={(errorMessage) => {
              console.log("Error fetching directions: ", errorMessage);
            }}
          />
        )}
      </MapView>
    </View>
  );
}