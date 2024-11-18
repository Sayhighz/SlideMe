import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';

const CarUploadPickUpConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Access route
  const { request_id } = route.params || {}; // Destructure request_id from params
  const [images, setImages] = useState({});


  const handleImageSelection = async (label) => {
    console.log(`Opening image picker for: ${label}`); // Log when button is pressed

    // Request permission to access camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(`Permission status: ${status}`); // Log permission status

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required to select an image.');
      return;
    }

    try {
      // Launch the image library
      let result = await ImagePicker.launchImageLibraryAsync({
         // Correct value for images
        quality: 1,
      });

      console.log('Image picker result:', result); // Log the full result

      if (result.canceled) {
        console.log('Image selection was canceled by the user.');
      } else {
        console.log('Selected image URI:', result.assets ? result.assets[0].uri : result.uri); // Log selected image URI
        setImages((prevImages) => ({
          ...prevImages,
          [label]: result.assets ? result.assets[0].uri : result.uri, // Handle URI storage correctly
        }));
      }
    } catch (error) {
      console.error('Error during image selection:', error); // Log any errors
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

  const handleConfirmation = () => {
    // Navigate or handle confirmation with request_id
    navigation.navigate('JobWorking_Dropoff', { request_id }); // Replace 'NextScreen' with the intended screen
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 flex-1`}>
        <View style={tw`p-4 pt-8 flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold ml-4`}>ยืนยันการรับรถ</Text>
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
          <Text style={tw`text-white text-base font-bold`}>ยืนยันการรับรถ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CarUploadPickUpConfirmation;
