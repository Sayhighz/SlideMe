import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, Button, Alert } from 'react-native';
import tw from 'twrnc';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you have react-native-vector-icons installed
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons from react-native-vector-icons

const ThirdRegister = ({ navigation , route}) => {
    const [isTestModalVisible, setTestModalVisible] = useState(false);
    const [isTestCompleted, setTestCompleted] = useState(false);

    const handleTestPress = () => {
        setTestModalVisible(true);
    };

    const handleTestComplete = () => {
        setTestModalVisible(false);
        setTestCompleted(true);
    };

    const handleBackPress = () => {
        navigation.navigate('SecondRegister'); // Navigate back to SecondRegister screen
    };

    const handleNextPress = () => {
        if (isTestCompleted) {
            navigation.navigate('FourthRegister', {
                ...route.params, // ส่งข้อมูลจาก SecondRegister.js
            });
            
            console.log('ทำแบบทดสอบเสร็จแล้ว');
            // navigation logic here
        } else {
            console.log('ทำแบบทดสอบก่อน');
            Alert.alert('แจ้งเตือน', 'กรุณาทำแบบทดสอบให้เสร็จก่อน');
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-4`}>
            <View style={tw`absolute top-6 left-4 z-50`}>
                <TouchableOpacity onPress={handleBackPress}>
                    <Icon name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={tw`flex-1 justify-start mx-auto w-10/12 mt-8`}>
                <Text style={tw`text-xl font-bold mb-2`}>ขั้นตอนที่ 2 จาก 3</Text>
                <Text style={tw`text-2xl font-bold mb-4`}>อบรมและทำแบบทดสอบ</Text>
                <View style={tw`bg-black h-60 w-full rounded-lg mb-10 justify-center items-center`}>
                    <Icon name="videocam-outline" size={40} color="#ffff" />
                </View>

                <TouchableOpacity
                    style={tw`bg-white w-full p-4 rounded-lg border border-gray-300`}
                    onPress={handleTestPress}
                >
                    <View style={tw`flex-row justify-center items-center`}>
                        <Text style={tw`text-lg font-bold text-center text-gray-700`}>ทำแบบทดสอบ</Text>
                        {isTestCompleted && (
                            <MaterialIcons name="check-circle" size={24} color="#60B876" style={tw`ml-2`} />
                        )}
                    </View>
                </TouchableOpacity>

                <Text style={tw`text-sm text-gray-600`}>รายละเอียด และเงื่อนไขในการทำแบบทดสอบฯ</Text>
                <TouchableOpacity
                    style={tw`w-full bg-[#60B876] rounded-full p-4 mt-4`}
                    onPress={handleNextPress}
                >
                    <Text style={tw`text-center text-lg font-bold text-white`}>ถัดไป</Text>
                </TouchableOpacity>

                <Modal
                    visible={isTestModalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                        <View style={tw`bg-white w-10/12 p-6 rounded-lg`}>
                            <Text style={tw`text-lg font-bold mb-4`}>SLIDEME TEST</Text>
                            <Text style={tw`text-base mb-4`}>เนื้อหาของแบบทดสอบ...</Text>

                            <Button title="เสร็จสิ้น" onPress={handleTestComplete} />
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default ThirdRegister;
