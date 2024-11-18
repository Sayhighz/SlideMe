// FirstRegister.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Importing react-native-picker-select
import tw from 'twrnc';

const FirstRegister = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedVehicleType, setSelectedVehicleType] = useState('');

    const provinces = [
        { label: 'กรุงเทพมหานคร', value: 'bangkok' },
        { label: 'เชียงใหม่', value: 'chiangmai' },
        { label: 'ภูเก็ต', value: 'phuket' },
        { label: 'ชลบุรี', value: 'chonburi' },
        { label: 'นครราชสีมา', value: 'korat' },
        // Add more provinces as needed
    ];

    const vehicleTypes = [
        { label: 'รถยนต์', value: 'car' },
        { label: 'รถจักรยานยนต์', value: 'motorcycle' },
        { label: 'รถบรรทุก', value: 'truck' },
        { label: 'รถกระบะ', value: 'pickup' }
        // Add more vehicle types as needed
    ];

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-4`}>
            <View style={tw`flex-1 justify-center items-center mb-4`}>
                <View style={tw`bg-gray-300 w-11/12 h-40 justify-center items-center mb-6`}>
                    <Text style={tw`text-2xl`}>โฆษณา</Text>
                </View>
            </View>
            <View style={tw`flex-1 w-11/12 mx-auto`}>
                <Text style={tw`text-lg font-bold mb-2`}>เบอร์โทรศัพท์</Text>
                <TextInput
                    placeholder="เบอร์โทรศัพท์"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <Text style={tw`text-lg font-bold mb-2`}>เลือกจังหวัด</Text>
                <View style={tw`border-2 border-gray-300 rounded-lg h-1/8 mb-2`}>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedProvince(value)}
                    items={provinces}
                    placeholder={{ label: 'กรุณาเลือกจังหวัด', value: null }}
                    style={{
                        inputIOS: { padding: 12, borderWidth: 1, borderColor: 'gray', borderRadius: 4, marginBottom: 16 },
                        inputAndroid: { padding: 12, borderWidth: 1, borderColor: 'gray', borderRadius: 4, marginBottom: 16 },
                    }}
                />
                </View>

                <Text style={tw`text-lg font-bold mb-2`}>เลือกประเภทรถ</Text>
                <View style={tw`border-2 border-gray-300 rounded-lg h-1/8`}>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedVehicleType(value)}
                    items={vehicleTypes}
                    placeholder={{ label: 'กรุณาเลือกประเภทรถ', value: null }}
                    style={{
                        inputIOS: { padding: 12, borderWidth: 1, borderColor: 'gray', borderRadius: 4 },
                        inputAndroid: { padding: 12, borderWidth: 1, borderColor: 'gray', borderRadius: 4 },
                    }}
                />
                </View>
                <TouchableOpacity
                    style={tw`w-full bg-[#60B876] rounded-full p-4 mt-4`}
                    onPress={() => console.log(`Phone: ${phoneNumber}, Province: ${selectedProvince}, Vehicle: ${selectedVehicleType}`)}
                >
                    <Text style={tw`text-center text-lg font-bold text-white`}>สมัครเป็นคนขับ</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FirstRegister;
