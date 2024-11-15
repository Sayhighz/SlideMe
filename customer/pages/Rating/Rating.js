import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

import tw from 'twrnc';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!review.trim() || rating === 0) {
      Alert.alert('Error', 'Please provide a rating and a review');
      return;
    }

    setIsSubmitting(true);

    const newReview = {
    //   request_id: '12345', // Replace with actual request_id as needed
    //   customer_id: '67890', // Replace with actual customer_id as needed
    //   driver_id: '54321', // Replace with actual driver_id as needed
      rating: rating,
      review_text: review.trim(),
    };

    try {
      const response = await fetch('http://192.168.1.104:3000/auth/add_reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      const result = await response.json();

      if (result.Status) {
        Alert.alert('Success', 'Thank you for your review!');
        // Reset form fields
        setReview('');
        setRating(0);
      } else {
        Alert.alert('Error', `Failed to submit review: ${result.Error}`);
      }
    } catch (error) {
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={tw`flex-1 p-4 items-center`}>
      <Text style={tw`text-2xl mb-2 mt-2 text-center`}>Rate and Review</Text>
      <View style={tw`flex-col bg-white p-4 rounded-lg border border-gray-300 w-11/12 shadow-md w-90 h-25`} />
      <AirbnbRating
        count={5}
        reviews={["Terrible", "Bad", "Meh", "Good", "Very Good"]}
        defaultRating={rating}
        size={30}
        onFinishRating={setRating}
      />
      <TextInput
        style={tw`border border-gray-300 rounded p-2 w-full mb-4 mt-2 h-20`}
        placeholder="Write your review here..."
        value={review}
        onChangeText={setReview}
        editable={!isSubmitting}
        multiline={true}
        textAlignVertical="top"
      />
      <View style={tw`w-full mb-4`}>
        <TouchableOpacity
          onPress={handleSubmitReview}
          disabled={isSubmitting}
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
