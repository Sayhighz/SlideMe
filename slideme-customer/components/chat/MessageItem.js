import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import tw from "twrnc";

// สร้างฟังก์ชันเพื่อคำนวณขนาดตามอุปกรณ์
const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width >= 768;

const MessageItem = ({ message, isCurrentUser, timestamp }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View
      style={[
        tw`m-2 rounded-xl px-4 py-3`,
        isSmallDevice ? tw`max-w-4/5 px-3 py-2` : {},
        isLargeDevice ? tw`max-w-2/3 px-5 py-4` : tw`max-w-3/4`,
        isCurrentUser
          ? tw`bg-[#60B876] self-end`
          : tw`bg-white self-start border border-gray-200`,
        styles.messageBubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}
    >
      <Text
        style={[
          styles.globalText,
          isSmallDevice ? tw`text-xs` : isLargeDevice ? tw`text-base` : tw`text-sm`,
          isCurrentUser ? tw`text-white` : tw`text-gray-700`,
        ]}
      >
        {message}
      </Text>
      
      {timestamp && (
        <Text
          style={[
            tw`text-right mt-1`,
            isSmallDevice ? tw`text-xs` : {},
            isCurrentUser ? tw`text-white opacity-70` : tw`text-gray-500`,
            styles.timeText
          ]}
        >
          {formatTime(timestamp)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.OS === 'ios' ? "Sukhumvit Set" : "Mitr-Regular",
  },
  timeText: {
    fontFamily: Platform.OS === 'ios' ? "Sukhumvit Set" : "Mitr-Light",
    fontSize: 10,
  },
  messageBubble: {
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
  },
  currentUserBubble: {
    ...Platform.select({
      ios: {
        shadowColor: '#50A070',
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  otherUserBubble: {
    ...Platform.select({
      ios: {
        shadowColor: '#888',
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 1,
      },
    }),
  }
});

export default MessageItem;