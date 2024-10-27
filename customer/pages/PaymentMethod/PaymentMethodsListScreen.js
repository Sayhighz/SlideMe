// PaymentMethodsListScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import EditPaymentMethodModal from './EditPaymentMethodModal';

const PaymentMethodsListScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'บัตรเครดิต', accountName: 'Kunatip', accountNumber: '**** 1234' },
    { id: '2', type: 'พร้อมเพย์', accountName: 'Night', accountNumber: '080-123-4567' },
  ]);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editAccountName, setEditAccountName] = useState('');
  const [editAccountNumber, setEditAccountNumber] = useState('');

  const openModal = (method) => {
    setSelectedMethod(method);
    setEditAccountName(method.accountName);
    setEditAccountNumber(method.accountNumber);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMethod(null);
  };

  const handleSave = () => {
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) =>
        method.id === selectedMethod.id
          ? { ...method, accountName: editAccountName, accountNumber: editAccountNumber }
          : method
      )
    );
    closeModal();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={tw`p-4 bg-white mb-2 rounded shadow`}>
        <Text style={tw`text-lg font-bold`}>{item.type}</Text>
        <Text style={tw`text-sm`}>{item.accountName}</Text>
        <Text style={tw`text-sm`}>Account: {item.accountNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={tw`bg-green-600 p-3 rounded mt-5`}
        onPress={() => navigation.navigate('AddPaymentMethod')}
      >
        <Text style={tw`text-white text-center text-lg`}>เพิ่มช่องทางการชำระเงิน</Text>
      </TouchableOpacity>

      <EditPaymentMethodModal
        visible={modalVisible}
        onClose={closeModal}
        paymentMethod={selectedMethod}
        onSave={handleSave}
        accountName={editAccountName}
        setAccountName={setEditAccountName}
        accountNumber={editAccountNumber}
        setAccountNumber={setEditAccountNumber}
      />
    </View>
  );
};

export default PaymentMethodsListScreen;
