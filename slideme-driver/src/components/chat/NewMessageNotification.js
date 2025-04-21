import React from "react";
import { Animated, Text, StyleSheet, Platform, Dimensions, TouchableOpacity } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// สร้างฟังก์ชันเพื่อคำนวณขนาดตามอุปกรณ์
const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width >= 768;

const NewMessageNotification = ({ visible, fadeAnim, onPress }) => {
  if (!visible) return null;

  // คำนวณตำแหน่งที่เหมาะสมตามขนาดหน้าจอ
  const positionStyle = {
    bottom: isSmallDevice ? 70 : isLargeDevice ? 100 : 80,
    alignSelf: 'center',
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim },
        positionStyle
      ]}
    >
      <TouchableOpacity 
        style={[tw`flex-row items-center px-4 py-2 rounded-full`, styles.notificationButton]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Icon name="arrow-down" size={isSmallDevice ? 16 : 18} color="white" style={tw`mr-1`} />
        <Text style={[
          styles.globalText, 
          tw`text-white`,
          isSmallDevice ? styles.smallText : isLargeDevice ? styles.largeText : styles.normalText
        ]}>
          ข้อความใหม่
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  globalText: {
    fontFamily: Platform.OS === 'ios' ? "Sukhumvit Set" : "Mitr-Regular",
  },
  smallText: {
    fontSize: 12,
  },
  normalText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  notificationButton: {
    backgroundColor: '#60B876',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  }
});

export default NewMessageNotification;