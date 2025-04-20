import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const DriverMap = ({
  originLocation,
  destinationLocation,
  drivers = [],
  selectedDriver,
  radiusInMeters,
}) => {
  // Check if we have valid locations
  const hasValidLocations = 
    originLocation?.latitude && 
    destinationLocation?.latitude && 
    originLocation.latitude !== 0 && 
    destinationLocation.latitude !== 0;

  if (!hasValidLocations) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={styles.globalText}>กำลังโหลดแผนที่...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={tw`flex-1 w-full`}
      initialRegion={{
        latitude: originLocation.latitude,
        longitude: originLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* Origin marker */}
      <Marker
        coordinate={{
          latitude: originLocation.latitude,
          longitude: originLocation.longitude,
        }}
        title="ต้นทาง"
        description={originLocation.name}
      >
        <MaterialIcons
          name="location-pin"
          size={35}
          color="#e53e3e"
        />
      </Marker>

      {/* Destination marker */}
      <Marker
        coordinate={{
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
        }}
        title="ปลายทาง"
        description={destinationLocation.name}
      >
        <MaterialIcons
          name="location-pin"
          size={35}
          color="#38a169"
        />
      </Marker>

      {/* Driver markers */}
      {drivers.map((driver, index) => (
        <Marker
          key={`driver-${driver.id}-${index}`}
          coordinate={{
            latitude: driver.location.latitude,
            longitude: driver.location.longitude,
          }}
          title={driver.name}
          description={`คะแนน: ${driver.rating || 0}`}
        >
          <MaterialIcons
            name="local-shipping"
            size={35}
            color={selectedDriver?.id === driver.id ? "#4c51bf" : "#718096"}
          />
        </Marker>
      ))}

      {/* Radius circle */}
      <Circle
        center={originLocation}
        radius={radiusInMeters}
        fillColor="rgba(99, 179, 237, 0.2)"
        strokeColor="rgba(99, 179, 237, 0.5)"
        strokeWidth={1}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default DriverMap;