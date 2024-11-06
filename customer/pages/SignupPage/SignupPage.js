// SignupPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const SignupPage = ({ onLogin }) => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    // const [otp, setOtp] = useState('');

    // const handlePhoneLogin = () => {
    //     if (phoneNumber.length === 10) {
    //         const generatedOtp = generateOtp();
    //         setOtp(generatedOtp);
    //         Alert.alert("Your OTP Code", `OTP: ${generatedOtp}`);
    //         navigation.navigate('PhoneVerify', { phoneNumber, otp: generatedOtp, onResendOtp: handleResendOtp });
    //     } else {
    //         Alert.alert("Invalid Input", "Please enter a valid phone number.");
    //     }
    // };

    const handlePhoneLogin = () => {
        if (phoneNumber.length === 10) {
            const otp = generateOtp();
            Alert.alert("Your OTP Code", `OTP: ${otp}`);
            navigation.navigate('PhoneVerify', { phoneNumber, otp });
        } else {
            Alert.alert("Invalid Input", "Please enter a valid phone number.");
        }
    };

    const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

    // const handleResendOtp = () => {
    //     const newOtp = generateOtp();
    //     setOtp(newOtp);
    //     Alert.alert("Your New OTP Code", `OTP: ${newOtp}`);
    //     navigation.navigate('PhoneVerify', { phoneNumber, otp: newOtp });
    // };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={tw`flex-1 w-full justify-start items-center`}>
                <View style={tw`w-full p-4 items-center h-full`}>
                    <Text style={tw`text-2xl font-bold text-white text-center mb-5`}>
                        ยินดีต้อนรับสู่ SLIDE ME!
                    </Text>

                    <View style={tw`w-full items-center justify-center p-4 border-white rounded-lg shadow-lg`}>
                        <Text style={tw`text-white text-lg font-bold text-center mb-2`}>
                            เข้าสู่ระบบด้วย โทรศัพท์
                        </Text>

                        {/* Phone Number Input with Country Code */}
                        <View style={tw`flex-row items-center w-full h-12 border border-gray-300 rounded-lg px-3 bg-white`}>
                            <Text style={tw`text-lg`}>🇹🇭 +66</Text>
                            <TextInput
                                style={tw`flex-1 ml-2 text-black shadow-lg`}
                                keyboardType="phone-pad"
                                placeholder="Enter your phone number"
                                placeholderTextColor="#999"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={10} // Limit input to 10 digits
                            />
                            {/* Show the cross icon if phoneNumber length is less than 10 */}
                            {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                                <Icon
                                    name="times-circle"
                                    size={20}
                                    color="red"
                                    style={tw`ml-2`}
                                    onPress={() => setPhoneNumber('')}
                                />
                            )}
                            {/* Show the check icon if phoneNumber length is exactly 10 */}
                            {phoneNumber.length === 10 && (
                                <Icon
                                    name="check-circle"
                                    size={20}
                                    color="green"
                                    style={tw`ml-2`}
                                />
                            )}
                        </View>

                        <TouchableOpacity
                            style={tw`mt-4 w-full bg-green-700 shadow rounded-lg py-2`}
                            onPress={handlePhoneLogin} onLogin={onLogin}
                        >
                            <Text style={tw`text-white text-lg font-bold text-center`}>
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
                                <Text style={tw`text-white text-lg font-bold text-center ml-2`}>
                                    เข้าสู่ระบบด้วย Facebook
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`flex-row items-center justify-center w-full bg-red-700 rounded-lg py-3 mb-5`}
                            onPress={() => Alert.alert("Login with Google")}
                        >
                            <View style={tw`flex-row items-center w-full justify-center`}>
                                <Icon name="google" size={20} color="#fff" style={tw`mr-2`} />
                                <Text style={tw`text-white text-lg font-bold text-center`}>
                                    เข้าสู่ระบบด้วย Google
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`flex-row items-center justify-center w-full bg-black rounded-lg py-3 mb-5`}
                            onPress={() => Alert.alert("Login with Apple")}
                        >
                            <View style={tw`flex-row items-center w-full justify-center`}>
                                <Icon name="apple" size={20} color="#fff" style={tw`mr-2`} />
                                <Text style={tw`text-white text-lg font-bold text-center`}>
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

export default SignupPage;
