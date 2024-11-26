import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IP_ADDRESS } from "../../config";
import ConfirmationDialog from "../../componnets/ConfirmationDialog";

export default function JobDetailScreen({ route, navigation }) {
  // Destructure route parameters
  const { distance, origin, destination, type, message, requestId } =
    route.params;
  const { userData = {} } = route.params || {};

  // State for the offered price
  const [offeredPrice, setOfferedPrice] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle submitting the offer price
  const handleOfferSubmit = async () => {
    if (!offeredPrice) {
      Alert.alert("ข้อผิดพลาด", "โปรดกรอกราคาที่ต้องการ");
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
            driver_id: userData?.driver_id,
            offered_price: parseFloat(offeredPrice.replace(/,/g, "")), // Remove commas before sending
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        navigation.navigate("HomeMain");
      } else {
        Alert.alert("ข้อผิดพลาด", result.message || "เสนอราคาไม่สำเร็จ");
      }
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการเสนอราคา");
      console.error(error);
    }
  };

  // Format number input with commas
  const formatNumberWithCommas = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle price input change and format
  const handlePriceChange = (text) => {
    const formattedText = formatNumberWithCommas(text);
    setOfferedPrice(formattedText);
  };

  // Show confirmation modal
  const confirmOfferSubmit = () => {
    if (!offeredPrice) {
      Alert.alert("ข้อผิดพลาด", "โปรดกรอกราคาที่ต้องการ");
      return;
    }
    setIsModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-gray-100`}
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
          <Text style={[styles.globalText, tw`text-xl font-bold`]}>
            ประมาณ {distance} KM
          </Text>
        </View>

        {/* Job Information Section */}
        <View style={tw`p-4 bg-white mt-4 rounded-lg shadow`}>
          <View style={tw`mb-2`}>
            <Text style={[styles.globalText, tw`text-gray-800`]}>
              <Icon name="map-marker" size={20} color="green" /> {origin}
            </Text>
          </View>
          <View style={tw`mt-4`}>
            <Text style={[styles.globalText, tw`text-gray-800`]}>
              <Icon name="map-marker" size={20} color="red" /> {destination}
            </Text>
          </View>
          <Text style={[styles.globalText, tw`text-gray-800`]}>
            ข้อความลูกค้า: {message || "ไม่มีข้อความ"}
          </Text>
        </View>

        {/* Transportation Type Section */}
        <Text style={[styles.globalText, tw`text-lg font-bold mt-6`]}>
          ประเภทการขนส่ง
        </Text>
        <TextInput
          style={[styles.globalText, tw`border border-gray-300 rounded p-2 mt-2`]}
          value={type}
          editable={false} // Read-only input
        />

        {/* Price Input Section */}
        <Text style={[styles.globalText, tw`text-lg font-bold mt-6`]}>
          กำหนดราคา
        </Text>
        <TextInput
          style={[styles.globalText, tw`border border-gray-300 rounded p-2 mt-2`]}
          placeholder="ราคาที่คุณต้องการ"
          keyboardType="numeric"
          value={offeredPrice}
          onChangeText={handlePriceChange}
        />

        {/* Submit Offer Button */}
        <TouchableOpacity
          style={tw`bg-[#60B876] rounded p-2 mt-6 items-center`}
          onPress={confirmOfferSubmit}
        >
          <Text style={[styles.globalText, tw`text-white font-bold text-lg`]}>
            ยื่นข้อเสนอ
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={isModalVisible}
        title="ยืนยันการเสนอราคา"
        message={`คุณต้องการเสนอราคา ${offeredPrice} ใช่หรือไม่?`}
        onConfirm={() => {
          setIsModalVisible(false);
          handleOfferSubmit();
        }}
        onCancel={() => setIsModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular", // Ensure this font is loaded in your project
  },
});
