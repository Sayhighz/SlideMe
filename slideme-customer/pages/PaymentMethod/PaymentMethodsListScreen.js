// PaymentMethodsListScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useIsFocused } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import EditPaymentMethodModal from "./EditPaymentMethodModal";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

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

  // Card brand configurations
  const getCardConfig = (type) => {
    const typeConfig = {
      Visa: {
        icon: "cc-visa",
        colors: ['#436D99', '#2D57F2'],
        textColor: "#ffffff"
      },
      Mastercard: {
        icon: "cc-mastercard",
        colors: ['#EB001B', '#F79E1B'],
        textColor: "#ffffff"
      },
      PayPal: {
        icon: "paypal",
        colors: ['#003087', '#009cde'],
        textColor: "#ffffff"
      },
      "Bank Transfer": {
        icon: "university",
        colors: ['#6f42c1', '#8a63d2'],
        textColor: "#ffffff"
      },
      default: {
        icon: "credit-card",
        colors: ['#4a4a4a', '#666666'],
        textColor: "#ffffff"
      }
    };
    
    return typeConfig[type] || typeConfig.default;
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
        // Filter only active payment methods
        const activeMethods = data.Result.filter(method => method.is_active);
        setPaymentMethods(activeMethods);
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
    setEditAccountName(method.cardholder_name);
    setEditAccountNumber(method.card_number);
    setEditPaymentType(method.method_name);
    setEditExpirationDate(method.card_expiry);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMethod(null);
  };

  const handleSave = () => {
    fetchPaymentMethods();
    closeModal();
  };

  // Format card number to show only last 4 digits
  const formatCardNumber = (number) => {
    if (!number) return "••••";
    // Only display last 4 digits
    return "•••• •••• •••• " + number.substring(number.length - 4);
  };

  const renderItem = ({ item }) => {
    const cardConfig = getCardConfig(item.method_name);

    return (
      <TouchableOpacity 
        style={[styles.cardContainer, tw`mb-4`]}
        activeOpacity={0.8}
        onPress={() => openModal(item)}
      >
        <LinearGradient
          colors={cardConfig.colors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardType, { color: cardConfig.textColor }]}>
                {item.method_name}
              </Text>
              <Icon name={cardConfig.icon} size={28} color={cardConfig.textColor} />
            </View>
            
            <Text style={[styles.cardNumber, { color: cardConfig.textColor }]}>
              {formatCardNumber(item.card_number)}
            </Text>
            
            <View style={styles.cardFooter}>
              <View>
                <Text style={[styles.cardLabel, { color: cardConfig.textColor }]}>CARDHOLDER</Text>
                <Text style={[styles.cardValue, { color: cardConfig.textColor }]}>
                  {item.cardholder_name || "N/A"}
                </Text>
              </View>
              
              <View>
                <Text style={[styles.cardLabel, { color: cardConfig.textColor }]}>EXPIRES</Text>
                <Text style={[styles.cardValue, { color: cardConfig.textColor }]}>
                  {item.card_expiry || "MM/YY"}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const EmptyListComponent = () => (
    <View style={tw`flex-1 justify-center items-center py-12`}>
      <Icon name="credit-card" size={60} color="#D1D5DB" />
      <Text style={[styles.customFont, tw`text-gray-400 text-lg mt-4 text-center`]}>
        ไม่พบข้อมูลวิธีการชำระเงิน{"\n"}กรุณาเพิ่มช่องทางการชำระเงิน
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={tw`pb-24`} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <HeaderWithBackButton
          showBackButton={true}
          title="วิธีการชำระเงิน"
          onPress={() => navigation.goBack()}
        />
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#38b2ac" />
          <Text style={[styles.customFont, tw`mt-4 text-gray-600`]}>กำลังโหลดข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <HeaderWithBackButton
          showBackButton={true}
          title="วิธีการชำระเงิน"
          onPress={() => navigation.goBack()}
        />
        <View style={tw`flex-1 justify-center items-center p-5`}>
          <Icon name="exclamation-circle" size={50} color="#EF4444" />
          <Text style={[styles.customFont, tw`text-red-500 text-center mt-4`]}>
            เกิดข้อผิดพลาดในการโหลดข้อมูล
          </Text>
          <Text style={[styles.customFont, tw`text-gray-600 text-center mt-2`]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={tw`mt-6 bg-blue-500 px-5 py-3 rounded-lg`}
            onPress={fetchPaymentMethods}
          >
            <Text style={[styles.customFont, tw`text-white text-center`]}>ลองใหม่อีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <HeaderWithBackButton
        showBackButton={true}
        title="วิธีการชำระเงิน"
        onPress={() => navigation.goBack()}
      />
      
      <View style={tw`flex-1 px-4 bg-gray-100`}>
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.payment_method_id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={EmptyListComponent}
          contentContainerStyle={tw`pt-4 ${paymentMethods.length === 0 ? 'flex-1' : ''}`}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
        
        {/* EditPaymentMethodModal */}
        <EditPaymentMethodModal
          visible={modalVisible}
          onClose={closeModal}
          onSave={handleSave}
          accountName={editAccountName}
          setAccountName={setEditAccountName}
          accountNumber={editAccountNumber}
          setAccountNumber={setEditAccountNumber}
          paymentType={editPaymentType}
          setPaymentType={setEditPaymentType}
          expirationDate={editExpirationDate}
          setExpirationDate={setEditExpirationDate}
          paymentMethodId={selectedMethod ? selectedMethod.payment_method_id : ""}
        />

        {/* Add Button - Fixed at bottom */}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddPaymentMethod", { onRefresh: fetchPaymentMethods })}
        >
          <Icon name="plus" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>เพิ่มช่องทางการชำระเงิน</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  customFont: {
    fontFamily: "Mitr-Regular",
  },
  cardContainer: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  cardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  cardContent: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontFamily: 'Mitr-Medium',
    fontSize: 18,
  },
  cardNumber: {
    fontFamily: 'Mitr-Regular',
    fontSize: 20,
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontFamily: 'Mitr-Light',
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  cardValue: {
    fontFamily: 'Mitr-Regular',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#60B876',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontFamily: 'Mitr-Regular',
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default PaymentMethodsListScreen;