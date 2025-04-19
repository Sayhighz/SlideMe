import React from "react";
import { View, Text, Pressable, Modal, StyleSheet, Platform } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";

const ConfirmationModal = ({ 
  visible, 
  onCancel, 
  onConfirm, 
  address, 
  isOrigin 
}) => {
  const locationText = isOrigin ? "ต้นทาง" : "ปลายทาง";
  
  return (
    <Modal 
      transparent={true} 
      visible={visible} 
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-60`}>
        <View style={[
          tw`bg-white w-4/5 rounded-2xl p-5 shadow-xl`,
          Platform.OS === 'ios' ? tw`shadow-opacity-25` : {}
        ]}>
          <View style={tw`items-center mb-2`}>
            <View style={tw`bg-blue-100 p-3 rounded-full mb-2`}>
              <MaterialIcons
                name={isOrigin ? "trip-origin" : "place"}
                size={28}
                color="#3B82F6"
              />
            </View>
            <Text style={[styles.globalText, tw`font-bold text-lg text-center`]}>
              ยืนยัน{locationText}
            </Text>
          </View>
          
          <View style={tw`py-4 px-2 border-t border-b border-gray-200`}>
            <Text style={[styles.globalText, tw`text-gray-700`]}>
              สถานที่{locationText}:
            </Text>
            <Text style={[styles.globalText, tw`text-gray-800 mt-1 font-medium`]}>
              {address}
            </Text>
          </View>
          
          <View style={tw`flex-row justify-around mt-4`}>
            <Pressable
              style={({pressed}) => [
                tw`bg-gray-100 py-2.5 px-6 rounded-lg flex-row items-center`,
                pressed ? tw`opacity-70` : {}
              ]}
              onPress={onCancel}
              android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
            >
              <MaterialIcons name="close" size={20} color="#EF4444" style={tw`mr-1`} />
              <Text style={[styles.globalText, tw`text-base font-medium text-gray-700`]}>
                ยกเลิก
              </Text>
            </Pressable>
            
            <Pressable
              style={({pressed}) => [
                tw`bg-blue-500 py-2.5 px-6 rounded-lg flex-row items-center`,
                pressed ? tw`bg-blue-600` : {}
              ]}
              onPress={onConfirm}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
            >
              <MaterialIcons name="check" size={20} color="white" style={tw`mr-1`} />
              <Text style={[styles.globalText, tw`text-base font-medium text-white`]}>
                ยืนยัน
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.OS === 'ios' ? "Mitr-Regular" : "Mitr-Regular",
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
    }),
  },
});

export default ConfirmationModal;