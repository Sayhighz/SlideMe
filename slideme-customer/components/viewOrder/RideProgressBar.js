import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";

export default function RideProgressBar({ status, styles }) {
  // Get status text based on current status
  const getStatusText = () => {
    switch (status) {
      case "accepted":
        return "คนขับกำลังเดินทางไปรับคุณ";
      case "delivery_in_progress":
        return "กำลังเดินทางไปยังปลายทาง";
      case "completed":
        return "เดินทางถึงที่หมายแล้ว";
      default:
        return "กำลังรอการยืนยัน";
    }
  };
  
  // Get status icon based on current status
  const getStatusIcon = () => {
    switch (status) {
      case "accepted":
        return "directions-car";
      case "delivery_in_progress":
        return "navigation";
      case "completed":
        return "check-circle";
      default:
        return "hourglass-empty";
    }
  };
  
  // Get status color based on current status
  const getStatusColor = () => {
    switch (status) {
      case "accepted":
        return "#3b82f6"; // blue
      case "delivery_in_progress":
        return "#8b5cf6"; // purple
      case "completed":
        return "#10b981"; // green
      default:
        return "#f59e0b"; // amber
    }
  };

  return (
    <View style={[tw`mx-4 my-4 bg-white p-4 rounded-xl`, styles.shadow]}>
      <View style={tw`flex-row items-center mb-3`}>
        <View style={[tw`h-10 w-10 rounded-full justify-center items-center mr-3`,{ backgroundColor: `${getStatusColor()}20` }]}>
          <MaterialIcons name={getStatusIcon()} size={24} color={getStatusColor()} />
        </View>
        <View>
          <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>สถานะการเดินทาง</Text>
          <Text style={[styles.globalText, tw`text-gray-800 font-medium`]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      <ProgressBar status={status} />
    </View>
  );
}