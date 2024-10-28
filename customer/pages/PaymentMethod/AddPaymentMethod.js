import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';

const AddPaymentMethod = () => {
  const [paymentType, setPaymentType] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = () => {
    if (!paymentType || !accountName || !accountNumber) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    Alert.alert('Success', 'Payment method saved successfully');
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
          <Picker.Item label="พร้อมเพย์" value="promptpay" />
          <Picker.Item label="ธนาคาร" value="bank_transfer" />
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
