import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";

const SignupPage = ({ onLogin }) => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");

  const skipLogin = () => {
    onLogin();
  };

  const handlePhoneLogin = async () => {
    if (phoneNumber.length === 9) {
      const formattedPhoneNumber = `0${phoneNumber}`;
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:4000/api/v1/customer/auth/check-phone`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone_number: formattedPhoneNumber }),
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
  
        const result = await response.json();
  
        const otp = generateOtp();
        Alert.alert("Your OTP Code", `OTP: ${otp}`);
  
        if (result.Exists) {
          navigation.navigate("PhoneVerify", {
            phoneNumber: formattedPhoneNumber,
            otp,
            isExistingUser: true,
            userDetails: result.User,
          });
        } else {
          navigation.navigate("PhoneVerify", {
            phoneNumber: formattedPhoneNumber,
            otp,
            isExistingUser: false,
            userDetails: null,
          });
        }
      } catch (error) {
        console.error("Error occurred:", error.message);
        Alert.alert("Error", "Failed to check phone number. Please try again.");
      }
    } else {
      Alert.alert("Invalid Input", "Please enter a valid 9-digit phone number.");
    }
  };
  
  

  const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-1 w-full justify-start items-center`}>
        <View style={tw`w-full p-4 items-center h-full`}>
          <Text
            style={[
              styles.globalText,
              tw`text-2xl text-white text-center mb-5`,
            ]}
          >
            ยินดีต้อนรับสู่ SLIDE ME!
          </Text>

          <View
            style={tw`w-full items-center justify-center p-4 border border-gray-300 rounded-lg bg-white`}
          >
            <Text
              style={[
                styles.globalText,
                tw`text-lg text-center mb-2`,
              ]}
            >
              เข้าสู่ระบบด้วย โทรศัพท์
            </Text>
            <View
              style={tw`flex-row items-center w-full h-12 border border-gray-300 rounded-lg px-3`}
            >
              <Text style={[styles.globalText, tw`text-lg`]}>🇹🇭 +66</Text>
              <TextInput
                style={tw`flex-1 ml-2 text-black`}
                keyboardType="phone-pad"
                placeholder="กรอกเบอร์โทรศัพท์ 9 ตัว"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={9}
              />
              {phoneNumber.length > 0 && phoneNumber.length < 9 && (
                <Icon
                  name="times-circle"
                  size={20}
                  color="red"
                  style={tw`ml-2`}
                  onPress={() => setPhoneNumber("")}
                />
              )}
              {phoneNumber.length === 9 && (
                <Icon
                  name="check-circle"
                  size={20}
                  color="green"
                  style={tw`ml-2`}
                />
              )}
            </View>
            <TouchableOpacity
              style={tw`mt-4 w-full bg-green-700 rounded-lg py-2`}
              onPress={handlePhoneLogin}
            >
              <Text
                style={[styles.globalText, tw`text-white text-lg text-center`]}
              >
                รับรหัสยืนยัน
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`h-[2px] w-full bg-black my-5`}></View>

          <View style={tw`w-full flex-1`}>
            <TouchableOpacity
              style={tw`w-full items-center justify-center bg-blue-700 rounded-lg px-5 py-3 mb-5`}
              onPress={skipLogin}
            >
              <View style={tw`flex-row items-center w-full justify-center`}>
                <Icon name="facebook" size={20} color="#fff" />
                <Text
                  style={[
                    styles.globalText,
                    tw`text-white text-lg text-center ml-2`,
                  ]}
                >
                  เข้าสู่ระบบด้วย Facebook
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-row items-center justify-center w-full bg-red-700 rounded-lg py-3 mb-5`}
            >
              <View style={tw`flex-row items-center w-full justify-center`}>
                <Icon name="google" size={20} color="#fff" />
                <Text
                  style={[
                    styles.globalText,
                    tw`text-white text-lg text-center ml-2`,
                  ]}
                >
                  เข้าสู่ระบบด้วย Google
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-row items-center justify-center w-full bg-black rounded-lg py-3 mb-5`}
            >
              <View style={tw`flex-row items-center w-full justify-center`}>
                <Icon name="apple" size={20} color="#fff" />
                <Text
                  style={[
                    styles.globalText,
                    tw`text-white text-lg text-center ml-2`,
                  ]}
                >
                  เข้าสู่ระบบด้วย Apple
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default SignupPage;
