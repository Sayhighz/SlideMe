// InfoCustomer.js
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const InfoCustomer = ({ onLogin }) => {
    const route = useRoute();
    const phoneNumber = route.params?.phoneNumber || '';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUserName] = useState('');

    const handleConfirm = () => {
        if (!name || !email || !lastname || !username) {
            Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
        } else {
            onLogin();
        }
    };
    
    const handleSkip = () => {
        onLogin();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
                <View style={tw`flex-1 justify-center items-center mt-5`}>
                    <View style={tw`p-4 w-full items-center justify-center`}>
                        <Text style={tw`text-6xl text-[#60B876] font-bold text-center`}>SLIDE</Text>
                        <Text style={tw`text-8xl text-[#60B876] font-bold text-center leading-none z-10`}>ME</Text>
                    </View>
                </View>
                <View style={tw`flex-2 border-2 border-[#60B876] pt-3 items-center rounded-10 bg-[#F5F5F5]`}
                >
                    <Text style={tw`text-gray-800 font-bold w-3/4`}>ชื่อ:<Text style={tw`text-gray-600 text-sm ml-2`}></Text> </Text>
                    <TextInput
                        style={tw`border bg-gray-100 rounded-lg w-3/4 p-1 mb-4 text-md pl-2`}
                        placeholder="กรอกชื่อจริง"
                        value={name}
                        onChangeText={setName}
                        required
                    />
                    <Text style={tw`text-gray-800 font-bold w-3/4`}>นามสกุล:<Text style={tw`text-gray-600 text-sm ml-2`}></Text></Text>
                    <TextInput
                        style={tw`border rounded-lg bg-gray-100 w-3/4 p-1 mb-4 text-md pl-2`}
                        placeholder="กรอกนามสกุล"
                        value={lastname}
                        onChangeText={setLastName}
                    />
                    <Text style={tw`text-gray-800 font-bold w-3/4`}>ชื่อผู้ใช้:<Text style={tw`text-gray-600 text-sm ml-2`}></Text></Text>
                    <TextInput
                        style={tw`border rounded-lg bg-gray-100 w-3/4 p-1 mb-4 text-md pl-2`}
                        placeholder="กรอกชื่อผู้ใช้"
                        value={username}
                        onChangeText={setUserName}
                        keyboardType='default'
                    />
                    <Text style={tw`text-gray-800 font-bold w-3/4`}>อีเมลล์:<Text style={tw`text-gray-600 text-sm ml-2`}></Text></Text>
                    <TextInput
                        style={tw`border bg-gray-100 rounded-lg w-3/4 p-1 mb-4 text-md pl-2`}
                        placeholder="กรอกอีเมลล์"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <Text style={tw`text-gray-800 font-bold w-3/4`}>เบอร์โทร:</Text>
                    <TextInput
                        style={tw`border rounded-lg bg-gray-200 w-3/4 p-1 pl-2 mb-5 text-lg`}
                        value={phoneNumber}
                        editable={false}
                        keyboardType="phone-pad"
                    />
                    <View style={tw`flex-row justify-around items-center w-full mt-4`}>
                        <TouchableOpacity
                            style={tw`bg-gray-400 rounded-lg p-4 w-1/3`}
                            onPress={handleSkip}
                        >
                            <Text style={tw`text-center font-bold text-white`}>ข้าม</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`bg-[#60B876] rounded-lg p-4 w-1/3`}
                            onPress={handleConfirm}
                        >
                            <Text style={tw`text-white font-bold text-center`}>ยืนยัน</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default InfoCustomer;
