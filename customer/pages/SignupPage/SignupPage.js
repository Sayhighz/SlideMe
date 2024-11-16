// File path: /mnt/data/SignupPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback , StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const SignupPage = ({ onLogin }) => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneLogin = () => {
        if (phoneNumber.length === 9) {
            // Convert 9-digit phone number to 10 digits by prepending "0"
            const formattedPhoneNumber = `0${phoneNumber}`;
            const otp = generateOtp();
            Alert.alert("Your OTP Code", `OTP: ${otp}`);
            navigation.navigate('PhoneVerify', { phoneNumber: formattedPhoneNumber, otp });
        } else {
            Alert.alert("Invalid Input", "Please enter a valid 9-digit phone number.");
        }
    };

    const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={tw`flex-1 w-full justify-start items-center`}>
                <View style={tw`w-full p-4 items-center h-full`}>
                    <Text style={[ styles.globalText,tw`text-2xl font-bold text-white text-center mb-5`]}>
                        ยินดีต้อนรับสู่ SLIDE ME!
                    </Text>

                    <View style={tw`w-full items-center justify-center p-4 border-white rounded-lg`}>
                        <Text style={[styles.globalText ,tw`text-white text-lg font-bold text-center mb-2`]}>
                            เข้าสู่ระบบด้วย โทรศัพท์
                        </Text>

                        {/* Phone Number Input with Country Code */}
                        <View style={tw`flex-row items-center w-full h-12 border border-gray-300 rounded-lg px-3 bg-white`}>
                            <Text style={[styles.globalText ,tw`text-lg`]}>🇹🇭 +66</Text>
                            <TextInput
                                style={[styles.globalText,tw`flex-1 ml-2 text-black`]}
                                keyboardType="phone-pad"
                                placeholder="กรอกเบอร์โทรศัพท์ 9 ตัว"
                                placeholderTextColor="#999"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={9} // Limit input to 9 digits
                            />
                            {phoneNumber.length > 0 && phoneNumber.length < 9 && (
                                <Icon
                                    name="times-circle"
                                    size={20}
                                    color="red"
                                    style={tw`ml-2`}
                                    onPress={() => setPhoneNumber('')}
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
                            onPress={handlePhoneLogin} onLogin={onLogin}
                        >
                            <Text style={[styles.globalText ,tw`text-white text-lg font-bold text-center`]}>
                                รับรหัสยืนยัน
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={tw`h-[2px] w-full bg-black my-5`}></View>
            
            <View style={tw`w-full flex-1`}>
                <TouchableOpacity
                    style={tw`w-full items-center justify-center bg-blue-700 rounded-lg px-5 py-3 mb-5`}
                >
                    <View style={tw`flex-row items-center w-full justify-center`}>
                        <Icon name="facebook" size={20} color="#fff" />
                        <Text style={[styles.globalText ,tw`text-white text-lg font-bold text-center ml-2`]}>
                            เข้าสู่ระบบด้วย Facebook
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
      fontFamily: 'Mitr-Regular', // กำหนดฟอนต์ที่คุณต้องการ
      
    },
  });

export default SignupPage;
