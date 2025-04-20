// components/payment/OrderSummary.js
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const OrderSummary = ({
  driverName,
  driverRating,
  driverPrice,
  feePrice,
  discount,
  totalPrice,
}) => {
  return (
    <View style={tw`mt-4`}>
      <Text style={[styles.globalText, tw`text-xl mb-3 text-gray-800 font-medium`]}>รายการออเดอร์</Text>
      <View
        style={[
          tw`bg-white p-5 rounded-xl border border-gray-200`,
          Platform.OS === 'ios' 
            ? tw`shadow-lg` 
            : { elevation: 3, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
        ]}
      >
        <View style={tw`mb-4`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={[styles.globalText, tw`text-lg font-medium text-gray-800`]}>{driverName}</Text>
            <View style={tw`flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg`}>
              <MaterialIcons name="star" size={18} color="#F59E0B" />
              <Text style={[styles.globalText, tw`ml-1 text-yellow-700`]}>{driverRating}</Text>
            </View>
          </View>
          
          <View style={tw`h-px bg-gray-200 my-3`} />
          
          <View style={tw`flex-row justify-between my-2`}>
            <Text style={[styles.globalText, tw`text-gray-600`]}>ราคาข้อเสนอ</Text>
            <View style={tw`flex-row`}>
              <Text style={[styles.globalText, tw`text-[#E33F3F]`]}>
                {driverPrice}
              </Text>
              <Text style={[styles.globalText, tw`text-gray-800`]}> บาท</Text>
            </View>
          </View>
          
          <View style={tw`flex-row justify-between my-2`}>
            <Text style={[styles.globalText, tw`text-gray-600`]}>ค่าธรรมเนียม</Text>
            <View style={tw`flex-row`}>
              <Text style={[styles.globalText, tw`text-[#E33F3F]`]}>
                {feePrice}
              </Text>
              <Text style={[styles.globalText, tw`text-gray-800`]}> บาท</Text>
            </View>
          </View>
          
          <View style={tw`flex-row justify-between my-2`}>
            <Text style={[styles.globalText, tw`text-gray-600`]}>ส่วนลด</Text>
            <View style={tw`flex-row`}>
              <Text style={[styles.globalText, tw`text-[#60B876]`]}>
                {discount === 0 ? "0" : discount}
              </Text>
              <Text style={[styles.globalText, tw`text-gray-800`]}> บาท</Text>
            </View>
          </View>
        </View>
        
        <View style={tw`h-px bg-gray-300 my-3`} />
        
        <View style={tw`flex-row justify-between items-center pt-2`}>
          <Text style={[styles.globalText, tw`text-xl font-medium text-gray-800`]}>ยอดรวม</Text>
          <View style={tw`flex-row items-center bg-red-50 px-3 py-1 rounded-lg`}>
            <Text style={[styles.globalText, tw`text-xl text-[#E33F3F] font-medium`]}>
              {totalPrice}
            </Text>
            <Text style={[styles.globalText, tw`text-lg text-[#E33F3F]`]}> บาท</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default OrderSummary;