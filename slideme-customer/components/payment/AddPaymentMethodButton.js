// components/payment/AddPaymentMethodButton.js
import React from "react";
import { Text, TouchableOpacity, StyleSheet, Platform, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const AddPaymentMethodButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={[
        tw`flex-row items-center justify-center px-5 py-4 mb-4 rounded-2xl`,
        tw`bg-white border-2 border-dashed border-gray-200`,
        Platform.select({
          ios: tw`shadow-md`,
          android: { elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }
        }),
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={tw`w-10 h-10 rounded-full bg-[#E8F5EB] items-center justify-center`}>
        <MaterialIcons name="add-circle" size={26} color="#60B876" />
      </View>
      <View style={tw`ml-3`}>
        <Text style={[styles.globalText, tw`text-base text-[#60B876] font-medium`]}>
          เพิ่มวิธีการชำระเงิน
        </Text>
        <Text style={[styles.globalText, tw`text-xs text-gray-400`]}>
          เพิ่มบัตรเครดิต/เดบิตใหม่
        </Text>
      </View>
    </TouchableOpacity>
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

export default AddPaymentMethodButton;