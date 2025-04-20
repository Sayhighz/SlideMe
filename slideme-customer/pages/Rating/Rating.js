// pages/Rating/Rating.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import tw from "twrnc";

import { IP_ADDRESS } from "../../config";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { UserContext } from "../../UserContext";

// Import our components
import DriverInfoCard from "../../components/rating/DriverInfoCard";
import RatingSelector from "../../components/rating/RatingSelector";
import ReviewInput from "../../components/rating/ReviewInput";
import ActionButtons from "../../components/rating/ActionButtons";
import ServicePhotos from "../../components/rating/ServicePhotos"; // Import our new component

const Rating = ({ navigation }) => {
  const route = useRoute();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceData, setServiceData] = useState({});
  const [loading, setLoading] = useState(true);
  const requestId = route.params.requestId;
  const { userData } = useContext(UserContext);

  const userId = userData?.customer_id || null;
  const token = userData?.token || null;

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
        return "กรุณาให้คะแนน";
    }
  };

  useEffect(() => {
    // Fetch data from the API
    const fetchServiceInfo = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:4000/api/v1/customer/request/details?request_id=${requestId}`
        );
        const data = await response.json();
        // console.log("Service data:", data.driver_id);
        setServiceData(data);
      } catch (error) {
        console.error("Error fetching service info:", error);
        Alert.alert("Error", "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceInfo();
    
    // Hide tab bar when rating screen is shown
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });
    
    return () => {
      // Restore tab bar when leaving the screen
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined
      });
    };
  }, []);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert("กรุณาให้คะแนน", "โปรดให้คะแนนการให้บริการก่อนส่งรีวิว");
      return;
    }

    setIsSubmitting(true);

    const newReview = {
      request_id: requestId,
      customer_id: userId,
      driver_id: serviceData.driver_id,
      rating: rating,
      review_text: review.trim(),
    };

    try {
      console.log("asd",newReview);
      const response = await fetch(
        `http://${IP_ADDRESS}:4000/api/v1/customer/review/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newReview),
        }
      );

      const result = await response.json();

      if (result.Status) {
        Alert.alert(
          "สำเร็จ",
          "ขอบคุณสำหรับรีวิวของคุณ!",
          [
            {
              text: "ตกลง",
              onPress: () => {
                navigation.navigate("HomePage", { token });
              },
            },
          ],
          { cancelable: false }
        );
        setReview("");
        setRating(0);
      } else {
        Alert.alert("เกิดข้อผิดพลาด", `ไม่สามารถส่งรีวิวได้: ${result.Error}`);
      }
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation.navigate("HomePage");
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <HeaderWithBackButton
          showBackButton={true}
          title=""
          onPress={() => navigation.navigate("HomePage")}
        />
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#60B876" />
          <Text style={[styles.loadingText, tw`mt-4`]}>กำลังโหลดข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <HeaderWithBackButton
        showBackButton={true}
        title=""
        onPress={() => navigation.navigate("HomePage")}
      />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={tw`pb-8`}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`flex-1 px-5 items-center`}>
            <View style={tw`w-full items-center mt-4 mb-2`}>
              <Text style={[styles.headerText, tw`text-2xl text-center`]}>
                ขอบคุณที่ใช้บริการ
              </Text>
              <Text style={[styles.subHeaderText, tw`text-base text-center text-gray-600`]}>
                ให้คะแนนกับคนขับเพื่อให้การบริการดียิ่งขึ้น
              </Text>
            </View>
            
            <DriverInfoCard driverData={serviceData} />
            
            {/* Add the new ServicePhotos component */}
            <ServicePhotos 
              beforePhotos={serviceData.photos_before_service} 
              afterPhotos={serviceData.photos_after_service} 
            />
            
            <RatingSelector 
              rating={rating} 
              setRating={setRating} 
              getRatingText={getRatingText} 
            />
            
            <ReviewInput 
              review={review} 
              setReview={setReview} 
              isSubmitting={isSubmitting}
              autoFocus={false}
            />
            
            <ActionButtons 
              onSubmit={handleSubmitReview} 
              onBack={handleBack} 
              isSubmitting={isSubmitting} 
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "Mitr-Regular",
    fontWeight: "500",
    color: "#333",
  },
  subHeaderText: {
    fontFamily: "Mitr-Regular",
    color: "#666",
  },
  loadingText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: "#666",
  },
});

export default Rating;