import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons from react-native-vector-icons





const FourthRegister = ({ navigation}) => {

    const handleBackPress = () => {
        navigation.navigate('ThirdRegister'); // Navigate back to SecondRegister screen
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-4`}>
            <View style={tw`absolute top-6 left-4 z-50`}>
                <TouchableOpacity onPress={handleBackPress}>
                    <Icon name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={tw`flex-1 justify-start mx-auto w-10/12 mt-8`}>
                <Text style={tw`text-xl font-bold mb-2`}>ขั้นตอนที่ 3 จาก 5</Text>
                <Text style={tw`text-2xl font-bold mb-6`}>อัพโหลดไฟล์เอกสาร</Text>

                {/* Buttons for different file uploads */}
                {[
                    'รูปถ่ายบัตรตรวจ',
                    'รูปถ่ายยานพาหนะ',
                    'รูปถ่ายเอกสารรถ (เล่มรถ)',
                    'รูปถ่ายบัตรประชาชน',
                    'รูปใบขับขี่',
                    'รูปสมุดธนาคาร'
                ].map((label, index) => (
                    <TouchableOpacity
                        key={index}
                        style={tw`bg-gray-200 w-full p-4 rounded-lg mb-4`}
                    >
                        <Text style={tw`text-lg font-bold text-center`}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={tw`items-center`}>
                <TouchableOpacity
                    style={tw`bg-[#60B876] w-full p-4 rounded-lg mt-4`}
                    onPress={() => navigation.navigate('FifthRegister')}
                >
                    <Text style={tw`text-lg text-white font-bold text-center`}>ยืนยันการส่งข้อมูล</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FourthRegister;
