// components/payment/PaymentButton.js
import React from "react";
import { Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";

const PaymentButton = ({ onPress, disabled, loading, amount }) => {
  return (
    <TouchableOpacity
      style={[
        tw`py-4 px-8 rounded-xl items-center justify-center`,
        disabled
          ? tw`bg-gray-300`
          : loading
            ? tw`bg-[#7BC58E]`
            : tw`bg-[#60B876]`,
        Platform.select({
          ios: tw`shadow-xl`,
          android: { elevation: 5, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }
        }),
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={tw`flex-row items-center justify-center`}>
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <FontAwesome5 name="money-bill-wave" size={18} color="white" style={tw`mr-2`} />
            <Text
              style={[
                styles.globalText,
                tw`text-white text-lg font-medium`,
              ]}
            >
              จ่ายเงิน {amount ? `${amount} บาท` : ''}
            </Text>
          </>
        )}
      </View>
      
      {!loading && !disabled && (
        <View style={tw`absolute right-3 top-0 bottom-0 items-center justify-center`}>
          <View style={tw`h-6 w-6 rounded-full bg-white bg-opacity-30 items-center justify-center`}>
            <FontAwesome5 name="arrow-right" size={12} color="white" />
          </View>
        </View>
      )}
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

export default PaymentButton;