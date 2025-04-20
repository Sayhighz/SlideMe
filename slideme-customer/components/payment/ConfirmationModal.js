// components/payment/ConfirmationModal.js
import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform, ActivityIndicator } from "react-native";
import tw from "twrnc";

const ConfirmationModal = ({ visible, onCancel, onConfirm, loading }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={[
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          tw`flex-1 justify-center items-center px-6`,
        ]}
      >
        <View 
          style={[
            tw`bg-white rounded-xl p-5 w-full max-w-sm`,
            Platform.OS === 'ios' 
              ? tw`shadow-xl` 
              : { elevation: 24, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
          ]}
        >
          <View style={tw`items-center py-4`}>
            <Text style={[styles.globalText, tw`text-xl text-center font-medium text-gray-800`]}>
              ยืนยันการชำระเงิน
            </Text>
            <Text style={[styles.globalText, tw`text-center mt-2 text-gray-600`]}>
              คุณยืนยันการชำระเงินครั้งนี้ใช่หรือไม่
            </Text>
          </View>
          
          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity
              style={[
                tw`flex-1 py-3 rounded-lg mr-2`,
                tw`border border-gray-300 bg-white`,
                Platform.OS === 'ios' ? tw`shadow-sm` : { elevation: 1 },
              ]}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={[styles.globalText, tw`text-center text-gray-800 font-medium`]}>
                ยกเลิก
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                tw`flex-1 py-3 rounded-lg ml-2 bg-[#60B876]`,
                Platform.OS === 'ios' ? tw`shadow-sm` : { elevation: 2 },
                loading && tw`opacity-70`,
              ]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={[styles.globalText, tw`text-center text-white font-medium`]}>
                  ยืนยัน
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default ConfirmationModal;