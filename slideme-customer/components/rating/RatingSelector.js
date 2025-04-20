// components/rating/RatingSelector.js
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import StarRating from "react-native-star-rating-widget";
import tw from "twrnc";

const RatingSelector = ({ rating, setRating, getRatingText }) => {
  const getRatingColor = (rating) => {
    switch (rating) {
      case 1:
        return "#e74c3c"; // Red for poor
      case 2:
        return "#e67e22"; // Orange for below average
      case 3:
        return "#f1c40f"; // Yellow for average
      case 4:
        return "#2ecc71"; // Light green for good
      case 5:
        return "#27ae60"; // Green for excellent
      default:
        return "#888"; // Default gray
    }
  };

  const getEmoji = (rating) => {
    switch (rating) {
      case 1:
        return "😞";
      case 2:
        return "😐";
      case 3:
        return "🙂";
      case 4:
        return "😊";
      case 5:
        return "😄";
      default:
        return "";
    }
  };

  return (
    <View style={[tw`w-full my-4 p-4 bg-white rounded-lg border border-gray-300`, styles.cardShadow]}>
      <Text style={[styles.label, tw`text-base mb-2 text-center`]}>
        กรุณาให้คะแนนคนขับ
      </Text>
      
      <View style={tw`items-center my-2`}>
        <View style={tw`flex-row justify-center items-center mb-2`}>
          <Text style={[
            styles.ratingText, 
            tw`text-2xl text-center mx-2`,
            { color: getRatingColor(rating) }
          ]}>
            {getEmoji(rating)}
          </Text>
          <Text style={[
            styles.ratingText, 
            tw`text-2xl text-center`,
            { color: getRatingColor(rating) }
          ]}>
            {getRatingText(rating)}
          </Text>
        </View>
        
        <StarRating
          rating={rating}
          onChange={setRating}
          starSize={38}
          color={getRatingColor(rating) || "orange"}
          emptyColor="#d4d4d4"
          enableHalfStar={false}
          style={tw`mb-1`}
          animationConfig={{
            scale: 1.2,
            duration: 200,
          }}
        />
      </View>
      
      <View style={tw`flex-row justify-between px-2 mt-1`}>
        <Text style={styles.ratingHint}>แย่</Text>
        <Text style={styles.ratingHint}>ดีเยี่ยม</Text>
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
    color: "#333",
    fontWeight: "500",
  },
  ratingText: {
    fontFamily: "Mitr-Regular",
    color: "#333",
    height: 40, // Fixed height to prevent layout shift when text changes
    textAlignVertical: "center",
    fontWeight: "500",
  },
  ratingHint: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#888",
  }
});

export default RatingSelector;