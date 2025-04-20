import React from "react";
import { View, Text, StyleSheet } from "react-native";
import tw from "twrnc";
import DriverInfo from "./DriverInfo";
import LocationInfo from "./LocationInfo";

export default function OrderDetailsCard({
  driverInformation,
  origin,
  destination,
  styles
}) {
  return (
    <View
      style={[
        tw`mx-4 bg-white rounded-xl overflow-hidden mb-4`,
        styles.shadow
      ]}
    >
      {/* Driver Information */}
      <DriverInfo driverInformation={driverInformation} styles={styles} />
      
      {/* Divider */}
      <View style={tw`h-0.5 bg-gray-100 mx-3`} />
      
      {/* Locations Information */}
      <LocationInfo origin={origin} destination={destination} styles={styles} />
    </View>
  );
}