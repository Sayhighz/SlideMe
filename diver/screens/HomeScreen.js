// screens/HomeScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

import JobsScreen from './Job/JobsScreen';

export default function HomeScreen() {

  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-white items-center p-4`}>
      
      <Image source={{ uri: 'https://example.com/profile.jpg' }} style={tw`w-24 h-24 rounded-full border-4 border-blue-400 mt-8`} />

      <Text style={tw`text-lg mt-4`}>สวัสดี!</Text>
      <Text style={tw`text-2xl font-bold text-green-600`}>คุณคุณาธิป อู่ทอง</Text>

      <View style={tw`flex-row justify-around w-full mt-6 p-4 bg-gray-100 rounded-lg`}>
        <View style={tw`items-center`}>
          <Text style={tw`text-xl font-bold text-green-600`}>฿50.00</Text>
          <Text style={tw`text-gray-600`}>รายได้วันนี้</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-xl font-bold text-yellow-600`}>฿50.00</Text>
          <Text style={tw`text-gray-600`}>ทั้งหมด</Text>
        </View>
      </View>
      <View style={tw`w-full h-60 bg-gray-200 mt-6 rounded-lg items-center justify-center`}>
        <Text style={tw`text-gray-600`}>ข่าวสาร</Text>
        <Text>(SlideBar)</Text>
      </View>

      <TouchableOpacity 
        style={tw`w-11/12 bg-green-500 rounded-full p-4 mt-6 items-center`}
        onPress={() => navigation.navigate('JobsScreen')}
      >
        <Text style={tw`text-white font-bold text-lg`}>พร้อมเริ่มงาน</Text>
      </TouchableOpacity>
    </View>
  );
}
