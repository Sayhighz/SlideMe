import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker'; // Import Expo's Image Picker

const CarUploadConfirmation = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState({});

  const handleImageSelection = async (label) => {
      
      // Request permission to access camera roll
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera roll permissions are required to select an image.');
          return;
        }
        
        // Launch the image library with updated MediaType usage
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.IMAGE], // Updated MediaType usage
            quality: 1,
        });
        
        if (result.canceled) {
        console.log(`Opening image picker for: ${label}`); // Log when button is pressed
      console.log('Image selection was canceled by the user.');
    } else {
      console.log('Selected image:', result.assets ? result.assets[0] : result.uri); // Log selected image data
      setImages((prevImages) => ({
        ...prevImages,
        [label]: result.assets ? result.assets[0].uri : result.uri, // Handle URI storage correctly
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
        <TouchableOpacity style={tw`bg-green-500 p-4 rounded-lg mt-4 items-center`}>
          <Text style={tw`text-white text-base font-bold`}>ยืนยันการส่งรถ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CarUploadConfirmation;
