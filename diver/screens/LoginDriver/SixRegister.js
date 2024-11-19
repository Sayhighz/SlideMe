import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import tw from 'twrnc';

const SixRegister = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNextPress = () => {
        if (password && confirmPassword && password === confirmPassword) {
            console.log('Next button pressed');
            // Navigation logic or other actions can go here
        } else {
            alert('กรุณากรอกรหัสผ่านให้ตรงกัน');
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-4`}>
            <View style={tw`flex-1 justify-start mx-auto w-10/12 mt-8`}>
                {/* Header */}
                <Text style={tw`text-2xl font-bold mb-2 text-center`}>ยินดีด้วย !</Text>
                <Text style={tw`text-sm text-center text-gray-600 mb-8`}>บัญชีของคุณได้รับการยืนยันแล้ว</Text>

                {/* Password creation form */}
                <Text style={tw`text-lg font-bold mb-4`}>สร้างรหัสผ่าน</Text>
                <TextInput
                    style={tw`border border-gray-400 p-3 mb-4 rounded-lg`}
                    placeholder="รหัสผ่าน"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={tw`border border-gray-400 p-3 mb-8 rounded-lg`}
                    placeholder="ยืนยันรหัสผ่าน"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                {/* Next button */}
                <TouchableOpacity
                    style={tw`bg-[#60B876] w-full p-4 rounded-lg`}
                    onPress={handleNextPress}
                >
                    <Text style={tw`text-lg font-bold text-center text-white`}>ถัดไป</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SixRegister;
