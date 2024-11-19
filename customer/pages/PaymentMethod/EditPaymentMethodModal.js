import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import { IP_ADDRESS } from "../../config";

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

  const handleExpirationDateChange = (input) => {
    let formattedInput = input.replace(/\D/g, '');
    if (formattedInput.length > 2) {
      formattedInput = `${formattedInput.slice(0, 2)}/${formattedInput.slice(2)}`;
    }
    setExpirationDate(formattedInput);
  };

  const handleSave = async () => {
    if (!paymentType || !accountName || !accountNumber || !expirationDate) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    setIsSaving(true);
    const payload = {
      payment_type: paymentType,
      card_number: accountNumber,
      account_name: accountName,
      expiration_date: expirationDate,
      payment_method_id: Number(paymentMethodId),
    };

    try {
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/update_payment_method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Success', 'แก้ไขช่องทางการชำระเงินสําเร็จ');
        onSave();
        onClose();
      } else {
        Alert.alert('Error', 'แก้ไขช่องทางการชำระเงินไม่สําเร็จ');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'ยืนยันการลบ',
      'คุณต้องการลบช่องทางการชำระเงินใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ใช่',
          onPress: async () => {
            try {
              const response = await fetch(`http://${IP_ADDRESS}:3000/auth/disable_payment_method`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payment_method_id: Number(paymentMethodId) }),
              });

              if (response.ok) {
                Alert.alert('Success', 'ลบช่องทางการชำระเงินสําเร็จ');
                onSave();
                onClose();
              } else {
                Alert.alert('Error', 'ลบช่องทางการชำระเงินไม่สําเร็จ');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred: ' + error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}>
        <View style={tw`w-11/12 bg-white p-5 rounded`}>
          <Text style={tw`text-2xl font-bold mb-5`}>แก้ไขช่องทางการชำระเงิน</Text>

          <Text style={tw`text-lg mt-2`}>ประเภท</Text>
          <View style={tw`border border-gray-300 rounded mt-1`}>
            <Picker
              selectedValue={paymentType}
              onValueChange={(itemValue) => setPaymentType(itemValue)}
              style={tw`h-10`}
            >
              <Picker.Item label="ประเภทการชำระเงิน" value="" />
              <Picker.Item label="บัตรเครดิต" value="credit_card" />
              <Picker.Item label="บัตรเดบิต" value="debit_card" />
              <Picker.Item label="PayPal" value="paypal" />
              <Picker.Item label="ธนาคาร" value="bank_transfer" />
              <Picker.Item label="อื่นๆ" value="other" />
            </Picker>
          </View>

          <Text style={tw`text-lg mt-4`}>ชื่อบัญชี</Text>
          <TextInput
            style={tw`border border-gray-300 p-2 rounded mt-1`}
            placeholder="ชื่อบัญชี"
            value={accountName}
            onChangeText={setAccountName}
          />

          <Text style={tw`text-lg mt-4`}>หมายเลขบัญชี</Text>
          <TextInput
            style={tw`border border-gray-300 p-2 rounded mt-1`}
            placeholder="เลขบัญชี"
            keyboardType="numeric"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />

          <Text style={tw`text-lg mt-4`}>วันหมดอายุ</Text>
          <TextInput
            style={tw`border border-gray-300 p-2 rounded mt-1`}
            placeholder="MM/YY"
            value={expirationDate}
            onChangeText={handleExpirationDateChange}
            maxLength={5}
            keyboardType="numeric"
          />

          <View style={tw`flex-row justify-between mt-5`}>
            <TouchableOpacity
              style={tw`bg-red-600 p-2 rounded`}
              onPress={handleDelete}
              disabled={isSaving}
            >
              <Text style={tw`text-white text-center`}>ลบข้อมูล</Text>
            </TouchableOpacity>
            <View style={tw`flex-row`}>
              <TouchableOpacity
                style={tw`bg-gray-300 p-2 rounded mr-3`}
                onPress={onClose}
                disabled={isSaving}
              >
                <Text style={tw`text-center`}>ย้อนกลับ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-green-600 p-2 rounded`}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={tw`text-white text-center`}>บันทึก</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditPaymentMethodModal;
