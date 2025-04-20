// components/payment/PaymentTabs.js
import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";

const PaymentTabs = ({ activeTab, onTabChange }) => {
  return (
    <View style={tw`flex-row justify-around my-4`}>
      <Pressable
        style={({ pressed }) => [
          tw`w-5/12 rounded-xl items-center py-3.5 justify-center`,
          activeTab === 0
            ? tw`bg-[#60B876]`
            : pressed 
              ? tw`bg-gray-100 border border-gray-300` 
              : tw`bg-white border border-gray-300`,
          Platform.select({
            ios: tw`shadow-md`,
            android: { elevation: 3, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }
          }),
        ]}
        onPress={() => onTabChange(0)}
        android_ripple={{ color: activeTab === 0 ? '#88D49A' : '#f0f0f0', borderless: false }}
      >
        <View style={tw`flex-row items-center`}>
          <FontAwesome5 
            name="credit-card" 
            size={16} 
            color={activeTab === 0 ? "#fff" : "#444"} 
            style={tw`mr-2`}
          />
          <Text
            style={[
              styles.globalText,
              tw`text-center font-medium`,
              activeTab === 0 ? tw`text-white` : tw`text-gray-800`,
            ]}
            numberOfLines={1}
          >
            บัตรเครดิต / เดบิต
          </Text>
        </View>
      </Pressable>
      
      <Pressable
        style={({ pressed }) => [
          tw`w-5/12 rounded-xl items-center py-3.5 justify-center`,
          activeTab === 1
            ? tw`bg-[#60B876]`
            : pressed 
              ? tw`bg-gray-100 border border-gray-300` 
              : tw`bg-white border border-gray-300`,
          Platform.select({
            ios: tw`shadow-md`,
            android: { elevation: 3, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }
          }),
        ]}
        onPress={() => onTabChange(1)}
        android_ripple={{ color: activeTab === 1 ? '#88D49A' : '#f0f0f0', borderless: false }}
      >
        <View style={tw`flex-row items-center`}>
          <FontAwesome5 
            name="qrcode" 
            size={16} 
            color={activeTab === 1 ? "#fff" : "#444"} 
            style={tw`mr-2`}
          />
          <Text
            style={[
              styles.globalText,
              tw`font-medium`,
              activeTab === 1 ? tw`text-white` : tw`text-gray-800`,
            ]}
            numberOfLines={1}
          >
            พร้อมเพย์
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.select({
      ios: "Mitr-Regular",
      android: "Mitr-Regular",
      default: "System"
    }),
  },
});

export default PaymentTabs;