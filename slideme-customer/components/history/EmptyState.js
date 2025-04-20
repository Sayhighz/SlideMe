// components/history/EmptyState.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { PRIMARY_COLOR } from './utils';

const EmptyState = ({ filter, onRefresh }) => {
  return (
    <View style={tw`flex-1 justify-center items-center p-10`}>
      <Ionicons name="document-text-outline" size={70} color="#d1d5db" />
      <Text style={[styles.customFont, tw`text-lg text-gray-500 mt-6 text-center`]}>
        ไม่พบประวัติการใช้บริการ
      </Text>
      <Text style={[styles.customFont, tw`text-sm text-gray-400 mt-3 text-center`]}>
        {filter !== "all" ? "ลองเปลี่ยนตัวกรองประวัติดู" : "เริ่มใช้บริการเพื่อดูประวัติที่นี่"}
      </Text>
      <TouchableOpacity 
        style={[tw`mt-8 bg-[${PRIMARY_COLOR}] px-8 py-3 rounded-full`, styles.buttonShadow]}
        onPress={onRefresh}
      >
        <Text style={[styles.customFont, tw`text-white font-bold`]}>
          รีเฟรช
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default EmptyState;
