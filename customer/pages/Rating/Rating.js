import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import tw from 'twrnc';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission status

  const handleSubmitReview = () => {
    if (!review.trim() || rating === 0) {
      Alert.alert('Error', 'Please provide a rating and a review');
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    const newReview = {
      id: Date.now().toString(),
      rating,
      text: review.trim(),
    };

    // Simulate sending review to database
    console.log('Submitted Review:', newReview); // Replace this with your database call
    Alert.alert('Success', 'Thank you for your review!');

    // Reset form fields after submission
    setReview('');
    setRating(0);
    setIsSubmitting(false); // Reset submitting state
  };

  return (
    <View style={tw`flex-1 p-4 items-center`}>

      <Text style={tw`text-2xl mb-2 mt-2 text-center`}>Rate and Review</Text>
        <View style={tw`flex-col bg-white p-4 rounded-lg border border-gray-300 w-11/12 shadow-md w-90 h-25`}>

        </View>
      <AirbnbRating
        count={5}
        reviews={["ควรปรับปรุง", "ไม่ดี", "พอใช้", "ดี", "ยอดเยี่ยม"]}
        defaultRating={rating}
        size={30}
        onFinishRating={setRating}
      />
      <TextInput
        style={tw`border border-gray-300 rounded p-2 w-full mb-4 mt-2 h-20`}
        placeholder="Write your review here..."
        value={review}
        onChangeText={setReview}
        editable={!isSubmitting} // Disable input while submitting
        multiline={true}
        textAlignVertical="top"

      />
      <View style={tw`w-full mb-4`}>
        <TouchableOpacity
          onPress={handleSubmitReview}
          disabled={isSubmitting} // Disable button while submitting
          style={tw`bg-${isSubmitting ? 'gray-400' : 'green-600'} text-white rounded-full p-2`}
        >
          <Text style={tw`text-center text-white`}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Rating;
