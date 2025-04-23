import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import { IP_ADDRESS } from "../../config";

export default function DriverInfo({ driverInformation, styles }) {
    console.log("Driver Information:", driverInformation);
  return (
    <View style={tw`flex-row items-center w-full py-4 px-4`}>
      {/* Driver Avatar */}
      <View style={tw`h-14 w-14 rounded-full bg-blue-100 mr-4 justify-center items-center overflow-hidden`}>
      <Image
            source={driverInformation.profile_picture ? { uri: `http://${IP_ADDRESS}:4000/api/v1/upload/fetch_image?filename=${driverInformation?.profile_picture}&subdir=/drivers/profile` } : { uri: `http://${IP_ADDRESS}:4000/upload/fetch_image?filename=${driverInformation?.profile_picture}&subdir=/drivers/profile` }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
      </View>
      
      {/* Driver Info */}
      <View style={tw`flex-1`}>
        <Text style={[styles.globalText, tw`font-medium text-base text-gray-800`]}>
          {driverInformation.name || "ไม่ระบุ"}
        </Text>
        
        <View style={tw`flex-row items-center mt-1.5`}>
          <View style={tw`flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-full`}>
            <MaterialIcons name="star" size={16} color="#f59e0b" />
            <Text style={[styles.globalText, tw`text-yellow-600 ml-1 font-medium`]}>
              {driverInformation.rating || "0.0"}
            </Text>
          </View>
          
          <View style={tw`h-1 w-1 bg-gray-300 rounded-full mx-2`} />
          
          <View style={tw`flex-row items-center`}>
            <MaterialIcons name="phone" size={14} color="#6b7280" style={tw`mr-1`} />
            <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>
              {driverInformation.phone || "ไม่ระบุ"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}