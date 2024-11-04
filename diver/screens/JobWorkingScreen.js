// JobWorkingScreen.js
import React from 'react';
import { View, Text, Image } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function JobWorkingScreen() {
  return (
    <View style={tw`flex-1 bg-white p-4`}>
      {/* ส่วนหัวแสดงปุ่ม "ยกเลิกงาน" และ "แจ้งปัญหา" */}
      <View style={tw`flex-row justify-between my-7`}>
        <Text style={tw`text-lg text-green-600 font-bold`}>ยกเลิกงาน</Text>
        <Text style={tw`text-lg text-green-600 font-bold`}>แจ้งปัญหา</Text>
      </View>

      {/* ข้อมูลลูกค้า */}
      <View style={tw`p-4 bg-gray-100 rounded-lg mb-4`}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-gray-800`}>ชื่อลูกค้าต้นทาง</Text>
          <Text style={tw`text-blue-600`}>ติดต่อ</Text>
        </View>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-gray-800`}>ชื่อลูกค้าปลายทาง</Text>
          <Text style={tw`text-blue-600`}>ติดต่อ</Text>
        </View>
      </View>

      {/* แผนที่ (ใช้ Image จำลองในที่นี้) */}
      <View style={tw`flex bg-gray-300 items-center justify-center mb-4 rounded-lg h-70`}>
        <Text style={tw`text-lg font-bold text-gray-700`}>MAP</Text>
      </View>

      {/* รายละเอียดที่อยู่ */}
      <Text style={tw`text-gray-700 mb-4`}>รายละเอียดที่อยู่...</Text>

      {/* ข้อความแสดงถึงจุดหมาย */}
      <View style={tw`bg-green-500 rounded-full p-4 items-center`}>
        <Text style={tw`text-white font-bold text-lg`}>ยืนยันถึงที่หมาย</Text>
      </View>
    </View>
  );
}
