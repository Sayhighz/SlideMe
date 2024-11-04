// screens/JobDetailScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function JobDetailScreen({ route, navigation }) {
  const { distance, origin, destination, type } = route.params;

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      {/* ปุ่มย้อนกลับและข้อความระยะทางในบรรทัดเดียวกัน */}
      <View style={tw`flex-row items-center my-9`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-2`}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>ประมาณ {distance}</Text>
      </View>

      {/* ข้อมูลงาน */}
      <View style={tw`p-4 bg-gray-100 mt-4 rounded-lg`}>
        <View style={tw`mb-2`}>
          <Icon name="map-marker" size={20} color="gray" />
          <Text style={tw`text-gray-800`}>{origin}</Text>
          <Text style={tw`text-gray-500`}>รายละเอียดที่อยู่...</Text>
        </View>
        <View style={tw`mt-4`}>
          <Icon name="map-marker" size={20} color="gray" />
          <Text style={tw`text-gray-800`}>{destination}</Text>
          <Text style={tw`text-gray-500`}>รายละเอียดที่อยู่...</Text>
        </View>
      </View>

      {/* ประเภท */}
      <Text style={tw`text-lg font-bold mt-6`}>ประเภทการขนส่ง</Text>
      <TextInput style={tw`border border-gray-300 rounded p-2 mt-2`} value={type} editable={false} />

      {/* กำหนดราคา */}
      <Text style={tw`text-lg font-bold mt-6`}>กำหนดราคา</Text>
      <TextInput 
        style={tw`border border-gray-300 rounded p-2 mt-2`}
        placeholder="ราคาที่คุณต้องการ"
        keyboardType="numeric"
      />

      {/* ปุ่มยื่นข้อเสนอ */}
      <TouchableOpacity style={tw`bg-green-500 rounded-full p-4 mt-6 items-center`}>
        <Text style={tw`text-white font-bold text-lg`}>ยื่นข้อเสนอ</Text>
      </TouchableOpacity>
    </View>
  );
}
