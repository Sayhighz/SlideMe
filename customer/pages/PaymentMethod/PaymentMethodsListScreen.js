import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import EditPaymentMethodModal from './EditPaymentMethodModal';
import { useIsFocused } from '@react-navigation/native';

const PaymentMethodsListScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editAccountName, setEditAccountName] = useState('');
  const [editAccountNumber, setEditAccountNumber] = useState('');
  const [editPaymentType, setEditPaymentType] = useState('');
  const [editExpirationDate, setEditExpirationDate] = useState('');

  // Hook to detect when the screen is focused
  const isFocused = useIsFocused();

  // Define the translatePaymentType function
  const translatePaymentType = (type) => {
    const typeMap = {
      credit_card: 'บัตรเครดิต',
      debit_card: 'บัตรเดบิต',
      paypal: 'PayPal',
      bank_transfer: 'บัญชีธนาคาร',
      other: 'อื่นๆ',
    };
    return typeMap[type] || type;
  };

  // Function to fetch payment methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.106:3000/auth/getAllUserPaymentMethods?user_id=2');
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      const data = await response.json();
      if (data.Status) {
        setPaymentMethods(data.Result);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment methods when the screen is focused
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
    fetchPaymentMethods(); // Refresh data after editing a payment method
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={tw`p-4 bg-white mb-2 rounded shadow`}>
        <Text style={tw`text-lg font-bold`}>{translatePaymentType(item.payment_type)}</Text>
        <Text style={tw`text-sm`}>{item.account_name}</Text>
        <Text style={tw`text-sm`}>
          บัญชี: {item.card_number ? `**** ${item.card_number}` : item.account_name || 'ไม่พบข้อมูล'}
        </Text>
        {item.expiration_date && (
          <Text style={tw`text-sm`}>วันหมดอายุ: {item.expiration_date}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
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
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item, index) => index.toString()}
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
        paymentType={editPaymentType}
        setPaymentType={setEditPaymentType}
        expirationDate={editExpirationDate}
        setExpirationDate={setEditExpirationDate}
        paymentMethodId={selectedMethod ? selectedMethod.payment_method_id : ''}
      />
    </View>
  );
};

export default PaymentMethodsListScreen;
