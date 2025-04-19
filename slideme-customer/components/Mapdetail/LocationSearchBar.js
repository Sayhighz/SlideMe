import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { StyleSheet } from "react-native";

const LocationSearchBar = ({ onPress }) => {
  return (
    <View style={tw`mb-5`}>
      <TouchableOpacity
        style={[
          tw`flex-row items-center justify-between p-4 bg-white rounded-xl`,
          Platform.OS === 'ios' ? styles.iosShadow : styles.androidShadow
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={tw`flex-row items-center`}>
          <View style={styles.searchIconContainer}>
            <MaterialIcons
              name="search"
              size={22}
              color="#3B82F6"
            />
          </View>
          <Text style={[styles.globalText, tw`text-gray-700 text-base ml-3`]}>
            ค้นหาสถานที่
          </Text>
        </View>
        <View style={styles.arrowIconContainer}>
          <MaterialIcons name="chevron-right" size={22} color="#6B7280" />
        </View>
      </TouchableOpacity>
      
      {/* Hint text for better UX */}
      <Text style={[styles.globalText, tw`text-xs text-gray-500 mt-1 ml-2`]}>
        แตะเพื่อค้นหาสถานที่รับ-ส่ง
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  searchIconContainer: {
    backgroundColor: "#EFF6FF",
    padding: 8,
    borderRadius: 10,
  },
  arrowIconContainer: {
    backgroundColor: "#F3F4F6",
    padding: 6,
    borderRadius: 8,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  androidShadow: {
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});

export default LocationSearchBar;