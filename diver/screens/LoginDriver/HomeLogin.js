// HomeLogin.js
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeLogin({ onLogin, navigation }) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleRegisterPress = () => {
        navigation.navigate('FirstRegister'); // Navigate to FirstRegister screen
    };

    const handleLoginPress = () => {
        // Perform any additional validation if needed before calling onLogin
        onLogin(); // Call the onLogin prop to set login state to true
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`flex-1 bg-white p-4`}>
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text style={tw`text-6xl text-[#60B876] font-bold text-center`}>SLIDE</Text>
                    <Text style={tw`text-8xl text-[#60B876] font-bold text-center leading-none z-10`}>ME</Text>
                    <Text style={tw`text-lg font-bold leading-none text-[#60B876]`}>Drivers</Text>
                </View>
                <View style={tw`flex-1 w-11/12 mx-auto mt-6`}>
                    <Text style={tw`text-lg font-bold mb-2`}>เบอร์โทรศัพท์</Text>
                    <TextInput
                        placeholder="เบอร์โทรศัพท์"
                        style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                        keyboardType="phone-pad"
                    />
                    <Text style={tw`text-lg font-bold mb-2`}>รหัสผ่าน</Text>
                    <View style={tw`border-2 border-gray-300 rounded-lg flex-row items-center p-2 mb-4`}>
                        <TextInput
                            placeholder="รหัสผ่าน"
                            style={tw`flex-1`}
                            secureTextEntry={!passwordVisible}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Icon
                                name={passwordVisible ? 'eye-off' : 'eye'}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={tw`text-sm ml-2`}>ลืมรหัสผ่าน</Text>
                    <TouchableOpacity style={tw`w-full bg-[#60B876] rounded-full p-4 mt-4`} onPress={handleLoginPress}>
                        <Text style={tw`text-center text-lg font-bold text-white`}>เข้าสู่ระบบ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`w-full bg-gray-300 rounded-full p-4 mt-2`} onPress={handleRegisterPress}>
                        <Text style={tw`text-center text-lg font-bold text-black`}>ลงทะเบียน</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
