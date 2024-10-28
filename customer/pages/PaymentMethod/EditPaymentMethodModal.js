import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import tw from 'twrnc';

const EditPaymentMethodModal = ({
  visible,
  onClose,
  paymentMethod,
  onSave,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
}) => {
  const handleSave = () => {
    if (!accountName || !accountNumber) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    // Call the onSave function passed in props
    onSave();
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

          <Text style={tw`text-lg mt-2`}>ชื่อบัญชี</Text>
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
            value={accountNumber}
            onChangeText={setAccountNumber}
          />

          <View style={tw`flex-row justify-end mt-5`}>
            <TouchableOpacity
              style={tw`bg-gray-300 p-2 rounded mr-3`}
              onPress={onClose}
            >
              <Text style={tw`text-center`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-green-600 p-2 rounded`}
              onPress={handleSave}
            >
              <Text style={tw`text-white text-center`}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditPaymentMethodModal;
