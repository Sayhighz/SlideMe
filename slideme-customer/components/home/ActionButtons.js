import React from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

const ActionButtons = ({ styles, handleOrderStatus, openModal }) => {
  const { width } = Dimensions.get("window");
  const buttonWidth = width * 0.29;
  
  const IconStyle = { size: 38 };
  const TextStyle = [styles.globalText, tw`text-white text-sm mt-2 font-medium`];

  const renderButton = (iconName, text, onPress) => (
    <TouchableOpacity
      style={[
        { width: buttonWidth, height: buttonWidth },
        tw`rounded-2xl shadow-md overflow-hidden`,
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#60B876", "#55A76B", "#4A9660"]}
        style={tw`items-center justify-center w-full h-full p-2`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={tw`bg-white/20 p-2 rounded-full mb-1`}>
          <MaterialIcons name={iconName} size={IconStyle.size} color="white" />
        </View>
        <Text style={TextStyle}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-row justify-between w-full`}>
      {/* ปุ่มติดตามสถานะ */}
      {renderButton("track-changes", "ติดตามสถานะ", handleOrderStatus)}

      {/* ปุ่มติดต่อเรา */}
      {renderButton("call", "ติดต่อเรา", null)}

      {/* ปุ่มเปิดรายการบันทึก */}
      {renderButton("list", "รายการโปรด", openModal)}
    </View>
  );
};

export default ActionButtons;