import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import tw from "twrnc";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons } from "@expo/vector-icons";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

export default function OrderMap({ 
  origin, 
  destination, 
  driverLocation, 
  driverInformation,
  confirmFromDriver 
}) {
  const mapRef = useRef(null);
  
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
    if (!mapRef.current || !origin.latitude || !destination.latitude) return;

    const points = [
      { latitude: origin.latitude, longitude: origin.longitude },
      { latitude: destination.latitude, longitude: destination.longitude }
    ];

    if (driverLocation.latitude && driverLocation.longitude) {
      points.push({ latitude: driverLocation.latitude, longitude: driverLocation.longitude });
    }

    // Wait a bit for map to be fully loaded
    const timer = setTimeout(() => {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [origin, destination, driverLocation]);

  // Custom marker icons
  const MarkerIcon = ({ name, color, size = 22 }) => (
    <View style={tw`bg-white p-2 rounded-full shadow-md`}>
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );

  return (
    <View style={tw`flex-1 rounded-lg overflow-hidden`}>
      <MapView
        ref={mapRef}
        style={tw`flex-1`}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: origin.latitude || 13.855890002666245,
          longitude: origin.longitude || 100.58553823947129,
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
        {/* Origin Marker */}
        {origin.latitude && origin.longitude && (
          <Marker
            coordinate={origin}
            title="ต้นทาง"
            description={origin.name}
          >
            <MarkerIcon name="trip-origin" color="#ef4444" />
          </Marker>
        )}

        {/* Destination Marker */}
        {destination.latitude && destination.longitude && (
          <Marker
            coordinate={destination}
            title="ปลายทาง"
            description={destination.name}
          >
            <MarkerIcon name="place" color="#10b981" />
          </Marker>
        )}

        {/* Driver Marker */}
        {driverLocation.latitude && driverLocation.longitude && (
          <Marker
            coordinate={driverLocation}
            title="คนขับ"
            description={driverInformation.name}
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

        {/* MapView Directions */}
        {origin.latitude &&
          origin.longitude &&
          destination.latitude &&
          destination.longitude &&
          driverLocation.latitude &&
          driverLocation.longitude && (
            <MapViewDirections
              origin={`${driverLocation.latitude},${driverLocation.longitude}`}
              destination={
                confirmFromDriver
                  ? `${destination.latitude},${destination.longitude}`
                  : `${origin.latitude},${origin.longitude}`
              }
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="#3b82f6"
              lineDashPattern={[0]}
              mode="DRIVING"
              precision="high"
              timePrecision="high"
              onError={(errorMessage) => {
                console.log("Error fetching directions: ", errorMessage);
              }}
            />
          )}

        {/* Show route from origin to destination */}
        {confirmFromDriver && origin.latitude && origin.longitude && destination.latitude && destination.longitude && (
          <MapViewDirections
            origin={`${origin.latitude},${origin.longitude}`}
            destination={`${destination.latitude},${destination.longitude}`}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="#9ca3af"
            lineDashPattern={[1]}
            mode="DRIVING"
            precision="high"
            timePrecision="high"
            onError={(errorMessage) => {
              console.log("Error fetching directions: ", errorMessage);
            }}
          />
        )}
      </MapView>
    </View>
  );
}