import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import { useRoute, useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { IP_ADDRESS } from "../../config";

export default function JobWorking_Pickup_Screen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { request_id } = route.params || {};

  const [offer, setOffer] = useState(null); // State for offer details
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  const handleCancelRequest = async (requestId) => {
    try {
      // Confirm before canceling the job
      Alert.alert(
        "ยกเลิกงาน",
        "คุณต้องการยกเลิกงานนี้หรือไม่?",
        [
          { text: "ยกเลิก", style: "cancel" },
          {
            text: "ยืนยัน",
            onPress: async () => {
              // Make the POST request
              const response = await fetch(`http://${IP_ADDRESS}:3000/auth/driver/cancel_request`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ request_id: requestId }),
              });
  
              const data = await response.json();
              if (data.Status) {
                navigation.navigate("HomeMain");
                Alert.alert("สำเร็จ", "งานถูกยกเลิกเรียบร้อยแล้ว");
                // Navigate to HomeMain screen
              } else {
                Alert.alert("ข้อผิดพลาด", data.Error || "ไม่สามารถยกเลิกงานได้");
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการยกเลิกงาน");
      console.error("Cancel Request Error:", error);
    }
  };  

  useEffect(() => {
    // Fetch offer details
    const fetchOfferDetails = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/auth/getRequestDetailForDriver?request_id=${request_id}`
        );
        const data = await response.json();
        if (data && data.Status && data.Result.length > 0) {
          setOffer(data.Result[0]);
        } else {
          setOffer(null); // No data found
        }
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    if (request_id) {
      fetchOfferDetails();
    }
  }, [request_id]);

  // Open Google Maps for navigation
  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  // Handle calling customer
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url);
    } else {
      Alert.alert("หมายเลขโทรศัพท์", "หมายเลขโทรศัพท์ไม่พร้อมใช้งาน");
    }
  };

  // Handle confirmation button
  const handleConfirmation = () => {
    navigation.navigate("CarUploadPickUpConfirmation", { request_id });
  };

  // Render loading indicator
  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={[styles.globalText, tw`text-red-500`]}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* Header Section */}
        <View style={tw`flex-row justify-between my-7`}>
          <TouchableOpacity onPress={() => handleCancelRequest(request_id)}>
            <Text style={[styles.globalText, tw`text-lg text-green-600 font-bold`]}>ยกเลิกงาน</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("แจ้งปัญหา", "กรุณาติดต่อผู้ดูแลระบบสำหรับปัญหานี้")}>
            <Text style={[styles.globalText, tw`text-lg text-green-600 font-bold`]}>แจ้งปัญหา</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Information */}
        {offer ? (
          <View style={tw`p-4 bg-white shadow-md border border-gray-200 rounded-lg mb-4`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={[styles.globalText, tw`text-gray-800`]}>คุณ {offer.customer_name}</Text>
              <TouchableOpacity onPress={() => handleCall(offer.customer_phone)}>
                <Text style={[styles.globalText, tw`text-blue-600`]}>ติดต่อ</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={[styles.globalText, tw`text-center text-gray-500`]}>ไม่พบข้อมูลลูกค้า</Text>
        )}

        {/* Map Section */}
        {offer && offer.pickup_lat && offer.pickup_long && (
          <TouchableOpacity onPress={() => openGoogleMaps(offer.pickup_lat, offer.pickup_long)}>
            <View style={tw`flex bg-gray-300 items-center justify-center mb-4 rounded-lg h-70`}>
              <MapView
                style={{ width: "100%", height: "100%" }}
                initialRegion={{
                  latitude: parseFloat(offer.pickup_lat),
                  longitude: parseFloat(offer.pickup_long),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(offer.pickup_lat),
                    longitude: parseFloat(offer.pickup_long),
                  }}
                  title="จุดรับ"
                  description="ตำแหน่งที่ตั้งของการรับ"
                />
              </MapView>
            </View>
          </TouchableOpacity>
        )}

        {/* Address Details */}
        {offer && (
          <View>
            <Text style={[styles.globalText, tw`text-gray-700`]}>รายละเอียดที่อยู่</Text>
            <Text style={[styles.globalText, tw`text-gray-400 mb-4`]}>
              {offer.location_from || "ไม่มีข้อมูลเพิ่มเติม"}
            </Text>
            <Text style={[styles.globalText, tw`text-gray-700`]}>รายละเอียดเพิ่มเติม</Text>
            <Text style={[styles.globalText, tw`text-gray-400 mb-4`]}>
              {offer.customer_message || ""}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Button */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-4`}>
        <TouchableOpacity
          onPress={handleConfirmation}
          style={tw`bg-green-500 rounded p-2 items-center`}
        >
          <Text style={[styles.globalText, tw`text-white font-bold text-lg`]}>ยืนยันถึงที่หมาย</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular", // Ensure this font is available in your project
  },
});
