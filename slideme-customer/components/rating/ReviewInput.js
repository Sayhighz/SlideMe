// components/rating/ReviewInput.js
import React, { useRef, useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, Platform, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const ReviewInput = ({ review, setReview, isSubmitting, autoFocus = false }) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const animatedBorderColor = new Animated.Value(0);
  
  // Animation for border color when focused
  useEffect(() => {
    Animated.timing(animatedBorderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);
  
  const borderColor = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e5e7eb', '#60B876']
  });

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small delay for Android to make sure the keyboard shows properly
      const timeout = setTimeout(() => {
        inputRef.current.focus();
      }, Platform.OS === 'android' ? 100 : 0);
      
      return () => clearTimeout(timeout);
    }
  }, [autoFocus]);

  return (
    <View style={[tw`w-full my-3 bg-white p-4 rounded-lg border border-gray-300`, styles.cardShadow]}>
      <View style={tw`flex-row items-center mb-2`}>
        <MaterialIcons name="rate-review" size={20} color="#60B876" style={tw`mr-2`} />
        <Text style={styles.label}>แสดงความคิดเห็น</Text>
      </View>
      
      <Animated.View style={{ borderColor, borderWidth: 1, borderRadius: 12, overflow: 'hidden' }}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            tw`p-3 w-full h-28 bg-gray-50`,
          ]}
          placeholder="แสดงความคิดเห็นหรือคำแนะนำให้คนขับ..."
          placeholderTextColor="#999"
          value={review}
          onChangeText={setReview}
          editable={!isSubmitting}
          multiline={true}
          textAlignVertical="top"
          blurOnSubmit={true}
          maxLength={200}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Animated.View>
      
      <View style={tw`flex-row justify-between items-center mt-2`}>
        <Text style={styles.hintText}>
          แบ่งปันประสบการณ์ของคุณ
        </Text>
        <Text style={[
          styles.charCounter,
          review.length > 180 ? {color: '#e74c3c'} : null
        ]}>
          {review.length}/200
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontFamily: "Mitr-Regular",
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: "#333",
  },
  charCounter: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  hintText: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
});

export default ReviewInput;