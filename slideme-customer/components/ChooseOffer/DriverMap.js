import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const INITIAL_DELTA = { latitudeDelta: 0.05, longitudeDelta: 0.05 };
const { width, height } = Dimensions.get('window');

const DriverMap = ({
  originLocation,
  destinationLocation,
  drivers = [],
  selectedDriver,
  radiusInMeters,
}) => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Check if we have valid locations
  const hasValidLocations = 
    originLocation?.latitude && 
    destinationLocation?.latitude && 
    originLocation.latitude !== 0 && 
    destinationLocation.latitude !== 0;

  // When driver selection changes, animate to that driver
  useEffect(() => {
    if (mapReady && selectedDriver && hasValidLocations) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: (selectedDriver.location.latitude + originLocation.latitude) / 2,
          longitude: (selectedDriver.location.longitude + originLocation.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 500);
      }, 100);
    }
  }, [selectedDriver, mapReady]);

  // Animate to fit all markers when map is ready
  const onMapReady = () => {
    setMapReady(true);
    if (hasValidLocations) {
      fitAllMarkers();
    }
  };

  // Calculate region to show all markers
  const fitAllMarkers = () => {
    if (!hasValidLocations || !mapRef.current) return;
    
    const points = [
      { latitude: originLocation.latitude, longitude: originLocation.longitude },
      { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude },
      ...drivers.map(driver => ({
        latitude: driver.location.latitude,
        longitude: driver.location.longitude
      }))
    ];
    
    if (points.length < 2) return;
    
    const padding = { top: 100, right: 50, bottom: 100, left: 50 };
    mapRef.current.fitToCoordinates(points, { edgePadding: padding, animated: true });
  };

  if (!hasValidLocations) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <MaterialIcons name="map" size={48} color="#CBD5E0" />
        <Text style={[styles.globalText, tw`text-gray-500 mt-2`]}>กำลังโหลดแผนที่...</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1 w-full`}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
      initialRegion={{
        latitude: originLocation.latitude,
        longitude: originLocation.longitude,
        ...INITIAL_DELTA
      }}
      onMapReady={onMapReady}
      onLayout={fitAllMarkers}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsCompass={true}
      toolbarEnabled={true}
      moveOnMarkerPress={true}
      mapPadding={{ top: 0, right: 0, bottom: 20, left: 0 }}
    >
      {/* Origin marker */}
      <Marker
        coordinate={{
          latitude: originLocation.latitude,
          longitude: originLocation.longitude,
        }}
        title="ต้นทาง"
        description={originLocation.name}
        tracksViewChanges={false}
      >
        <View style={styles.markerContainer}>
          <MaterialIcons
            name="location-pin"
            size={36}
            color="#E53E3E"
          />
          <View style={styles.markerLabelContainer}>
            <Text style={styles.markerLabel}>ต้นทาง</Text>
          </View>
        </View>
      </Marker>

      {/* Destination marker */}
      <Marker
        coordinate={{
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
        }}
        title="ปลายทาง"
        description={destinationLocation.name}
        tracksViewChanges={false}
      >
        <View style={styles.markerContainer}>
          <MaterialIcons
            name="location-pin"
            size={36}
            color="#38A169"
          />
          <View style={[styles.markerLabelContainer, styles.destinationLabel]}>
            <Text style={styles.markerLabel}>ปลายทาง</Text>
          </View>
        </View>
      </Marker>

      {/* Driver markers */}
      {drivers.map((driver) => (
        <Marker
          key={`driver-${driver.id}`}
          coordinate={{
            latitude: driver.location.latitude,
            longitude: driver.location.longitude,
          }}
          title={driver.name}
          description={`คะแนน: ${driver.rating || 0}`}
          tracksViewChanges={false}
        >
          <View style={styles.markerContainer}>
            <MaterialIcons
              name="local-shipping"
              size={32}
              color={selectedDriver?.id === driver.id ? "#4C51BF" : "#718096"}
              style={selectedDriver?.id === driver.id ? styles.selectedDriverIcon : null}
            />
            {selectedDriver?.id === driver.id && (
              <View style={styles.pulseEffect} />
            )}
          </View>
        </Marker>
      ))}

      {/* Radius circle */}
      <Circle
        center={originLocation}
        radius={radiusInMeters}
        fillColor="rgba(99, 179, 237, 0.15)"
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
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabelContainer: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    position: 'absolute',
    top: -20,
  },
  destinationLabel: {
    backgroundColor: '#38A169',
  },
  markerLabel: {
    color: 'white',
    fontSize: 10,
    fontFamily: "Mitr-Regular",
  },
  selectedDriverIcon: {
    borderWidth: 2,
    borderColor: '#4C51BF',
    borderRadius: 16,
    padding: 4,
    backgroundColor: '#EBF4FF',
  },
  pulseEffect: {
    position: 'absolute',
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 81, 191, 0.2)',
  }
});

export default DriverMap;