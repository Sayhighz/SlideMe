// PhoneVerify.js
import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import tw from 'twrnc';
import { useRoute, useNavigation } from '@react-navigation/native';

function PhoneVerify({ onLogin }) {
    const route = useRoute();
    const navigation = useNavigation();
    const { phoneNumber, otp: generatedOtp } = route.params; // รับค่า OTP ที่ส่งมา
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]);

    const handleOtpChange = (index, value) => {
        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].current.focus();
        } else if (!value && index > 0) {
            otpRefs.current[index - 1].current.focus();
        }
    };

    const handleLoginClick = () => {
        const enteredOtp = otp.join(''); // รวมค่าจาก otp array เป็น string
        if (enteredOtp === generatedOtp.toString()) { // เปรียบเทียบ OTP ที่กรอกกับ OTP ที่ส่งมา
            onLogin(); // เรียกใช้งานฟังก์ชัน onLogin หาก OTP ถูกต้อง
        } else {
            Alert.alert("OTP ไม่ถูกต้อง", "กรุณาตรวจสอบ OTP อีกครั้ง");
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const isOtpComplete = otp.every((digit) => digit !== ''); // ตรวจสอบว่า OTP ครบทุกหลักแล้วหรือไม่

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`flex-1 bg-white`}>
                <View style={tw`flex-1 justify-center items-center mt-5`}>
                    <View style={tw`p-4 items-center justify-center`}>
                        <Text style={tw`text-6xl text-[#60B876] font-bold text-center`}>SLIDE</Text>
                        <Text style={tw`text-8xl text-[#60B876] font-bold text-center leading-none z-10`}>ME</Text>
                    </View>
                </View>

                <View style={tw`flex-2 items-center p-5`}>
                    <Text style={tw`mb-4 font-bold text-lg`}>กรอกรหัส OTP CODE</Text>
                    <View style={tw`flex-row justify-center mb-4`}>
                        {otp.map((code, index) => (
                            <TextInput
                                key={index}
                                ref={otpRefs.current[index]}
                                style={tw`border-2 rounded-lg w-12 h-12 text-center text-lg mx-2`}
                                maxLength={1}
                                keyboardType="numeric"
                                value={code}
                                onChangeText={(value) => handleOtpChange(index, value)}
                            />
                        ))}
                    </View>
                    <View style={tw`flex-row justify-between w-full px-10`}>
                        <Text style={tw`text-blue-500`} onPress={handleBack}>แก้ไขเบอร์โทร ?</Text>
                        <Text style={tw`text-blue-500`}>ส่งรหัสอีกครั้ง</Text>
                    </View>
                    <TouchableOpacity
                        style={[tw`bg-[#60B876] rounded-lg mt-8 w-3/4 p-3`, !isOtpComplete && tw`bg-gray-400`]}
                        onPress={handleLoginClick}
                        disabled={!isOtpComplete} // /zzzzปิดการใช้งานปุ่มเมื่อ OTP ยังไม่ครบ
                    >
                        <Text style={tw`text-white text-center font-bold`}>ยืนยัน</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default PhoneVerify;
