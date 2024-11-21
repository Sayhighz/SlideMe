// FirstRegister.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';

const FirstRegister = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedVehicleType, setSelectedVehicleType] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const provinces = [
        { label: 'กรุงเทพมหานคร', value: 'bangkok' },
        { label: 'เชียงใหม่', value: 'chiangmai' },
        { label: 'ภูเก็ต', value: 'phuket' },
        { label: 'ชลบุรี', value: 'chonburi' },
        { label: 'นครราชสีมา', value: 'korat' },
    ];

    const vehicleTypes = [
        { label: 'รถสไลด์มาตรฐาน', value: 'standard_slide' },
        { label: 'รถสไลด์ขนาดใหญ่', value: 'heavy_duty_slide' },
        { label: 'รถสไลด์สำหรับรถหรู', value: 'luxury_slide' },
        { label: 'รถสไลด์ฉุกเฉิน', value: 'emergency_slide' },
    ];
    

    const handleRegisterPress = () => {
        // Validate phone number length
        if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
            Alert.alert('ข้อผิดพลาด', 'กรุณากรอกเบอร์โทรศัพท์ที่มีความยาว 10 ตัวเลข');
            return;
        }

        // Validate required fields
        if (!phoneNumber || !selectedProvince || !selectedVehicleType) {
            Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        // Validate terms acceptance
        if (!isTermsAccepted) {
            Alert.alert('ข้อผิดพลาด', 'กรุณายอมรับเงื่อนไขก่อนสมัคร');
            return;
        }

        navigation.navigate('SecondRegister', {
            phoneNumber,  // ส่งเบอร์โทรศัพท์
            selectedProvince, // จังหวัด
            selectedVehicleType, // ประเภทรถ
        });
        console.log(`Phone: ${phoneNumber}, Province: ${selectedProvince}, Vehicle: ${selectedVehicleType}`);
    };

    const handleBackPress = () => {
        navigation.navigate('HomeLogin');
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-4`}>
            <View style={tw`absolute top-6 left-4 z-50`}>
                <TouchableOpacity onPress={handleBackPress}>
                    <Icon name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={tw`flex-1 justify-center items-center mt-3`}>
                <View style={tw`flex-1 justify-center items-center mb-4`}>
                    <Text style={tw`text-6xl text-[#60B876] font-bold text-center`}>SLIDE</Text>
                    <Text style={tw`text-8xl text-[#60B876] font-bold text-center leading-none z-10`}>ME</Text>
                    <Text style={tw`text-3xl font-bold text-center mb-2 text-[#60B876]`}>สมัครเป็นคนขับ</Text>
                    <Text style={tw`text-center text-gray-600 mb-4`}>เข้าร่วมทีมของเราและรับสิทธิพิเศษมากมาย!</Text>
                </View>
            </View>
            <View style={tw`flex-2 w-11/12 mx-auto`}>
                <Text style={tw`text-lg font-bold mb-2`}>เบอร์โทรศัพท์</Text>
                <TextInput
                    placeholder="เบอร์โทรศัพท์"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    maxLength={10} // Ensure maximum length is 10 digits
                />
                <Text style={tw`text-lg font-bold mb-2`}>เลือกจังหวัด</Text>
                <View style={tw`border-2 border-gray-300 rounded-lg h-1/10 mb-2`}>
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
                <View style={tw`border-2 border-gray-300 rounded-lg h-1/10`}>
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
                    style={tw`flex-row items-center mt-4`}
                    onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                >
                    <View
                        style={tw`w-6 h-6 border-2 border-gray-300 rounded mr-2 ${isTermsAccepted ? 'bg-green-500' : 'bg-white'}`}
                    />
                    <Text>ยอมรับเงื่อนไข SLIDEME</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`w-full bg-[#60B876] rounded-full p-4 mt-4`}
                    onPress={handleRegisterPress}
                >
                    <Text style={tw`text-center text-lg font-bold text-white`}>สมัครเป็นคนขับ</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FirstRegister;
