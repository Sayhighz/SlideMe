import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import { useNavigation } from "@react-navigation/native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const AddPaymentMethod = ({ route }) => {
  const { onRefresh } = route.params || {};
  const { userData } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [methodName, setMethodName] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const navigation = useNavigation();

  // Enhanced payment options with icons
  const paymentOptions = [
    { label: "Visa", value: "Visa", icon: "cc-visa", color: "#1a1f71" },
    { label: "Mastercard", value: "Mastercard", icon: "cc-mastercard", color: "#eb001b" },
    { label: "PayPal", value: "PayPal", icon: "paypal", color: "#003087" },
    { label: "Bank Transfer", value: "Bank Transfer", icon: "university", color: "#6f42c1" },
  ];

  // Keyboard listeners
  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

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

  // Format credit card number with spaces
  const formatCardNumber = (input) => {
    // Remove non-digits
    const cleaned = input.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    return formatted;
  };

  // Handle card number input with formatting
  const handleCardNumberChange = (input) => {
    const formatted = formatCardNumber(input);
    setCardNumber(formatted);
  };
  
  // Handle expiration date input with formatting (MM/YY)
  const handleExpirationDateChange = (input) => {
    let formattedInput = input.replace(/\D/g, "");
    if (formattedInput.length > 2) {
      formattedInput = `${formattedInput.slice(0, 2)}/${formattedInput.slice(2, 4)}`;
    }
    setCardExpiry(formattedInput);
  };

  // Validate card inputs
  const validateInputs = () => {
    if (!methodName) {
      Alert.alert("กรุณาระบุข้อมูล", "โปรดเลือกประเภทบัตร");
      return false;
    }
    
    if (!cardholderName || cardholderName.trim().length < 3) {
      Alert.alert("กรุณาระบุข้อมูล", "โปรดระบุชื่อผู้ถือบัตรให้ถูกต้อง");
      return false;
    }
    
    // Check card number (should have 16 digits without spaces)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      Alert.alert("กรุณาระบุข้อมูล", "หมายเลขบัตรต้องมี 16 หลัก");
      return false;
    }
    
    // Check expiry date format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      Alert.alert("กรุณาระบุข้อมูล", "โปรดระบุวันหมดอายุในรูปแบบ MM/YY");
      return false;
    }
    
    // Check CVV (should be 3 digits)
    if (cardCvv.length !== 3 || !/^\d{3}$/.test(cardCvv)) {
      Alert.alert("กรุณาระบุข้อมูล", "รหัส CVV ต้องมี 3 หลัก");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    const payload = {
      customer_id: userData.customer_id,
      method_name: methodName,
      card_number: cleanCardNumber,
      card_expiry: cardExpiry,
      card_cvv: cardCvv,
      cardholder_name: cardholderName,
    };

    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:4000/api/v1/customer/payment/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Alert.alert(
          "สำเร็จ", 
          "บันทึกช่องทางการชำระเงินสำเร็จ",
          [{ text: "ตกลง", onPress: () => {
            if (onRefresh) onRefresh();
            navigation.goBack();
          }}]
        );
      } else {
        const errorData = await response.json();
        Alert.alert(
          "ข้อผิดพลาด",
          errorData.Error || "บันทึกช่องทางการชำระเงินไม่สำเร็จ"
        );
      }
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setMethodName(item.value);
        setModalVisible(false);
      }}
      style={styles.paymentOptionItem}
    >
      <Icon name={item.icon} size={24} color={item.color} style={{ marginRight: 12 }} />
      <Text style={styles.paymentOptionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  // Get card preview elements based on input status
  const cardConfig = getCardConfig(methodName);
  const displayCardNumber = cardNumber 
    ? cardNumber 
    : "•••• •••• •••• ••••";
  const displayExpiry = cardExpiry 
    ? cardExpiry 
    : "MM/YY";
  const displayName = cardholderName 
    ? cardholderName 
    : "YOUR NAME";

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <HeaderWithBackButton
        showBackButton={true}
        title="เพิ่มช่องทางการชำระเงิน"
        onPress={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card Preview */}
          {!keyboardVisible && (
            <View style={styles.cardPreviewContainer}>
              <LinearGradient
                colors={cardConfig.colors}
                style={styles.cardPreview}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardPreviewContent}>
                  <View style={styles.cardPreviewHeader}>
                    <Text style={[styles.cardPreviewType, { color: cardConfig.textColor }]}>
                      {methodName || "CARD TYPE"}
                    </Text>
                    <Icon name={cardConfig.icon} size={28} color={cardConfig.textColor} />
                  </View>
                  
                  <Text style={[styles.cardPreviewNumber, { color: cardConfig.textColor }]}>
                    {displayCardNumber}
                  </Text>
                  
                  <View style={styles.cardPreviewFooter}>
                    <View>
                      <Text style={[styles.cardPreviewLabel, { color: cardConfig.textColor }]}>CARDHOLDER</Text>
                      <Text style={[styles.cardPreviewValue, { color: cardConfig.textColor }]}>
                        {displayName}
                      </Text>
                    </View>
                    
                    <View>
                      <Text style={[styles.cardPreviewLabel, { color: cardConfig.textColor }]}>EXPIRES</Text>
                      <Text style={[styles.cardPreviewValue, { color: cardConfig.textColor }]}>
                        {displayExpiry}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Card Type Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ประเภทบัตร <Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.pickerContent}>
                  {methodName ? (
                    <View style={styles.selectedOption}>
                      <Icon 
                        name={paymentOptions.find(opt => opt.value === methodName)?.icon || 'credit-card'} 
                        size={20} 
                        color={paymentOptions.find(opt => opt.value === methodName)?.color || '#666'} 
                        style={{ marginRight: 10 }}
                      />
                      <Text style={styles.pickerText}>
                        {paymentOptions.find(opt => opt.value === methodName)?.label || ''}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>เลือกประเภทบัตร</Text>
                  )}
                </View>
                <Icon name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Card Holder Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ชื่อผู้ถือบัตร <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="ระบุชื่อผู้ถือบัตร"
                placeholderTextColor="#9CA3AF"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
                //length={20}
                maxLength={21}
              />
            </View>

            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>หมายเลขบัตร <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="xxxx xxxx xxxx xxxx"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={19}  // 16 digits + 3 spaces
                value={cardNumber}
                onChangeText={handleCardNumberChange}
              />
            </View>

            {/* Card Details Row - Expiry & CVV */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>วันหมดอายุ <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM/YY"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={5}
                  value={cardExpiry}
                  onChangeText={handleExpirationDateChange}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="xxx"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={3}
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Icon name="check" size={16} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>บันทึกข้อมูล</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for selecting payment type */}
      <Modal 
        visible={modalVisible} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เลือกประเภทบัตร</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={paymentOptions}
              renderItem={renderPaymentOption}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.modalList}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  cardPreviewContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  cardPreview: {
    width: '100%',
    borderRadius: 16,
    height: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardPreviewContent: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPreviewType: {
    fontFamily: 'Mitr-Medium',
    fontSize: 18,
  },
  cardPreviewNumber: {
    fontFamily: 'Mitr-Regular',
    fontSize: 20,
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewLabel: {
    fontFamily: 'Mitr-Light',
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  cardPreviewValue: {
    fontFamily: 'Mitr-Regular',
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Mitr-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#EF4444',
  },
  textInput: {
    fontFamily: 'Mitr-Regular',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  pickerButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContent: {
    flex: 1,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerText: {
    fontFamily: 'Mitr-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    fontFamily: 'Mitr-Regular',
    fontSize: 16,
    color: '#9CA3AF',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#60B876',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontFamily: 'Mitr-Regular',
    color: '#ffffff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontFamily: 'Mitr-Medium',
    fontSize: 18,
    color: '#333333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    paddingVertical: 8,
  },
  paymentOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentOptionText: {
    fontFamily: 'Mitr-Regular',
    fontSize: 16,
    color: '#333333',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 16,
  },
});

export default AddPaymentMethod;