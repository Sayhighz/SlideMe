// NotificationRequest.js
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function NotificationRequest() {
  const [modalVisible, setModalVisible] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const navigation = useNavigation(); // ใช้ useNavigation สำหรับการนำทาง

  // ฟังก์ชันเพื่อจำลองการเรียก API เพื่อตรวจสอบ Request ใหม่
  const checkForNewRequest = async () => {
    // ตัวอย่างจำลองข้อมูล request ใหม่
    const newRequest = {
      distance: "20 KM",
      origin: "ต้นทาง",
      destination: "ปลายทาง",
      price: "฿2,000"
    };

    // ตรวจสอบว่ามี request ใหม่หรือไม่
    if (newRequest) {
      setRequestData(newRequest);
      setModalVisible(true);
    }
  };

  useEffect(() => {
    // ตั้ง interval เพื่อตรวจสอบ request ใหม่ทุกๆ 10 วินาที
    const interval = setInterval(() => {
      checkForNewRequest();
    }, 10000000);

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    setRequestData(null); // รีเซ็ตข้อมูลเมื่อปิด modal
  };

  const startJob = () => {
    closeModal();
    // นำทางไปยังหน้าการทำงาน (เช่น JobWorkingScreen)
    navigation.navigate('JobWorking'); // แทนที่ 'JobWorking' ด้วยชื่อของหน้าที่คุณต้องการนำทางไป
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`w-4/5 bg-white p-6 rounded-lg`}>
          <Text style={tw`text-2xl font-bold mb-2`}>ยินดีด้วย!</Text>
          <Text style={tw`text-gray-600 mb-4`}>ลูกค้ารับข้อเสนอของคุณแล้ว</Text>

          {requestData && (
            <View style={tw`p-4 bg-gray-100 rounded-lg mb-4`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Icon name="map-marker" size={20} color="gray" />
                <Text style={tw`ml-2 text-gray-800`}>{requestData.origin}</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Icon name="map-marker" size={20} color="gray" />
                <Text style={tw`ml-2 text-gray-800`}>{requestData.destination}</Text>
              </View>
            </View>
          )}

          <Text style={tw`text-lg font-bold mb-4`}>รายได้ {requestData?.price}</Text>

          {/* ปุ่มเริ่มงาน */}
          <TouchableOpacity
            style={tw`bg-green-500 rounded-full p-4 items-center`}
            onPress={startJob} // เรียกใช้ startJob เมื่อกดปุ่ม
          >
            <Text style={tw`text-white font-bold text-lg`}>เริ่มงาน</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
