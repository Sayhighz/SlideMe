import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { Dropdown } from "react-native-element-dropdown";

const RadioSelector = ({ value, onValueChange, onRefresh, isRefreshing = false }) => {
  const dataDropdown = [
    { label: "1 กม.", value: "1000" },
    { label: "5 กม.", value: "5000" },
    { label: "10 กม.", value: "10000" },
    { label: "20 กม.", value: "20000" },
    { label: "30 กม.", value: "30000" },
  ];

  return (
    <View style={tw`flex-row items-center justify-between w-full`}>
      {/* Refresh button */}
      <TouchableOpacity
        style={[
          tw`flex-row items-center justify-center p-2 px-4 rounded-lg`,
          styles.buttonStyle,
        ]}
        onPress={onRefresh}
        disabled={isRefreshing}
        activeOpacity={0.7}
      >
        {isRefreshing ? (
          <ActivityIndicator size="small" color="#4A5568" style={tw`mr-2`} />
        ) : (
          <MaterialIcons 
            name="refresh" 
            size={18} 
            color="#4A5568" 
            style={tw`mr-2`}
          />
        )}
        <Text style={[styles.globalText, tw`text-gray-700`]}>
          {isRefreshing ? "กำลังรีเฟรช..." : "รีเฟรช"}
        </Text>
      </TouchableOpacity>

      {/* Radius selector */}
      <View style={tw`flex-row items-center`}>
        <Text style={[styles.globalText, tw`mr-2 text-gray-700 font-medium`]}>รัศมี:</Text>
        <Dropdown
          style={[
            tw`h-10 rounded-lg px-3 py-1 justify-center`,
            styles.dropdownStyle,
          ]}
          containerStyle={styles.dropdownContainer}
          itemContainerStyle={styles.dropdownItemContainer}
          itemTextStyle={styles.dropdownItemText}
          activeColor="#EBF8FF"
          data={dataDropdown}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="รัศมีการค้นหา"
          placeholderStyle={[styles.globalText, tw`text-gray-500`]}
          selectedTextStyle={[styles.globalText, tw`text-gray-800`]}
          value={value}
          onChange={(item) => onValueChange(item.value)}
          renderLeftIcon={() => (
            <MaterialIcons 
              name="explore" 
              size={18} 
              color="#3182CE" 
              style={tw`mr-2`} 
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  buttonStyle: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Platform.OS === 'ios' ? 'transparent' : '#EEE',
  },
  dropdownStyle: {
    width: 130,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Platform.OS === 'ios' ? 'transparent' : '#EEE',
  },
  dropdownContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: 'white',
  },
  dropdownItemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: '#4A5568',
  }
});

export default RadioSelector;