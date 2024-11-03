// JobsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

function JobCard({ distance, origin, destination, type, time }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={tw`p-4 mb-4 bg-white rounded-lg shadow`} 
      onPress={() => navigation.navigate('JobDetail', { distance, origin, destination, type })}
    >
      <Text style={tw`text-gray-800 font-bold`}>ระยะทางประมาณ {distance}</Text>
      <View style={tw`flex-row justify-between mt-2 items-center`}>
        <View style={tw`flex-row items-center`}>
          <Icon name="map-marker" size={20} color="gray" />
          <Text style={tw`text-gray-600 ml-1`}>{origin}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Icon name="map-marker" size={20} color="gray" />
          <Text style={tw`text-gray-600 ml-1`}>{destination}</Text>
        </View>
      </View>
      <View style={tw`flex-row justify-between mt-1`}>
        <Text style={tw`text-gray-500`}>ประเภท: {type}</Text>
        <Text style={tw`text-gray-500`}>เวลาถึงโดยประมาณ: {time}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function JobsScreen() {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* แถบสถานะรายได้และปุ่มหยุดรับงาน */}
      <View style={tw`flex-row justify-between items-center p-4 bg-blue-500`}>
        <View style={tw`flex-row mt-10`}>
          <View style={tw`mr-6`}>
            <Text style={tw`text-2xl font-bold text-white`}>฿20</Text>
            <Text style={tw`text-white`}>รายได้วันนี้</Text>
          </View>
          <View>
            <Text style={tw`text-2xl font-bold text-white`}>฿20</Text>
            <Text style={tw`text-white`}>เครดิตรวมงาน</Text>
          </View>
        </View>
        {/* ปุ่มหยุดรับงาน */}
        <TouchableOpacity
          style={tw`bg-red-500 px-4 py-2 rounded-full mt-10`}
          onPress={() => navigation.navigate('HomeMain')} // นำทางไปยังหน้า Home
        >
          <Text style={tw`text-white font-bold`}>หยุดรับงาน</Text>
        </TouchableOpacity>
      </View>

      {/* ข้อมูลงานที่รอรับ */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        <JobCard distance="20 KM" origin="ต้นทาง" destination="ปลายทาง" type="กระบะ" time="13:00น" />
        <JobCard distance="20 KM" origin="ต้นทาง" destination="ปลายทาง" type="กระบะ" time="ตอนนี้" />
      </ScrollView>
    </View>
  );
}
