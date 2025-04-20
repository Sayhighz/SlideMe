// components/history/RatingStars.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

const RatingStars = ({ rating, showText = true, size = 18 }) => {
  const ratingValue = rating ? parseFloat(rating) : 0;
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= ratingValue ? "star" : "star-outline"}
        size={size}
        color={i <= ratingValue ? "#FFD700" : "#BDC3C7"}
        style={tw`mr-1`}
      />
    );
  }
  
  return (
    <View style={tw`flex-row items-center my-1`}>
      {stars}
      {showText && (
        <Text style={[styles.customFont, tw`ml-1 text-gray-600 text-sm`]}>
          {ratingValue > 0 ? `(${ratingValue}/5)` : "ยังไม่ได้ให้คะแนน"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  }
});

export default RatingStars;