import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute to access params
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import { IP_ADDRESS } from '../../config';

const CarUploadDropOffConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { request_id } = route.params || {}; // Destructure request_id from route params
  const [images, setImages] = useState({});
  console.log(typeof(request_id));

  const handleImageSelection = async (label) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) {
      console.log(`Opening image picker for: ${label}`);
      console.log('Image selection was canceled by the user.');
    } else {
      console.log('Selected image:', result.assets ? result.assets[0] : result.uri);
      setImages((prevImages) => ({
        ...prevImages,
        [label]: result.assets ? result.assets[0].uri : result.uri,
      }));
    }
  };

  const renderUploadBox = (label) => (
    <TouchableOpacity
      style={tw`flex-1 bg-gray-100 rounded-lg p-4 m-2 shadow`}
      onPress={() => handleImageSelection(label)}
    >
      <View style={tw`items-center m-auto`}>
        {images[label] ? (
          <Image
            source={{ uri: images[label] }}
            style={tw`w-32 h-32 mb-2 rounded-lg`}
            resizeMode="cover"
          />
        ) : (
          <Icon name="cloud-upload-outline" size={32} color="gray" style={tw`mb-2`} />
        )}
        <Text style={tw`text-gray-400`}>อัพโหลด</Text>
        <Text style={tw`text-base text-center text-black font-bold`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleConfirmation = async () => {
    try {
      console.log(`Sending request_id: ${request_id}`);
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/complete_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_id }),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Response data:', data);
  
      // Updated condition to match your response structure
      if (data.Status) {
        Alert.alert('Success', 'Request completed successfully.');
        navigation.navigate('HomeMain');
      } else {
        Alert.alert('Error', 'Failed to complete request.');
      }
    } catch (error) {
      console.error('Request failed:', error);
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };
  
  
  


  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 flex-1`}>
        <View style={tw`p-4 pt-8 flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold ml-4`}>ยืนยันการส่งรถ</Text>
        </View>
        <View style={tw`flex-1 justify-center`}>
          {renderUploadBox('ด้านหน้ารถ')}
          {renderUploadBox('ด้านหลังรถ')}
          <View style={tw`flex-row justify-between mt-4`}>
            {renderUploadBox('ด้านข้างรถ (ซ้าย)')}
            {renderUploadBox('ด้านข้างรถ (ขวา)')}
          </View>
        </View>
        <TouchableOpacity
          onPress={handleConfirmation}
          style={tw`bg-green-500 p-4 rounded-lg mt-4 items-center`}
        >
          <Text style={tw`text-white text-base font-bold`}>ยืนยันการส่งรถ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CarUploadDropOffConfirmation;
