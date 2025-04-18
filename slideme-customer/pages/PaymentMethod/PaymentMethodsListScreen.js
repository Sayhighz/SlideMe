import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome5";
import EditPaymentMethodModal from "./EditPaymentMethodModal";
import { useIsFocused } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import SubmitButton from "../../components/SubmitButton";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

const PaymentMethodsListScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editAccountName, setEditAccountName] = useState("");
  const [editAccountNumber, setEditAccountNumber] = useState("");
  const [editPaymentType, setEditPaymentType] = useState("");
  const [editExpirationDate, setEditExpirationDate] = useState("");

  const { userData } = useContext(UserContext);

  const isFocused = useIsFocused();

  const translatePaymentType = (type) => {
    const typeMap = {
      // credit_card: "บัตรเครดิต",
      // debit_card: "บัตรเดบิต",
      // paypal: "PayPal",
      // bank_transfer: "บัญชีธนาคาร",
      // other: "อื่นๆ",

      Visa: "Visa",
      Mastercard: "Mastercard",
    };
    return typeMap[type] || type;
  };

  const getPaymentIcon = (type) => {
    const iconMap = {
      // credit_card: { icon: "credit-card", color: "#007bff" },
      // debit_card: { icon: "credit-card", color: "#28a745" },
      // paypal: { icon: "paypal", color: "#003087" },
      // bank_transfer: { icon: "university", color: "#6f42c1" },
      // other: { icon: "question-circle", color: "#ffc107" },
      Visa: { icon: "cc-visa", color: "#005EB8" },
      Mastercard: { icon: "cc-mastercard", color: "#EB001B" },
    };
    return iconMap[type] || { icon: "question-circle", color: "#6c757d" };
  };

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:4000/api/v1/customer/payment/all?customer_id=${userData.customer_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch payment methods");
      }
      const data = await response.json();
      if (data.Status) {
        setPaymentMethods(data.Result);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPaymentMethods();
    }
  }, [isFocused]);

  const openModal = (method) => {
    setSelectedMethod(method);
    setEditAccountName(method.account_name);
    setEditAccountNumber(method.card_number);
    setEditPaymentType(method.payment_type);
    setEditExpirationDate(method.expiration_date);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMethod(null);
  };

  const handleSave = () => {
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) =>
        method === selectedMethod
          ? {
              ...method,
              account_name: editAccountName,
              card_number: editAccountNumber,
              payment_type: editPaymentType,
              expiration_date: editExpirationDate,
            }
          : method
      )
    );
    closeModal();
    fetchPaymentMethods();
  };

  const renderItem = ({ item }) => {
    const { icon, color } = getPaymentIcon(item.method_name);

    if(!item.is_active) return null; 

    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        <View
          style={tw`p-4 bg-white mb-2 rounded shadow flex-row items-center`}
        >
          <View
            style={[
              tw`items-center justify-center mr-4`,
              {
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: `${color}20`, // Light shade of the icon color
              },
            ]}
          >
            <Icon name={icon} size={20} color={color} />
          </View>
          <View>
            <Text style={[tw`text-lg`, styles.customFont]}>
              {translatePaymentType(item.method_name)}
            </Text>
            <Text style={[tw`text-sm`, styles.customFont]}>
              {item.cardholder_name}
            </Text>
            <Text style={[tw`text-sm`, styles.customFont]}>
              บัญชี: {item.card_number ? `${item.card_number}` : "ไม่พบข้อมูล"}
            </Text>
            {item.card_expiry && (
              <Text style={[tw`text-sm`, styles.customFont]}>
                วันหมดอายุ: {item.card_expiry}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <>
      <HeaderWithBackButton
        showBackButton={true}
        title="วิธีการชําระเงิน"
        onPress={() => navigation.goBack()}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={tw`flex-9 px-5 mb-10 bg-gray-100 flex-col justify-between`}>
          {/* FlatList for Payment Methods */}
          <FlatList
            data={paymentMethods}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            style={{ flexGrow: 1 }} // Ensures FlatList takes all available space
          />

          {/* EditPaymentMethodModal */}
          <EditPaymentMethodModal
            visible={modalVisible}
            onClose={closeModal}
            paymentMethod={selectedMethod}
            onSave={handleSave}
            accountName={editAccountName}
            setAccountName={setEditAccountName}
            accountNumber={editAccountNumber}
            setAccountNumber={setEditAccountNumber}
            paymentType={editPaymentType}
            setPaymentType={setEditPaymentType}
            expirationDate={editExpirationDate}
            setExpirationDate={setEditExpirationDate}
            paymentMethodId={
              selectedMethod ? selectedMethod.payment_method_id : ""
            }
          />

          {/* Submit Button */}
        </View>
        <View style={tw`flex-1`}>
          <SubmitButton
            onPress={() => navigation.navigate("AddPaymentMethod")}
            title="เพิ่มช่องทางการชําระเงิน"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: "Mitr-Regular",
  },
});

export default PaymentMethodsListScreen;
