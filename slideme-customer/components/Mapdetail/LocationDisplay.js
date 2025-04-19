import React from "react";
import { View, Text, TextInput, Animated, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { StyleSheet } from "react-native";

const LocationDisplay = ({ origin, destination }) => {
  return (
    <Animated.View 
      style={[
        tw`bg-gray-50 p-4 rounded-2xl mb-5 shadow-md border border-gray-100`,
        Platform.OS === 'ios' ? styles.iosShadow : styles.androidShadow
      ]}
    >
      {/* Pickup Location Display */}
      <View style={tw`flex-row items-center mb-4 bg-white py-3 px-3 rounded-xl`}>
        <View style={[tw`mr-2 items-center justify-center`, styles.iconContainer]}>
          <MaterialIcons name="location-pin" size={24} color="#FF4757" />
        </View>
        <TextInput
          style={[styles.globalText, tw`flex-1 text-gray-800 text-base`]}
          placeholder="สถานที่รับรถ"
          value={origin && origin.length ? origin : ""}
          placeholderTextColor="#9CA3AF"
          editable={false}
        />
      </View>

      {/* Dotted Line with improved styling */}
      <View style={tw`flex-row items-center pl-6 mb-4`}>
        <View style={styles.verticalDottedLine} />
      </View>

      {/* Destination Location Display */}
      <View style={tw`flex-row items-center bg-white py-3 px-3 rounded-xl`}>
        <View style={[tw`mr-2 items-center justify-center`, styles.iconContainer]}>
          <MaterialIcons name="location-pin" size={24} color="#2ECC71" />
        </View>
        <TextInput
          style={[styles.globalText, tw`flex-1 text-gray-800 text-base`]}
          placeholder="สถานที่ส่งรถ"
          value={destination && destination.length ? destination : ""}
          placeholderTextColor="#9CA3AF"
          editable={false}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  verticalDottedLine: {
    height: 24,
    width: 1,
    borderStyle: "dotted",
    borderWidth: 1,
    borderColor: "#6B7280",
    marginLeft: 12,
  },
  iconContainer: {
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 12,
    width: 40,
    height: 40,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  androidShadow: {
    elevation: 3,
  },
});

export default LocationDisplay;