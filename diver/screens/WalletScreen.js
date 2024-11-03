// screens/EarningsScreen.js
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import tw from 'twrnc';

export default function WalletScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
    <View style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-lg font-bold`}>สถิติรายได้</Text>
      <Text style={tw`mt-2`}>รายได้วันนี้: ฿0</Text>
      <Text style={tw`mt-2`}>รายได้รายสัปดาห์: ฿0</Text>
      <Text style={tw`mt-2`}>รายได้รายเดือน: ฿0</Text>
    </View>
  </SafeAreaView>
  );
}
