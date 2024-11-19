import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you have react-native-vector-icons installed

const FifthRegister = ({ navigation }) => {
    const initialItems = [
        { label: 'กำลังตรวจสอบ\nข้อมูลเพิ่มเติม', isProcessing: true },
        { label: 'กำลังตรวจสอบ\nข้อมูลยานพาหนะ', isProcessing: true },
        { label: 'กำลังตรวจสอบ\nข้อมูลส่วนตัว', isProcessing: true },
        { label: 'อนุมัติ\nการอบรม', isProcessing: false },
        { label: 'อนุมัติ\nรูปใบขับขี่', isProcessing: false }
    ];

    const [items, setItems] = useState(initialItems);
    const [allApproved, setAllApproved] = useState(false);

    useEffect(() => {
        // Set a 10-second delay to change processing status to approved
        const timer = setTimeout(() => {
            const updatedItems = items.map(item => ({
                ...item,
                isProcessing: false
            }));
            setItems(updatedItems);
            setAllApproved(true); // Mark all items as approved after 10 seconds
        }, 5000);

        // Clear the timer if the component unmounts before 10 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={tw`flex-1 bg-white p-4`}>
            <View style={tw`flex-1 justify-start mx-auto w-10/12 mt-8`}>
                {/* Header */}
                <Text style={tw`text-2xl font-bold mb-2 text-center`}>ขอบคุณสำหรับการลงทะเบียน</Text>
                <Text style={tw`text-sm text-center text-gray-600 mb-8`}>ใช้เวลาในการตรวจสอบ 2-5 วันการ รายละเอียดเอกสารฯ</Text>

                {/* List of sections */}
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={tw`bg-gray-200 w-full p-4 rounded-lg mb-4 flex-row justify-between items-center`}
                        disabled
                    >
                        <Text style={tw`text-lg font-bold`}>{item.label}</Text>
                        {item.isProcessing ? (
                            <ActivityIndicator size="small" color="#60B876" />
                        ) : (
                            <MaterialIcons name="check-circle" size={24} color="#60B876" />
                        )}
                    </TouchableOpacity>
                ))}

                {/* Complete Button */}
                {allApproved && (
                    <TouchableOpacity
                        style={tw`bg-[#60B876] w-full p-4 rounded-lg mt-4`}
                        onPress={() => navigation.navigate('SixRegister')}
                    >
                        <Text style={tw`text-lg font-bold text-center text-white`}>เสร็จสิ้น</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default FifthRegister;
