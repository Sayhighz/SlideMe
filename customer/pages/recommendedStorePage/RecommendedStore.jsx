import React from 'react';
import { View, Text, Button } from 'react-native';
import tw from 'twrnc'; 

const RecommendedStorePage = ({ navigation }) => {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-xl`}>หน้าร้านแนะนำ</Text>
      <Button title="กลับหน้าแรก" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default RecommendedStorePage;