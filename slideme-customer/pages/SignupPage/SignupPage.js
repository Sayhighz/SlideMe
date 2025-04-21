import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";
import { LinearGradient } from "expo-linear-gradient";

const SignupPage = ({ onLogin }) => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
        console.log("Check Phone Result:", result);
  
        const otp = generateOtp();
        Alert.alert("Your OTP Code", `OTP: ${otp}`);
  
        if (result.Exists) {
          navigation.navigate("PhoneVerify", {
            phoneNumber: formattedPhoneNumber,
            otp,
            isExistingUser: true,
            userDetails: result.User,
            token: result.token || null,
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

  const buttonOpacity = phoneNumber.length === 9 ? 1 : 0.6;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#60B876', '#4DA060']}
        style={[
          tw`flex-1 w-full`,
          { borderTopLeftRadius: 30, borderTopRightRadius: 30 }
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tw`flex-1`}
        >
          <ScrollView
            contentContainerStyle={tw`flex-grow`}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View 
              style={[
                tw`flex-1 w-full items-center p-6 pt-10`,
                { opacity: fadeAnimation }
              ]}
            >
              <Text
                style={[
                  styles.globalText,
                  tw`text-2xl text-white text-center mb-8 font-medium`
                ]}
              >
                ยินดีต้อนรับสู่ SLIDE ME!
              </Text>

              <View
                style={tw`w-full items-center justify-center p-5 border border-gray-100 rounded-3xl bg-white shadow-md`}
              >
                <Text
                  style={[
                    styles.globalText,
                    tw`text-lg text-center mb-4 text-gray-700`
                  ]}
                >
                  เข้าสู่ระบบด้วย โทรศัพท์
                </Text>
                <View
                  style={tw`flex-row items-center w-full h-14 border border-gray-200 rounded-xl px-4 bg-gray-50`}
                >
                  <View style={tw`flex-row items-center border-r border-gray-200 pr-2`}>
                    <Text style={[styles.globalText, tw`text-lg text-gray-700`]}>🇹🇭 +66</Text>
                  </View>
                  <TextInput
                    style={[styles.globalText, tw`flex-1 ml-3 text-black text-lg`]}
                    keyboardType="phone-pad"
                    placeholder="กรอกเบอร์โทรศัพท์ 9 ตัว"
                    placeholderTextColor="#999"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    maxLength={9}
                  />
                  {phoneNumber.length > 0 && (
                    <TouchableOpacity onPress={() => setPhoneNumber("")}>
                      <Icon
                        name={phoneNumber.length === 9 ? "check-circle" : "times-circle"}
                        size={22}
                        color={phoneNumber.length === 9 ? "green" : "red"}
                        style={tw`ml-2`}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    tw`mt-4 w-full rounded-xl py-3 shadow-sm`, 
                    { 
                      backgroundColor: phoneNumber.length === 9 ? '#60B876' : '#A8D4B5',
                      opacity: buttonOpacity
                    }
                  ]}
                  onPress={handlePhoneLogin}
                  disabled={phoneNumber.length !== 9}
                >
                  <Text
                    style={[styles.globalText, tw`text-white text-lg text-center font-medium`]}
                  >
                    รับรหัสยืนยัน
                  </Text>
                </TouchableOpacity>
              </View>

              {!keyboardVisible && (
                <>
                  <View style={tw`flex-row items-center w-full my-6`}>
                    <View style={tw`flex-1 h-[1px] bg-white opacity-50`}></View>
                    <Text style={[styles.globalText, tw`mx-4 text-white`]}>หรือ</Text>
                    <View style={tw`flex-1 h-[1px] bg-white opacity-50`}></View>
                  </View>

                  <View style={tw`w-full`}>
                    <TouchableOpacity
                      style={tw`w-full items-center justify-center bg-blue-600 rounded-xl px-5 py-3 mb-4 shadow-sm`}
                      onPress={skipLogin}
                    >
                      <View style={tw`flex-row items-center w-full justify-center`}>
                        <Icon name="facebook" size={20} color="#fff" />
                        <Text
                          style={[
                            styles.globalText,
                            tw`text-white text-lg text-center ml-3`
                          ]}
                        >
                          เข้าสู่ระบบด้วย Facebook
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`flex-row items-center justify-center w-full bg-white rounded-xl py-3 mb-4 shadow-sm`}
                    >
                      <View style={tw`flex-row items-center w-full justify-center`}>
                        <Icon name="google" size={20} color="#DB4437" />
                        <Text
                          style={[
                            styles.globalText,
                            tw`text-gray-800 text-lg text-center ml-3`
                          ]}
                        >
                          เข้าสู่ระบบด้วย Google
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`flex-row items-center justify-center w-full bg-black rounded-xl py-3 shadow-sm`}
                    >
                      <View style={tw`flex-row items-center w-full justify-center`}>
                        <Icon name="apple" size={20} color="#fff" />
                        <Text
                          style={[
                            styles.globalText,
                            tw`text-white text-lg text-center ml-3`
                          ]}
                        >
                          เข้าสู่ระบบด้วย Apple
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <View style={tw`mt-5 w-full items-center`}>
                <Text style={[styles.globalText, tw`text-xs text-white text-center`]}>
                  การเข้าสู่ระบบ คุณยอมรับ 
                  <Text style={tw`font-bold underline`}> ข้อกำหนดและเงื่อนไข</Text>
                  <Text> และ </Text>
                  <Text style={tw`font-bold underline`}>นโยบายความเป็นส่วนตัว</Text>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
    includeFontPadding: false,
  },
});

export default SignupPage;