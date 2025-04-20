import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";

export default function LocationInfo({ origin, destination, styles }) {
  return (
    <View style={tw`px-4 py-2`}>
      {/* Origin Location */}
      <TouchableOpacity
        style={tw`flex-row items-center py-3`}
        onPress={() => {
          Alert.alert("ต้นทาง", origin.name || "ไม่ระบุ");
        }}
      >
        <View style={tw`mr-4 items-center`}>
          <View style={tw`h-8 w-8 rounded-full bg-red-100 justify-center items-center`}>
            <MaterialIcons name="trip-origin" size={18} color="#ef4444" />
          </View>
          {/* Connecting line */}
          <View style={tw`h-8 w-0.5 bg-gray-300 my-1`} />
        </View>
        
        <View style={tw`flex-1`}>
          <Text style={[styles.globalText, tw`text-xs text-gray-500 mb-0.5`]}>
            ต้นทาง
          </Text>
          <Text 
            style={[styles.globalText, tw`text-gray-800`]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {origin.name || "ไม่ระบุ"}
          </Text>
        </View>
        <MaterialIcons name="info-outline" size={20} color="#9ca3af" style={tw`ml-2`} />
      </TouchableOpacity>

      {/* Destination Location */}
      <TouchableOpacity
        style={tw`flex-row items-center py-3`}
        onPress={() => {
          Alert.alert("ปลายทาง", destination.name || "ไม่ระบุ");
        }}
      >
        <View style={tw`mr-4 items-center`}>
          <View style={tw`h-8 w-8 rounded-full bg-green-100 justify-center items-center`}>
            <MaterialIcons name="place" size={20} color="#10b981" />
          </View>
        </View>
        
        <View style={tw`flex-1`}>
          <Text style={[styles.globalText, tw`text-xs text-gray-500 mb-0.5`]}>
            ปลายทาง
          </Text>
          <Text 
            style={[styles.globalText, tw`text-gray-800`]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {destination.name || "ไม่ระบุ"}
          </Text>
        </View>
        <MaterialIcons name="info-outline" size={20} color="#9ca3af" style={tw`ml-2`} />
      </TouchableOpacity>
    </View>
  );
}