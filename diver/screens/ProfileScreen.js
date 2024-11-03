// screens/ProfileScreen.js
import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import tw from 'twrnc';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
    <View style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-lg font-bold`}>โปรไฟล์</Text>
      <Text style={tw`mt-2`}>ชื่อ: ชื่อผู้ใช้</Text>
      <Text style={tw`mt-2`}>เบอร์ติดต่อ: 080-000-0000</Text>
      <Button title="แก้ไขข้อมูล" onPress={() => { /* โค้ดสำหรับแก้ไขข้อมูล */ }} />
    </View>
    </SafeAreaView>
  );
}
