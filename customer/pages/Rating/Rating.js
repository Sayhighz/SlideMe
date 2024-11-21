
import React, { useState , useEffect} from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity , StyleSheet , ActivityIndicator } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { IP_ADDRESS } from "../../config";


import tw from 'twrnc';



const Rating = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const requestId = '60'; // Replace with dynamic request ID if needed.

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


  

  // useEffect(() => {
  //   // Fetch data from the API
  //   const fetchServiceInfo = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://${IP_ADDRESS}:3000/auth/customer/getServiceInfo?request_id=${requestId}`
  //       );
  //       const data = await response.json();
  //       setServiceData(data[0]); // Assuming data is an array with one object
  //     } catch (error) {
  //       console.error('Error fetching service info:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchServiceInfo();
  // }, []);

  // if (loading) {
  //   return (
  //     <View style={tw`flex-1 justify-center items-center`}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  // const {
  //   first_name,
  //   last_name,
  //   average_rating,
  //   price,
  //   location_from,
  //   location_to,
  // } = serviceData;

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
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/add_reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });
    // Simulate sending review to database
    console.log('Submitted Review:', newReview); // Replace this with your database call
    // Alert.alert('Success', 'Thank you for your review!', [
    //     {text: 'OK', onPress: () => navigation.navigate("HomePage")},
    //   ] , {cancelable: false});

      const result = await response.json();

      if (result.Status) {
        Alert.alert('Success', 'Thank you for your review!'
        , [
          {text: 'OK', onPress: () => navigation.navigate("HomePage")},
        ] , {cancelable: false});
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
      <View style={tw`flex-col bg-white p-4 rounded-lg border border-gray-300 w-11/12 shadow-md w-90 h-25`} >
      <Text style={styles.title}>{`Driver: ${first_name} ${last_name}`}</Text>
      <Text style={styles.detail}>{`Average Rating: ${average_rating?.toFixed(
        1
      ) || 'N/A'}`}</Text>
      <Text style={styles.detail}>{`Price Offer: $${price}`}</Text>
      <Text style={styles.detail}>{`From: ${location_from}`}</Text>
      <Text style={styles.detail}>{`To: ${location_to}`}</Text>
      </View>
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




