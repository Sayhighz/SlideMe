import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";

// สร้างฟังก์ชันเพื่อคำนวณขนาดตามอุปกรณ์
const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width >= 768;

const ChatInput = ({ message, setMessage, sendMessage }) => {
  return (
    <View style={[
      tw`flex-row items-center p-3 bg-white border-t border-gray-200`,
      Platform.OS === 'ios' ? tw`pb-6` : {}, // เพิ่ม padding สำหรับ iOS เพื่อให้พ้น home indicator
      styles.shadow
    ]}>
      {/* Input */}
      <TextInput
        style={[
          styles.globalText,
          tw`flex-1 bg-gray-100 px-4 py-3 mx-2 rounded-full border border-gray-200`,
          isSmallDevice ? tw`text-sm py-2` : {},
          isLargeDevice ? tw`text-lg py-4` : {},
          Platform.OS === 'ios' ? styles.iosInput : {}
        ]}
        value={message}
        onChangeText={setMessage}
        placeholder="พิมพ์ข้อความ..."
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={1}
        maxHeight={100}
        editable={true}
      />

      {/* Send Icon */}
      <TouchableOpacity 
        style={[
          tw`p-3 bg-[#60B876] rounded-full`,
          isSmallDevice ? tw`p-2` : {},
          isLargeDevice ? tw`p-4` : {},
          styles.sendButton
        ]} 
        onPress={sendMessage}
        activeOpacity={0.7}
      >
        <Icon 
          name="send" 
          size={isSmallDevice ? 20 : isLargeDevice ? 28 : 24} 
          color="#fff" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.OS === 'ios' ? "Sukhumvit Set" : "Mitr-Regular",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iosInput: {
    paddingTop: 10, // ปรับให้เข้ากับ iOS
  },
  sendButton: {
    ...Platform.select({
      ios: {
        shadowColor: '#60B876',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  }
});

export default ChatInput;