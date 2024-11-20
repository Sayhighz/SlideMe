// SecondRegister.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons from react-native-vector-icons

const SecondRegister = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [idExpiryDate, setIdExpiryDate] = useState('');
    const [licensePlate, setLicensePlate] = useState(''); // New state for license plate

    const handleNextPress = () => {
        // Add logic to handle next step, e.g., form validation or navigation
        navigation.navigate('ThirdRegister', {
            ...route.params,  // ส่งข้อมูลจาก FirstRegister.js
            name,  // ชื่อ
            lastName,  // นามสกุล
            idNumber,  // เลขบัตรประชาชน
            birthDate,  // วันเกิด
            idExpiryDate,  // วันหมดอายุบัตรประชาชน
            licensePlate,  // ทะเบียนรถ
        });
        
        console.log(`Name: ${name}, ID Number: ${idNumber}, Birth Date: ${birthDate}, ID Expiry Date: ${idExpiryDate}, License Plate: ${licensePlate}`);
    };

    const handleBackPress = () => {
        navigation.navigate('FirstRegister'); // Navigate back to HomeLogin screen
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-4`}>
            <View style={tw`absolute top-4 left-4 z-50 mt-5`}>
                <TouchableOpacity onPress={handleBackPress}>
                    <Icon name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={tw`flex-1 justify-start mx-auto w-10/12 mt-8`}>
                <Text style={tw`text-xl font-bold ml-5 mb-2`}>ขั้นตอนที่ 1 จาก 3</Text>
                <Text style={tw`text-3xl font-bold mb-4`}>สร้างบัญชีของคุณ</Text>
                <Text style={tw`text-lg mb-2`}>ข้อมูลทั่วไป</Text>
                <Text style={tw`text-sm text-red-500`}>*จำเป็น</Text>
                <TextInput
                    placeholder="ชื่อ (ตามบัตรประชาชน)"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    value={name}
                    onChangeText={setName}
                />
                <Text style={tw`text-sm text-red-500`}>*จำเป็น</Text>
                <TextInput
                    placeholder="นามสกุล (ตามบัตรประชาชน)"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    value={lastName}
                    onChangeText={setLastName}
                />
                <Text style={tw`text-sm  text-red-500`}>*จำเป็น</Text>
                <TextInput
                    placeholder="เลขประจำตัวประชาชน"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    keyboardType="numeric"
                    value={idNumber}
                    onChangeText={setIdNumber}
                />
                <Text style={tw`text-sm  text-red-500`}>*จำเป็น</Text>
                <TextInput
                    placeholder="วันเกิด (เช่น 01/01/1990)"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    value={birthDate}
                    onChangeText={setBirthDate}
                />
                <Text style={tw`text-sm  text-red-500`}>*จำเป็น</Text>
                <TextInput
                    placeholder="วันที่บัตรมีผลอายุ (เช่น 01/01/2030)"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    value={idExpiryDate}
                    onChangeText={setIdExpiryDate}
                />
                {/* New Section for Vehicle Information */}
                <Text style={tw`text-lg mb-4`}>เพิ่มข้อมูลยานพาหนะ</Text>
                <Text style={tw`text-sm  text-red-500`}>*จำเป็น</Text>
                <TextInput
                    placeholder="ป้ายทะเบียนรถ"
                    style={tw`border-2 border-gray-300 rounded-lg p-2 mb-4`}
                    value={licensePlate}
                    onChangeText={setLicensePlate}
                />
                <TouchableOpacity
                    style={tw`w-full bg-[#60B876] rounded-full p-4 mt-4`}
                    onPress={handleNextPress}
                >
                    <Text style={tw`text-center text-lg font-bold text-white`}>ถัดไป</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SecondRegister;
