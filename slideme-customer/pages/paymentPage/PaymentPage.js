import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useContext, useMemo } from "react";
import tw from "twrnc";
import { useRoute } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";
import axios from "axios";
import { UserContext } from "../../UserContext";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { useFocusEffect } from "@react-navigation/native";

// Imported Components
import PaymentTabs from "../../components/payment/PaymentTabs";
import CreditCardList from "../../components/payment/CreditCardList";
import AddPaymentMethodButton from "../../components/payment/AddPaymentMethodButton";
import PromptPayQR from "../../components/payment/PromptPayQR";
import OrderSummary from "../../components/payment/OrderSummary";
import PaymentButton from "../../components/payment/PaymentButton";
import ConfirmationModal from "../../components/payment/ConfirmationModal";

const { width, height } = Dimensions.get("window");
const isSmallScreen = height < 700;

export default function PaymentPage({ navigation }) {
  // Constants
  const FEE_PRICE = 200;

  // State
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [choosePaymentMethod, setChoosePaymentMethod] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Context and Route
  const route = useRoute();
  const { userData } = useContext(UserContext);

  // Extract driver data from route params with default values
  const driverData = useMemo(() => {
    const chooseDriver = route.params?.chooseDriver || {};
    return {
      id: chooseDriver.id || "ไม่ระบุ",
      name: chooseDriver.name || "ไม่ระบุ",
      rating: chooseDriver.rating || "0",
      price: parseFloat(chooseDriver.price) || 0,
      offer_id: chooseDriver.offer_id || "",
      customer_id_request: chooseDriver.customer_id_request || "ไม่ระบุ",
    };
  }, [route.params]);

  // Calculate total price when dependencies change
  useEffect(() => {
    setTotalPrice(parseFloat(driverData.price) + FEE_PRICE - discount);
  }, [driverData.price, discount, paymentMethods]);

  // Fetch payment methods when the page is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchPaymentMethods = async () => {
        if (!userData || !userData.customer_id) {
          console.error("User ID is missing");
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://${IP_ADDRESS}:4000/api/v1/customer/payment/all?customer_id=${userData.customer_id}`,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );

          if (response.data.Status) {
            setPaymentMethods(response.data.Result);
          } else if (
            response.data.Error === "ไม่พบวิธีการชำระเงินสำหรับผู้ใช้รายนี้"
          ) {
            console.log("No payment methods found for this user.");
            setPaymentMethods([]);
          } else {
            console.error(
              "Error fetching payment methods:",
              response.data.Error
            );
          }
        } catch (error) {
          console.error("Error fetching payment methods:", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentMethods();
    }, [userData.customer_id])
  );

  // Handle payment confirmation
  const handlePayment = async () => {
    const { request_id } = route.params;
    const offer_id = driverData.offer_id;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:4000/api/v1/customer/request/accept-offer`,
        {
          request_id: request_id,
          customer_id: userData.customer_id,
          offer_id: offer_id,
          price: totalPrice,
          payment_method_id: choosePaymentMethod.payment_method_id,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      setOpenModal(false);

      if (response.data.Status) {
        console.log(
          "Service request updated successfully:",
          response.data.Message
        );
        navigation.navigate("viewOrder", { driverProfile: route.params });
      } else {
        console.error("Error:", response.data.Message);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle PromptPay payment complete
  const handlePromptPayComplete = () => {
    // Navigate to next screen or show confirmation
    navigation.navigate("viewOrder", { driverProfile: route.params });
  };

  // Render Tab Section
  const renderTabsSection = () => (
    <PaymentTabs activeTab={tabIndex} onTabChange={setTabIndex} />
  );

  console.log("paymentMethods:", paymentMethods.length);

  // Render Content Section (ตามแท็บที่เลือก)
  const renderContentSection = () => (
    <View
      style={[
        tw`my-2`,
        { minHeight: tabIndex === 0 ? height * 0.4 : height * 0.6 },
      ]}
    >
      {tabIndex === 0 ? (
        <>
          <ScrollView style={[tw`flex-1 h-50`, { minHeight: height * 0.35 }]}>
            <CreditCardList
              paymentMethods={paymentMethods}
              selectedMethod={choosePaymentMethod}
              onSelectMethod={setChoosePaymentMethod}
              loading={loading}
              style={[tw`flex-1`]}
            />
          </ScrollView>
          <AddPaymentMethodButton
            onPress={() => navigation.navigate("AddMethod")}
          />
        </>
      ) : (
        <PromptPayQR
          totalPrice={totalPrice}
          phoneNumber="0812345678"
          onPaymentComplete={handlePromptPayComplete}
        />
      )}
    </View>
  );

  // Render Summary Section
  const renderSummarySection = () => (
    <View style={tw`mb-4`}>
      <OrderSummary
        driverName={driverData.name}
        driverRating={driverData.rating}
        driverPrice={driverData.price}
        feePrice={FEE_PRICE}
        discount={discount}
        totalPrice={totalPrice}
      />
    </View>
  );

  // Render spacer for bottom area (to allow scrolling above fixed button)
  const renderSpacerSection = () => <View style={{ height: 90 }} />;

  // Render section item based on section type
  const renderFlatListItem = ({ item }) => {
    switch (item.type) {
      case "tabs":
        return renderTabsSection();
      case "content":
        return renderContentSection();
      case "summary":
        return renderSummarySection();
      case "spacer":
        return renderSpacerSection();
      default:
        return null;
    }
  };

  const getFlatListData = () => {
    return [
      { id: "tabs", type: "tabs" },
      { id: "content", type: "content" },
      { id: "summary", type: "summary" },
      { id: "spacer", type: "spacer" },
    ];
  };

  return (
    <SafeAreaView
      style={[
        tw`flex-1 bg-gray-50`,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      <HeaderWithBackButton
        showBackButton={true}
        title="ชําระเงิน"
        onPress={() => navigation.goBack()}
      />

      <ConfirmationModal
        visible={openModal}
        onCancel={() => setOpenModal(false)}
        onConfirm={handlePayment}
        loading={loading}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <FlatList
          data={getFlatListData()}
          keyExtractor={(item) => item.id}
          renderItem={renderFlatListItem}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={tw`flex-grow px-4 py-2`}
          bounces={true}
          overScrollMode="always"
          removeClippedSubviews={true}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
        />

        {/* Fixed Payment Button at bottom */}
        {tabIndex === 0 && (
          <View
            style={[
              tw`px-4 py-4 items-center border-t border-gray-200 bg-white`,
              styles.fixedBottom,
              Platform.select({
                ios: { paddingBottom: isSmallScreen ? 10 : 20 },
                android: { paddingBottom: 10 },
              }),
            ]}
          >
            <PaymentButton
              disabled={choosePaymentMethod === "" || loading}
              onPress={() => {
                if (choosePaymentMethod !== "") {
                  setOpenModal(true);
                }
              }}
              loading={loading}
              amount={totalPrice}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.select({
      ios: "Mitr-Regular",
      android: "Mitr-Regular",
      default: "System",
    }),
  },
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});
