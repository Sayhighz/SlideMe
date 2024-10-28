import React from 'react';
import { View, Text, Button } from 'react-native';
import tw from 'twrnc';

const UserProfile = ({ navigation }) => {
  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-5`}>โปรไฟล์ผู้ใช้</Text>
      <Text style={tw`text-lg mb-3`}>Kunatip</Text>
      <Text style={tw`text-lg mb-3`}>Email: sagagrohacker@gmail.com</Text>


      <Button color={'#60B876'}
        title="ช่องทางการชำระเงิน"
        onPress={() => navigation.navigate('PaymentMethodsStack')}
      />
    </View>
  );
};

export default UserProfile;
