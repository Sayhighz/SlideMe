import React from "react";
import { Animated, Text, StyleSheet } from "react-native";
import tw from "twrnc";

const NewMessageNotification = ({ visible, fadeAnim }) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        tw`absolute bottom-23 left-33 bg-red-600 px-4 py-2 rounded-full`,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={[styles.globalText, tw`text-white text-sm`]}>ข้อความใหม่!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default NewMessageNotification;