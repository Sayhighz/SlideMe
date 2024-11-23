import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';

const FirstRegister = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const provinces = [
    { label: 'กรุงเทพมหานคร', value: 'bangkok' },
    { label: 'เชียงใหม่', value: 'chiangmai' },
    { label: 'ภูเก็ต', value: 'phuket' },
    { label: 'ชลบุรี', value: 'chonburi' },
    { label: 'นครราชสีมา', value: 'korat' },
  ];

  const vehicleTypes = [
    { label: 'รถสไลด์มาตรฐาน', value: 'standard_slide' },
    { label: 'รถสไลด์ขนาดใหญ่', value: 'heavy_duty_slide' },
    { label: 'รถสไลด์สำหรับรถหรู', value: 'luxury_slide' },
    { label: 'รถสไลด์ฉุกเฉิน', value: 'emergency_slide' },
  ];

  const handleRegisterPress = () => {
    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกเบอร์โทรศัพท์ที่มีความยาว 10 ตัวเลข');
      return;
    }

    if (!phoneNumber || !selectedProvince || !selectedVehicleType) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (!isTermsAccepted) {
      Alert.alert('ข้อผิดพลาด', 'กรุณายอมรับเงื่อนไขก่อนสมัคร');
      return;
    }

    navigation.navigate('SecondRegister', {
      phoneNumber,
      selectedProvince,
      selectedVehicleType,
    });
    console.log(`Phone: ${phoneNumber}, Province: ${selectedProvince}, Vehicle: ${selectedVehicleType}`);
  };

  const handleBackPress = () => {
    navigation.navigate('HomeLogin');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={tw`p-4`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={tw`absolute top-10 left-4 z-50`}>
            <TouchableOpacity onPress={handleBackPress}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={tw`flex-1 justify-center mt-6 items-center`}>
            <View style={tw`mb-4`}>
              <Text style={[styles.globalText, tw`text-6xl text-[#60B876] font-bold text-center`]}>SLIDE</Text>
              <Text style={[styles.globalText, tw`text-8xl text-[#60B876] font-bold text-center leading-none`]}>ME</Text>
              <Text style={[styles.globalText, tw`text-3xl font-bold text-center mb-2 text-[#60B876]`]}>สมัครเป็นคนขับ</Text>
              <Text style={[styles.globalText, tw`text-center text-gray-600`]}>เข้าร่วมทีมของเราและรับสิทธิพิเศษมากมาย!</Text>
            </View>
          </View>
          <View style={tw`flex-1`}>
            <Text style={[styles.globalText, tw`text-lg font-bold mb-2`]}>เบอร์โทรศัพท์</Text>
            <TextInput
              placeholder="เบอร์โทรศัพท์"
              style={[styles.input, tw`mb-4`]}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
            <Text style={[styles.globalText, tw`text-lg font-bold mb-2`]}>เลือกจังหวัด</Text>
            <View style={[styles.pickerContainer, tw`mb-4`]}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedProvince(value)}
                items={provinces}
                placeholder={{ label: 'กรุณาเลือกจังหวัด', value: null }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.pickerText,
                  inputAndroid: styles.pickerText,
                  placeholder: styles.placeholderText,
                }}
              />
            </View>
            <Text style={[styles.globalText, tw`text-lg font-bold mb-2`]}>เลือกประเภทรถ</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedVehicleType(value)}
                items={vehicleTypes}
                placeholder={{ label: 'กรุณาเลือกประเภทรถ', value: null }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.pickerText,
                  inputAndroid: styles.pickerText,
                  placeholder: styles.placeholderText,
                }}
              />
            </View>
            <TouchableOpacity
              style={tw`flex-row items-center mt-4`}
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            >
              <View
                style={tw`w-6 h-6 border-2 border-gray-300 rounded mr-2 ${
                  isTermsAccepted ? 'bg-green-500' : 'bg-white'
                }`}
              />
              <Text style={[styles.globalText]}>ยอมรับเงื่อนไข SLIDEME</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Fixed Next Button */}
        <View style={tw`absolute bottom-4 left-4 right-4`}>
          <TouchableOpacity
            style={tw`w-full bg-[#60B876] rounded p-4`}
            onPress={handleRegisterPress}
          >
            <Text style={[styles.globalText, tw`text-center text-lg font-bold text-white`]}>สมัครเป็นคนขับ</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular',
  },
  input: {
    borderWidth: 2,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Mitr-Regular',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    justifyContent: 'center',
    height: 48,
  },
  pickerText: {
    fontFamily: 'Mitr-Regular',
    padding: 12,
    color: 'black',
  },
  placeholderText: {
    fontFamily: 'Mitr-Regular',
    color: 'gray',
  },
});

export default FirstRegister;
