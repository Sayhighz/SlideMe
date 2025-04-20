// EditPaymentMethodModal.js
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

const EditPaymentMethodModal = ({
  visible,
  onClose,
  onSave,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  paymentType,
  setPaymentType,
  expirationDate,
  setExpirationDate,
  paymentMethodId,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userData } = useContext(UserContext);

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
  
  // Format card number to show only last 4 digits
  const formatCardNumber = (number) => {
    if (!number) return "••••";
    // Only display last 4 digits
    return "•••• •••• •••• " + number.substring(number.length - 4);
  };

  const handleDelete = async () => {
    Alert.alert(
      "ยืนยันการปิดการใช้งาน",
      "คุณต้องการปิดการใช้งานช่องทางการชำระเงินนี้ใช่หรือไม่?",
      [
        { 
          text: "ยกเลิก", 
          style: "cancel" 
        },
        {
          text: "ยืนยัน",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const response = await fetch(
                `http://${IP_ADDRESS}:4000/api/v1/customer/payment/disable`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userData.token}`
                  },
                  body: JSON.stringify({
                    payment_method_id: Number(paymentMethodId),
                  }),
                }
              );

              if (response.ok) {
                Alert.alert(
                  "สำเร็จ", 
                  "ปิดการใช้งานช่องทางการชำระเงินเรียบร้อยแล้ว",
                  [{ text: "ตกลง", onPress: () => {
                    onSave();
                    onClose();
                  }}]
                );
              } else {
                const errorData = await response.json();
                Alert.alert(
                  "ข้อผิดพลาด", 
                  errorData.Error || "ไม่สามารถปิดการใช้งานช่องทางการชำระเงินได้"
                );
              }
            } catch (error) {
              Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาด: " + error.message);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const cardConfig = getCardConfig(paymentType);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="times" size={22} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>รายละเอียดการชำระเงิน</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Card Preview */}
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
                    {paymentType}
                  </Text>
                  <Icon name={cardConfig.icon} size={28} color={cardConfig.textColor} />
                </View>
                
                <Text style={[styles.cardPreviewNumber, { color: cardConfig.textColor }]}>
                  {formatCardNumber(accountNumber)}
                </Text>
                
                <View style={styles.cardPreviewFooter}>
                  <View>
                    <Text style={[styles.cardPreviewLabel, { color: cardConfig.textColor }]}>CARDHOLDER</Text>
                    <Text style={[styles.cardPreviewValue, { color: cardConfig.textColor }]}>
                      {accountName || "N/A"}
                    </Text>
                  </View>
                  
                  <View>
                    <Text style={[styles.cardPreviewLabel, { color: cardConfig.textColor }]}>EXPIRES</Text>
                    <Text style={[styles.cardPreviewValue, { color: cardConfig.textColor }]}>
                      {expirationDate || "MM/YY"}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Card Details */}
          <View style={styles.detailsContainer}>
            {/* Payment Type */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ประเภท</Text>
              <Text style={styles.detailValue}>{paymentType}</Text>
            </View>
            
            {/* Card Holder */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ชื่อผู้ถือบัตร</Text>
              <Text style={styles.detailValue}>{accountName}</Text>
            </View>
            
            {/* Card Number */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>หมายเลขบัตร</Text>
              <Text style={styles.detailValue}>{formatCardNumber(accountNumber)}</Text>
            </View>
            
            {/* Expiry Date */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>วันหมดอายุ</Text>
              <Text style={styles.detailValue}>{expirationDate}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Icon name="trash-alt" size={16} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>ปิดการใช้งาน</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: 'Mitr-Medium',
    fontSize: 18,
    color: '#333333',
  },
  cardPreviewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  cardPreview: {
    width: '100%',
    borderRadius: 16,
    height: 180,
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
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontFamily: 'Mitr-Regular',
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontFamily: 'Mitr-Medium',
    fontSize: 16,
    color: '#333333',
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontFamily: 'Mitr-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default EditPaymentMethodModal;