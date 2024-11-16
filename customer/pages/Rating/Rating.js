
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity , StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';


import tw from 'twrnc';



const Rating = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "ควรปรับปรุง";
      case 2:
        return "ไม่ค่อยดี";
      case 3:
        return "พอใช้";
      case 4:
        return "ดีมาก";
      case 5:
        return "ยอดเยี่ยม";
      default:
        return "";
    }
  };

  const handleSubmitReview = async () => {
    if (!review.trim() || rating === 0) {
      Alert.alert('Error', 'Please provide a rating and a review')
      
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
    // Simulate sending review to database
    console.log('Submitted Review:', newReview); // Replace this with your database call
    Alert.alert('Success', 'Thank you for your review!', [
        {text: 'OK', onPress: () => navigation.navigate("Home")},
      ] , {cancelable: false});

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
      <Text style={[styles.globalText , tw`text-3xl mb-1 mt-5 text-center`]}>
        {getRatingText(rating)}
      </Text>
      <StarRating
        rating={rating}
        onChange={setRating}
        starSize={40}
        color="#f1c40f" // Optional: Customize color
        emptyColor="#d4d4d4" // Optional: Customize empty star color
        enableHalfStar={false}
        
      />
      <TextInput
        style={[styles.globalText, tw`border border-gray-300 rounded p-2 w-full mb-4 mt-2 h-20`]}
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
          <Text style={[styles.globalText ,tw`text-center text-white text-xl`]}>
            {isSubmitting ? 'Submitting...' : 'ส่งรีวิว'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    globalText: {
      fontFamily: 'Mitr-Regular',
    },
  });

export default Rating;




