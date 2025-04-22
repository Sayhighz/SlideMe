import React from "react";
import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

const ActionButtons = ({ styles, navigation }) => {
  const { width } = Dimensions.get("window");
  const buttonSize = width * 0.22; // ลดขนาดปุ่มลงเล็กน้อย
  
  // สร้างสไตล์กรอบบัตรรวม
  const cardStyle = [
    tw`bg-white rounded-3xl shadow-lg border border-gray-100 p-4 w-full`,
    {
      shadowColor: "#60B876",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    }
  ];
  
  // สร้าง gradient สำหรับหัวข้อ
  const headerGradient = ["#73CB89", "#60B876"];
  
  // สไตล์ปุ่ม
  const buttonContainerStyle = [
    tw`rounded-xl overflow-hidden shadow-sm`,
    { width: buttonSize, height: buttonSize }
  ];
  
  // สไตล์ข้อความ
  const textStyle = [styles.globalText, tw`text-white text-xs mt-1 font-medium text-center`];
  
  // ฟังก์ชันสร้างปุ่ม
  const renderButton = (iconName, text, onPress, gradientColors, iconType = "material") => (
    <TouchableOpacity
      style={buttonContainerStyle}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        style={tw`items-center justify-center w-full h-full p-2`}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={tw`bg-white/20 p-2 rounded-full mb-1 items-center justify-center`}>
          {iconType === "material" ? (
            <MaterialIcons name={iconName} size={22} color="white" />
          ) : (
            <FontAwesome5 name={iconName} size={20} color="white" />
          )}
        </View>
        <Text style={textStyle} numberOfLines={1}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={cardStyle}>
      {/* หัวข้อกล่อง */}
      <LinearGradient
        colors={headerGradient}
        style={tw`py-2 px-4 rounded-xl mb-4 self-center`}
      >
        <Text style={[styles.globalText, tw`text-white text-base font-medium`]}>
          บริการเพิ่มเติม
        </Text>
      </LinearGradient>
      
      {/* กลุ่มปุ่ม */}
      <View style={tw`flex-row justify-between w-full`}>
        {/* ปุ่มประวัติการใช้บริการ */}
        {renderButton(
          "history", 
          "ประวัติ", 
          () => navigation.navigate("ประวัติการใช้บริการ"),
          ["#FF9966", "#FF5E62"]
        )}
        
        {/* ปุ่มวิธีการชำระเงิน */}
        {renderButton(
          "credit-card", 
          "ชำระเงิน", 
          () => navigation.navigate("PaymentMethodsStack"),
          ["#5C6BC0", "#3949AB"]
        )}
        
        {/* ปุ่มข้อความ */}
        {renderButton(
          "email", 
          "ข้อความ", 
          () => navigation.navigate("กล่องข้อความ"),
          ["#26C6DA", "#00ACC1"]
        )}
        
        {/* ปุ่มติดต่อเรา */}
        {renderButton(
          "call", 
          "ติดต่อเรา", 
          () => {},
          ["#66BB6A", "#43A047"]
        )}
      </View>
    </View>
  );
};

export default ActionButtons;