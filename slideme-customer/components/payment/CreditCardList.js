// components/payment/CreditCardList.js
import React from "react";
import { View, Text, Pressable, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";
import { SectionList } from "react-native";

const CreditCardList = ({ paymentMethods, selectedMethod, onSelectMethod, loading, style }) => {
  const getCardIcon = (methodName) => {
    switch (methodName) {
      case "Visa":
        return "cc-visa";
      case "Mastercard":
        return "cc-mastercard";
      case "American Express":
        return "cc-amex";
      case "Discover":
        return "cc-discover";
      default:
        return "credit-card";
    }
  };

  const getCardColor = (methodName) => {
    switch (methodName) {
      case "Visa":
        return "#1A1F71";
      case "Mastercard":
        return "#EB001B";
      case "American Express":
        return "#2E77BB";
      case "Discover":
        return "#FF6600";
      default:
        return "#888888";
    }
  };

  const renderCard = ({ item }) => {
    if (!item.is_active) return null;
    
    const isSelected = selectedMethod && 
      selectedMethod.payment_method_id === item.payment_method_id;

    // Get last 4 digits of card
    const cardNumber = item.card_number;
    const lastFourDigits = cardNumber.slice(-4);
    const maskedNumber = `•••• •••• •••• ${lastFourDigits}`;
    
    const cardIcon = getCardIcon(item.method_name);
    const cardColor = getCardColor(item.method_name);

    return (
      <Pressable
        style={({ pressed }) => [
          tw`flex-row items-center p-4 mb-3 rounded-2xl border`,
          isSelected
            ? tw`bg-[#60B876] border-[#60B876]`
            : pressed 
              ? tw`bg-gray-100 border-gray-300` 
              : tw`bg-white border-gray-200`,
          Platform.select({
            ios: tw`shadow-lg`,
            android: { elevation: 3, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }
          }),
        ]}
        onPress={() => onSelectMethod(item)}
        android_ripple={{ color: isSelected ? '#88D49A' : '#f0f0f0', borderless: false, radius: 120 }}
      >
        <View style={tw`w-14 h-14 items-center justify-center bg-white rounded-xl ${isSelected ? 'bg-opacity-20' : ''}`}>
          <FontAwesome5 
            name={cardIcon} 
            size={30} 
            color={isSelected ? "#fff" : cardColor} 
          />
        </View>

        <View style={tw`flex-1 ml-4`}>
          <Text
            style={[
              styles.globalText,
              tw`text-lg font-medium`,
              isSelected ? tw`text-white` : tw`text-gray-800`,
            ]}
          >
            {item.cardholder_name}
          </Text>
          <Text
            style={[
              styles.globalText,
              tw`text-sm mt-1`,
              isSelected ? tw`text-gray-100` : tw`text-gray-500`,
            ]}
            numberOfLines={1}
          >
            {maskedNumber}
          </Text>
        </View>
        
        <View style={tw`ml-2 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
          <FontAwesome5 name="check-circle" size={22} color="#fff" />
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[tw`items-center justify-center py-8`, style]}>
        <ActivityIndicator size="large" color="#60B876" />
        <Text style={[styles.globalText, tw`mt-4 text-gray-500`]}>
          กำลังโหลดข้อมูล...
        </Text>
      </View>
    );
  }

  // สร้างข้อมูลสำหรับ SectionList
  const sectionData = paymentMethods.length > 0 
    ? [{ title: "บัตรของฉัน", data: paymentMethods.filter(item => item.is_active) }]
    : [{ title: "ไม่พบบัตร", data: [] }];

  const EmptyComponent = () => (
    <View style={tw`items-center justify-center py-8 px-4`}>
      <View style={tw`w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4`}>
        <FontAwesome5 name="credit-card" size={32} color="#ccc" />
      </View>
      <Text style={[styles.globalText, tw`text-lg text-gray-800 mb-2 text-center font-medium`]}>
        ไม่พบวิธีการชำระเงิน
      </Text>
      <Text style={[styles.globalText, tw`text-gray-500 text-center`]}>
        โปรดเพิ่มวิธีการชำระเงินเพื่อดำเนินการต่อ
      </Text>
    </View>
  );

  return (
    <SectionList
      style={[tw`flex-1`, style]}
      sections={sectionData}
      keyExtractor={(item) => item.payment_method_id.toString()}
      renderItem={renderCard}
      renderSectionHeader={() => null} // ไม่แสดงหัวข้อ section
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`pb-2 ${paymentMethods.length === 0 ? 'flex-grow' : ''}`}
      ListEmptyComponent={EmptyComponent}
      removeClippedSubviews={true}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      windowSize={7}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.select({
      ios: "Mitr-Regular",
      android: "Mitr-Regular",
      default: "System"
    }),
  },
});

export default CreditCardList;