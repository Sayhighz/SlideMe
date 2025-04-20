import React from "react";
import { View, Text, StyleSheet } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";

export default function OrderHeader({ time, requestId, styles }) {
  return (
    <View style={[
      tw`flex-row justify-between px-4 py-4 items-center bg-white mx-4 my-3 rounded-xl`,
      styles.shadow
    ]}>
      <View style={tw`flex-row items-center`}>
        <MaterialIcons name="access-time" size={18} color="#4b5563" style={tw`mr-2`} />
        <Text style={[styles.globalText, tw`text-sm text-gray-600`]}>
          {time || "ไม่ระบุ"}
        </Text>
      </View>
      <View style={tw`flex-row items-center`}>
        <MaterialIcons name="receipt" size={18} color="#4b5563" style={tw`mr-2`} />
        <Text style={[styles.globalText, tw`text-sm text-gray-600`]}>
          {requestId || "ไม่ระบุ"}
        </Text>
      </View>
    </View>
  );
}