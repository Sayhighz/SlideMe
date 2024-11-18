import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IP_ADDRESS } from "../../config";

export default function JobDetailScreen({ route, navigation }) {
  const { distance, origin, destination, type, message, requestId } =
    route.params;
  const [offeredPrice, setOfferedPrice] = useState("");

  const handleOfferSubmit = async () => {
    if (!offeredPrice) {
      Alert.alert("Error", "Please enter an offer price.");
      return;
    }

    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/offer_price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: requestId,
            driver_id: 2,
            offered_price: parseFloat(offeredPrice.replace(/,/g, "")),
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert("สำเร็จ", "เสนอราคาสําเร็จ");
        navigation.navigate("HomeMain");
      } else {
        Alert.alert("Error", result.message || "เสนอราคาไม่สําเร็จ");
      }
    } catch (error) {
      Alert.alert("Error", "เสนอราคาไม่สําเร็จ");
      console.error(error);
    }
  };

  const formatNumberWithCommas = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (text) => {
    const formattedText = formatNumberWithCommas(text);
    setOfferedPrice(formattedText);
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={tw`p-4`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button and Distance Display */}
        <View style={tw`flex-row items-center my-9`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-2`}
          >
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold`}>ประมาณ {distance}</Text>
        </View>

        {/* Job Information */}
        <View style={tw`p-4 bg-gray-100 mt-4 rounded-lg`}>
          <View style={tw`mb-2`}>
            <Icon name="map-marker" size={20} color="gray" />
            <Text style={tw`text-gray-800`}>{origin}</Text>
          </View>
          <View style={tw`mt-4`}>
            <Icon name="map-marker" size={20} color="gray" />
            <Text style={tw`text-gray-800`}>{destination}</Text>
          </View>
          <Text style={tw`text-gray-800`}>ข้อความลูกค้า: {message}</Text>
        </View>

        {/* Transportation Type */}
        <Text style={tw`text-lg font-bold mt-6`}>ประเภทการขนส่ง</Text>
        <TextInput
          style={tw`border border-gray-300 rounded p-2 mt-2`}
          value={type}
          editable={false}
        />

        {/* Price Input */}
        <Text style={tw`text-lg font-bold mt-6`}>กำหนดราคา</Text>
        <TextInput
          style={tw`border border-gray-300 rounded p-2 mt-2`}
          placeholder="ราคาที่คุณต้องการ"
          keyboardType="numeric"
          value={offeredPrice}
          onChangeText={handlePriceChange}
        />

        {/* Submit Offer Button */}
        <TouchableOpacity
          style={tw`bg-green-500 rounded-full p-4 mt-6 items-center`}
          onPress={handleOfferSubmit}
        >
          <Text style={tw`text-white font-bold text-lg`}>ยื่นข้อเสนอ</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
