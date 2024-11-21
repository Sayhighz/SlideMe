import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IP_ADDRESS } from "../../config";

const { width } = Dimensions.get("window");
const dynamicFontSize = (size) => Math.min(size, (size * width) / 375);

export default function HomeLogin({ route, navigation, onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginPress = () => {
    if (!phoneNumber || !password) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    fetch(`http://${IP_ADDRESS}:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phoneNumber, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status) {
          Alert.alert("สำเร็จ", "เข้าสู่ระบบสำเร็จ");
          if (typeof onLogin === "function") {
            onLogin(data.User);
          }
        } else {
          Alert.alert("ข้อผิดพลาด", data.Error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={tw`flex-1 bg-white p-4`}>
        <ScrollView contentContainerStyle={tw`flex-grow`}>
          <View style={tw`flex-1 justify-center items-center`}>
            <Text
              style={tw.style("font-bold text-center text-4xl", {
                fontSize: dynamicFontSize(48),
                color: "#60B876",
              })}
            >
              SLIDE
            </Text>
            <Text
              style={tw.style(
                "font-bold text-center leading-none text-6xl z-10",
                { fontSize: dynamicFontSize(72), color: "#60B876" }
              )}
            >
              ME
            </Text>
            <Text
              style={tw.style("text-lg font-bold leading-none text-[#60B876]", {
                lineHeight: dynamicFontSize(24),
              })}
            >
              Drive & Earn
            </Text>
          </View>
          <View style={tw.style("flex-1 mx-auto mt-6", { width: "90%" })}>
            <Text style={tw`text-lg font-bold mb-2`}>เบอร์โทรศัพท์</Text>
            <TextInput
              placeholder="เบอร์โทรศัพท์"
              style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  setPhoneNumber(text);
                }
              }}
              maxLength={10}
            />
            <Text style={tw`text-lg font-bold`}>รหัสผ่าน</Text>
            <View
              style={tw`border-2 border-gray-300 rounded-lg flex-row items-center p-2`}
            >
              <TextInput
                placeholder="รหัสผ่าน"
                style={tw`flex-1`}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <Text
              onPress={() => onLogin()}
              style={tw`text-sm`}
            >
              ลืมรหัสผ่าน
            </Text>
            <TouchableOpacity
              style={tw`w-full bg-[#60B876] rounded-full p-4 mt-4`}
              onPress={handleLoginPress}
            >
              <Text style={tw`text-center text-lg font-bold text-white`}>
                เข้าสู่ระบบ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`w-full bg-gray-300 rounded-full p-4 mt-2`}
              onPress={() => navigation.navigate("FirstRegister")}
            >
              <Text style={tw`text-center text-lg font-bold text-black`}>
                ลงทะเบียน
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
