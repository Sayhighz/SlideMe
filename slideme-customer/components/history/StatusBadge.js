// components/history/StatusBadge.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { getStatusInfo } from './utils';

const StatusBadge = ({ status, size = 'normal' }) => {
  const { icon, color, bgColor, label } = getStatusInfo(status);
  
  if (size === 'small') {
    return (
      <View style={[
        tw`px-2 py-0.5 rounded-full flex-row items-center`,
        { backgroundColor: bgColor }
      ]}>
        <Ionicons name={icon} size={12} color={color} style={tw`mr-1`} />
        <Text style={[
          styles.customFont,
          { color, fontSize: 10, fontWeight: '500' }
        ]}>
          {label}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[
      tw`px-3 py-1 rounded-full flex-row items-center`,
      { backgroundColor: bgColor }
    ]}>
      <Ionicons name={icon} size={14} color={color} style={tw`mr-1`} />
      <Text style={[
        styles.customFont,
        { color, fontSize: 12, fontWeight: '500' }
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  }
});

export default StatusBadge;