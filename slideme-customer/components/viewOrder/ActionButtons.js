import React from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import { openURL } from "expo-linking";

export default function ActionButtons({ driverInformation, handleChat, styles }) {
  // Custom shadow styles for buttons
  const buttonShadow = {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  };

  return (
    <View style={[
      tw`px-4 py-3 bg-white border-t border-gray-200`,
      Platform.OS === 'ios' ? tw`pb-6` : {}
    ]}>
      <View style={tw`flex-row justify-between`}>
        {/* Call Button */}
        <TouchableOpacity
          style={[
            tw`flex-1 bg-white py-3 rounded-xl items-center mx-1.5 border border-gray-100`,
            buttonShadow
          ]}
          activeOpacity={0.7}
          onPress={() => {
            if (driverInformation.phone) {
              openURL(`tel:${driverInformation.phone}`);
            } else {
              Alert.alert("ไม่พบเบอร์โทรศัพท์", "ไม่สามารถโทรหาคนขับได้ในขณะนี้");
            }
          }}
        >
          <View style={tw`h-12 w-12 rounded-full bg-green-50 justify-center items-center mb-1.5`}>
            <MaterialIcons name="call" size={24} color="#22c55e" />
          </View>
          <Text style={[styles.globalText, tw`text-sm font-medium text-gray-700`]}>โทร</Text>
        </TouchableOpacity>

        {/* Chat Button */}
        <TouchableOpacity
          style={[
            tw`flex-1 bg-white py-3 rounded-xl items-center mx-1.5 border border-gray-100`,
            buttonShadow
          ]}
          activeOpacity={0.7}
          onPress={handleChat}
        >
          <View style={tw`h-12 w-12 rounded-full bg-blue-50 justify-center items-center mb-1.5`}>
            <MaterialIcons name="chat" size={24} color="#3b82f6" />
          </View>
          <Text style={[styles.globalText, tw`text-sm font-medium text-gray-700`]}>ข้อความ</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[
            tw`flex-1 bg-white py-3 rounded-xl items-center mx-1.5 border border-gray-100`,
            buttonShadow
          ]}
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert(
              "ยืนยันการยกเลิก",
              "คุณต้องการยกเลิกการเดินทางนี้ใช่หรือไม่?",
              [
                { text: "ไม่ใช่", style: "cancel" },
                { 
                  text: "ใช่, ยกเลิก", 
                  style: "destructive",
                  onPress: () => {
                    Alert.alert(
                      "ฟังก์ชั่นนี้ยังไม่พร้อมใช้งาน",
                      "ขณะนี้ไม่สามารถยกเลิกการเดินทางได้",
                      [{ text: "ตกลง" }],
                      { cancelable: false }
                    );
                  }
                }
              ],
              { cancelable: true }
            );
          }}
        >
          <View style={tw`h-12 w-12 rounded-full bg-red-50 justify-center items-center mb-1.5`}>
            <MaterialIcons name="close" size={24} color="#ef4444" />
          </View>
          <Text style={[styles.globalText, tw`text-sm font-medium text-gray-700`]}>ยกเลิก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}