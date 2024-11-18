// InfoCustomer.js
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, Modal, ImageBackground,StyleSheet } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IP_ADDRESS } from '../../config';

const InfoCustomer = ({ onLogin }) => {
    const route = useRoute();
    const phoneNumber = route.params?.phoneNumber || '';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [modalVisible, setModalVisible] = useState(true); // Modal is immediately visible

    const handleConfirm = async () => {
        if (!name || !email || !lastname || !username) {
            Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
        } else {
            try {
                const response = await fetch(`http://${IP_ADDRESS}:3000/auth/add_user_info`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone_number: phoneNumber,
                        email: email,
                        username: username,
                        first_name: name,
                        last_name: lastname
                    })
                });
    
                const result = await response.json();
                console.log("Response:", result);
                if (result.Status) {
                    Alert.alert("Success", "User data added successfully!");
                } else {
                    Alert.alert("Error", result.Error);
                }
            } catch (error) {
                console.error("Fetch Error:", error); // Log the error
                Alert.alert("Error", "Failed to add user data");
            }
    
            setModalVisible(false); // Optional: Close modal on confirm
            onLogin();
        }
    };
    
    
    
    const handleSkip = async () => {
        try {
            const response = await fetch(`http://${IP_ADDRESS}:3000/auth/add_user_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                })
            });
    
            const result = await response.json();
            if (result.Status) {
                Alert.alert("Success", "User data added successfully with phone number!");
            } else {
                Alert.alert("Error", result.Error);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to add user data");
        }
    
        setModalVisible(false); // Close modal on skip
        onLogin();
    };
    
    
    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
            {/* Modal Component */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`flex-1 justify-center items-center bg-black/50`}>
                        {/* Background with SlideME logo */}
                        <ImageBackground
                            source={{ uri: 'https://example.com/path-to-your-logo-image.png' }} // Replace with your actual logo path
                            style={tw`flex-1 justify-center items-center w-full h-full`}
                            resizeMode="cover"
                        >
                            <View style={tw`bg-white rounded-lg p-6 w-4/5`}>
                                <Text style={[styles.globalText,tw`text-xl font-bold text-center mb-4`]}>กรอกข้อมูลส่วนตัว</Text>
                                <Text style={[styles.globalText,tw`text-gray-800 font-bold`]}>ชื่อ:<Text style={[styles.globalText,tw`text-gray-600 text-sm ml-2`]}>*ไม่จำเป็น</Text></Text>
                                <TextInput
                                    style={tw`border bg-gray-100 rounded-lg w-full p-2 mb-4`}
                                    placeholder="กรอกชื่อจริง"
                                    value={name}
                                    onChangeText={setName}
                                    required
                                />
                                <Text style={[styles.globalText,tw`text-gray-800 font-bold`]}>นามสกุล:<Text style={[styles.globalText,tw`text-gray-600 text-sm ml-2`]}>*ไม่จำเป็น</Text></Text>
                                <TextInput
                                    style={tw`border rounded-lg bg-gray-100 w-full p-2 mb-4`}
                                    placeholder="กรอกนามสกุล"
                                    value={lastname}
                                    onChangeText={setLastName}
                                />
                                <Text style={[styles.globalText,tw`text-gray-800 font-bold`]}>ชื่อผู้ใช้:<Text style={[styles.globalText,tw`text-gray-600 text-sm ml-2`]}>*ไม่จำเป็น</Text></Text>
                                <TextInput
                                    style={tw`border rounded-lg bg-gray-100 w-full p-2 mb-4`}
                                    placeholder="กรอกชื่อผู้ใช้"
                                    value={username}
                                    onChangeText={setUserName}
                                    keyboardType='default'
                                />
                                <Text style={[styles.globalText,tw`text-gray-800 font-bold`]}>อีเมลล์:<Text style={[styles.globalText,tw`text-gray-600 text-sm ml-2`]}>*ไม่จำเป็น</Text></Text>
                                <TextInput
                                    style={tw`border bg-gray-100 rounded-lg w-full p-2 mb-4`}
                                    placeholder="กรอกอีเมลล์"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                                <Text style={[styles.globalText,tw`text-gray-800 font-bold`]}>เบอร์โทร:</Text>
                                <TextInput
                                    style={tw`border rounded-lg bg-gray-200 w-full p-2 mb-4`}
                                    value={phoneNumber}
                                    editable={false}
                                    keyboardType="phone-pad"
                                />
                                <View style={tw`flex-row justify-around mt-4`}>
                                    <TouchableOpacity
                                        style={tw`bg-gray-400 rounded-lg p-3 w-1/3`}
                                        onPress={handleSkip}
                                    >
                                        <Text style={[styles.globalText,tw`text-center font-bold text-white`]}>ข้าม</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={tw`bg-[#60B876] rounded-lg p-3 w-1/3`}
                                        onPress={handleConfirm}
                                    >
                                        <Text style={[styles.globalText,tw`text-white font-bold text-center`]}>ยืนยัน</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    globalText: {
      fontFamily: 'Mitr-Regular', 
    },
  });

export default InfoCustomer;
