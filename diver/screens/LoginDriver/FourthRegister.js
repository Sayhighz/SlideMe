import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const FourthRegister = ({ navigation, route }) => {
  const [images, setImages] = useState({
    idPhoto: null,
    vehiclePhoto: null,
    vehicleDoc: null,
    idCardPhoto: null,
    licensePhoto: null,
    bankBookPhoto: null,
  });

  const handleImageSelection = async (label) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant permission to access the photo library.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setImages((prevImages) => ({
          ...prevImages,
          [label]: uri,
        }));
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const renderUploadButton = (label, displayName) => (
    <TouchableOpacity
      style={tw`bg-gray-200 w-full p-4 rounded-lg mb-4`}
      onPress={() => handleImageSelection(label)}
    >
      <View style={tw`items-center`}>
        {images[label] ? (
          <Image
            source={{ uri: images[label] }}
            style={tw`w-20 h-20 mb-2 rounded-lg`}
            resizeMode="cover"
          />
        ) : (
          <Icon name="cloud-upload-outline" size={32} color="gray" style={tw`mb-2`} />
        )}
        <Text style={[styles.globalText, tw`text-lg font-bold text-center`]}>{displayName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={tw`p-4 justify-start mx-auto w-10/12`}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <View style={tw`absolute top-12 left-4 z-50`}>
            <TouchableOpacity onPress={() => navigation.navigate('ThirdRegister')}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Page Title */}
          <Text style={[styles.globalText, tw`text-xl font-bold mb-2 mt-8 ml-11`]}>ขั้นตอนที่ 3 จาก 3</Text>
          <Text style={[styles.globalText, tw`text-2xl font-bold mb-6`]}>อัพโหลดไฟล์เอกสาร</Text>

          {/* Render upload buttons */}
          {renderUploadButton('idPhoto', 'รูปถ่ายบัตรตรวจ')}
          {renderUploadButton('vehiclePhoto', 'รูปถ่ายยานพาหนะ')}
          {renderUploadButton('vehicleDoc', 'รูปถ่ายเอกสารรถ (เล่มรถ)')}
          {renderUploadButton('idCardPhoto', 'รูปถ่ายบัตรประชาชน')}
          {renderUploadButton('licensePhoto', 'รูปใบขับขี่')}
          {renderUploadButton('bankBookPhoto', 'รูปสมุดธนาคาร')}
          <View style={tw`h-20`}></View>
        </ScrollView>

        {/* Fixed Next Button */}
        <View style={tw`absolute bottom-4 left-4 right-4`}>
          <TouchableOpacity
            style={tw`w-full bg-[#60B876] p-4 rounded`}
            onPress={() => navigation.navigate('FifthRegister', {
              ...route.params, // Pass data from ThirdRegister.js
            })}
          >
            <Text style={[styles.globalText, tw`text-lg text-white font-bold text-center`]}>
              ยืนยันการส่งข้อมูล
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular', // Custom font
  },
});

export default FourthRegister;
