import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";

export default function ProfileScreen({ navigation, route }) {
  const { userData = {} } = route.params || {};

  // Logout function with Thai alert
  const handleLogout = () => {
    Alert.alert(
      "ยืนยันการออกจากระบบ",
      "คุณแน่ใจว่าต้องการออกจากระบบหรือไม่?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ยืนยัน",
          onPress: () => {
            // Add your logout functionality here
            navigation.reset({
              index: 0,
              routes: [{ name: "HomeLogin" }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        tw`flex-1 bg-white`,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      {/* Profile Row Container */}
      <View style={tw`flex-row items-center mt-10 p-2 w-19/20 mx-auto`}>
        <Image
          source={{
            uri: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=${userData?.profile_picture}`,
          }}
          style={tw`w-24 h-24 rounded-full border-2 border-green-400`}
        />
        <View style={tw`ml-4`}>
          <Text style={[styles.globalText, tw`text-sm text-gray-400`]}>
            สวัสดี!
          </Text>
          <Text
            style={[
              styles.globalText,
              tw`text-2xl font-bold text-green-600`,
            ]}
          >
            {`${userData?.first_name || "ไม่พบข้อมูล"} ${
              userData?.last_name || ""
            }`}
          </Text>
        </View>
      </View>

      {/* Options Section */}
      <View style={tw`flex-1 w-full bg-white mt-4`}>
        {/* Personal Info Section */}
        <TouchableOpacity
          style={tw`border-b border-gray-200 p-4`}
          onPress={() => navigation.navigate("PersonalInfo", { userData })}
        >
          <Text style={[styles.globalText, tw`text-lg text-gray-600`]}>
            ข้อมูลส่วนตัว
          </Text>
        </TouchableOpacity>
        {/* Edit Info Section */}
        <TouchableOpacity
          style={tw`border-b border-gray-200 p-4`}
          onPress={() => navigation.navigate("EditInfo", { userData })}
        >
          <Text style={[styles.globalText, tw`text-lg text-gray-600`]}>
            แก้ไขข้อมูล
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={tw`p-4`}>
        <TouchableOpacity
          style={tw`w-full py-3 rounded bg-green-500`}
          onPress={handleLogout}
        >
          <Text style={[styles.globalText, tw`text-center text-white font-bold text-base `]}>
            ออกจากระบบ
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles for global font integration
const styles = {
  globalText: {
    fontFamily: "Mitr-Regular",
  },
};
