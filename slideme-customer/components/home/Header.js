import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Header = ({ userData, styles, navigation }) => {
  // สร้างตัวอักษรตัวแรกของชื่อสำหรับกรณีที่มีชื่อผู้ใช้
  const getInitial = () => {
    if (userData?.first_name) {
      return userData.first_name.charAt(0).toUpperCase();
    }
    return "S"; // Default "S" for SlideMe
  };

  const goToProfile = () => {
    if (navigation) {
      navigation.navigate("โปรไฟล์ผู้ใช้");
    }
  };

  return (
    <View style={tw`w-full flex-row justify-between items-center px-2 mt-4 mb-2`}>
      {/* ส่วนซ้าย - คำทักทาย */}
      <View style={tw`flex-row items-center`}>
        <LinearGradient
          colors={["#73CB89", "#60B876"]}
          style={tw`w-12 h-12 rounded-xl items-center justify-center mr-3 shadow-sm`}
        >
          <Text style={[styles.globalText, tw`text-white text-2xl font-bold`]}>
            {getInitial()}
          </Text>
        </LinearGradient>

        <View>
          <Text
            style={[
              styles.globalText,
              tw`text-gray-500 text-sm mb-0.5`,
            ]}
          >
            สวัสดี,
          </Text>
          <Text
            style={[
              styles.globalText,
              tw`text-xl font-medium text-[#60B876]`,
            ]}
          >
            {userData?.first_name || userData?.phone_number || "คุณ"}!
          </Text>
        </View>
      </View>

      {/* ส่วนขวา - ไอคอนการแจ้งเตือนและปุ่มไปยังโปรไฟล์ */}
      <View style={tw`flex-row items-center`}>
        {/* ปุ่มการแจ้งเตือน */}
        <TouchableOpacity 
          style={tw`bg-gray-100 p-2 rounded-full mr-3 relative`}
          activeOpacity={0.7}
        >
          <MaterialIcons name="notifications" size={24} color="#60B876" />
          {/* แสดงแต้มแจ้งเตือน */}
          <View style={tw`absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center`}>
            <Text style={[styles.globalText, tw`text-white text-xs font-bold`]}>
              3
            </Text>
          </View>
        </TouchableOpacity>

        {/* ปุ่มไปยังโปรไฟล์ */}
        <TouchableOpacity 
          style={tw`bg-gray-100 p-2 rounded-full`}
          activeOpacity={0.7}
          onPress={goToProfile}
        >
          <MaterialIcons name="person" size={24} color="#60B876" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  globalText: {
    fontFamily: "Mitr-Regular",
  },
};

export default Header;