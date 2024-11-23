import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { IP_ADDRESS } from "../../config";
import { UserContext } from '../../UserContext';

const AddPaymentMethod = ({ route }) => {
  const navigation = useNavigation();
  const { onRefresh } = route.params || {}; // Retrieve the onRefresh callback

  const [paymentType, setPaymentType] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const { userData } = useContext(UserContext);

  const handleExpirationDateChange = (input) => {
    let formattedInput = input.replace(/\D/g, ''); // Remove non-numeric characters
    if (formattedInput.length > 2) {
      formattedInput = `${formattedInput.slice(0, 2)}/${formattedInput.slice(2)}`;
    }
    setExpirationDate(formattedInput);
  };

  const handleSubmit = async () => {
    if (!paymentType || !accountName || !accountNumber || !expirationDate) {
      Alert.alert('Error', 'โปรดกรอกข้อมูลให้ครบ');
      return;
    }

    const payload = {
      user_id: userData.user_id,
      payment_type: paymentType,
      card_number: accountNumber,
      account_name: accountName,
      expiration_date: expirationDate,
    };

    try {
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/add_payment_method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log()
        Alert.alert('Success', 'บันทึกช่องทางการชำระเงินสําเร็จ');
        if (onRefresh) {
          onRefresh(); // Call the callback to refresh data
        }
        navigation.goBack();
      } else {
        Alert.alert('Error', 'บันทึกช่องทางการชำระเงินไม่สําเร็จ');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred: ' + error.message);
    }
  };

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-5`}>เพิ่มช่องทางการชำระเงิน</Text>

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

      <TouchableOpacity
        style={tw`bg-green-600 p-3 rounded mt-5`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white text-center text-lg`}>บันทึก</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPaymentMethod;
