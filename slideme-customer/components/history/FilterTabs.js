// components/history/FilterTabs.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import tw from 'twrnc';
import { PRIMARY_COLOR } from './utils';

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  return (
    <View style={[tw`flex-row bg-white mb-2 px-1`, styles.tabShadow]}>
      <FilterTab 
        label="ทั้งหมด" 
        value="all" 
        activeFilter={activeFilter} 
        onPress={() => onFilterChange("all")} 
      />
      <FilterTab 
        label="กำลังดำเนินการ" 
        value="active" 
        activeFilter={activeFilter} 
        onPress={() => onFilterChange("active")} 
      />
      <FilterTab 
        label="สำเร็จ" 
        value="completed" 
        activeFilter={activeFilter} 
        onPress={() => onFilterChange("completed")} 
      />
      <FilterTab 
        label="ยกเลิก" 
        value="cancelled" 
        activeFilter={activeFilter} 
        onPress={() => onFilterChange("cancelled")} 
      />
    </View>
  );
};

const FilterTab = ({ label, value, activeFilter, onPress }) => {
  const isActive = activeFilter === value;
  
  return (
    <TouchableOpacity 
      style={[
        tw`flex-1 py-3 px-1 items-center justify-center`,
        isActive && tw`border-b-2 border-[${PRIMARY_COLOR}]`
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.customFont, 
          tw`text-xs md:text-sm`, 
          isActive ? tw`text-[${PRIMARY_COLOR}] font-bold` : tw`text-gray-600`
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  tabShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default FilterTabs;