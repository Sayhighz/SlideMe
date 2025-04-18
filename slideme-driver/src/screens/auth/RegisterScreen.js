import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import tw from 'twrnc';

// Import components
import AuthHeader from '../../components/auth/AuthHeader';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthLogo from '../../components/auth/AuthLogo';

// Import services and constants
import { postRequest } from '../../services/api';
import { API_ENDPOINTS, FONTS, COLORS, MESSAGES } from '../../constants';
import { PROVINCES, VEHICLE_TYPES } from '../../config';

const CustomDropdown = ({ placeholder, items, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLabel = value ? items.find(item => item.value === value)?.label : placeholder;
  
  return (
    <View style={tw`mb-4`}>
      <Text 
        style={{
          fontFamily: FONTS.FAMILY.REGULAR,
          fontSize: FONTS.SIZE.M,
          ...tw`text-gray-700 mb-1`,
        }}
      >
        {placeholder}
      </Text>
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
        style={{
          ...tw`border-2 border-gray-300 rounded-lg ${error ? 'border-red-500' : ''}`,
        }}
      >
        <View style={tw`flex-row justify-between items-center p-3`}>
          <Text 
            style={{
              fontFamily: FONTS.FAMILY.REGULAR,
              color: value ? '#000' : '#9ca3af',
            }}
          >
            {selectedLabel}
          </Text>
          <View style={tw`h-2 w-2 border-t-2 border-r-2 border-gray-400`} />
        </View>
      </TouchableOpacity>
      
      {error && (
        <Text 
          style={{
            fontFamily: FONTS.FAMILY.REGULAR,
            fontSize: FONTS.SIZE.S,
            ...tw`text-red-500 mt-1`,
          }}
        >
          {error.message}
        </Text>
      )}
      
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={tw`flex-1 bg-black bg-opacity-50`} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={tw`flex-1 justify-end`}>
            <View style={tw`bg-white rounded-t-xl`}>
              <View style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}>
                <Text style={{ fontFamily: FONTS.FAMILY.MEDIUM, fontSize: FONTS.SIZE.L }}>
                  {placeholder}
                </Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Text style={{ color: COLORS.PRIMARY, fontFamily: FONTS.FAMILY.MEDIUM }}>
                    เสร็จสิ้น
                  </Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={items}
                keyExtractor={(item) => item.value}
                style={tw`max-h-96`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-4 border-b border-gray-100 ${item.value === value ? 'bg-gray-100' : ''}`}
                    onPress={() => {
                      onChange(item.value);
                      setIsOpen(false);
                    }}
                  >
                    <Text style={{ fontFamily: FONTS.FAMILY.REGULAR }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [isAcceptTerms, setIsAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!phoneNumber) {
      newErrors.phoneNumber = { message: 'กรุณากรอกเบอร์โทรศัพท์' };
    } else if (!/^[0][0-9]{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = { message: 'เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0 และมีความยาว 10 หลัก' };
    }
    
    
    if (!selectedProvince) {
      newErrors.province = { message: 'กรุณาเลือกจังหวัด' };
    }
    
    if (!selectedVehicleType) {
      newErrors.vehicleType = { message: 'กรุณาเลือกประเภทรถ' };
    }
    
    if (!isAcceptTerms) {
      newErrors.terms = { message: 'กรุณายอมรับเงื่อนไข' };
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPhoneNumberExists = async () => {
    try {
      const response = await postRequest(API_ENDPOINTS.AUTH.CHECK_PHONE, {
        phone_number: phoneNumber
      });
      
      // ตรวจสอบค่า response.Exists ที่ส่งกลับมาจาก API
      return response.Exists;
    } catch (error) {
      console.error('Error checking phone number:', error);
      Alert.alert('ข้อผิดพลาด', MESSAGES.ERRORS.CONNECTION);
      return false;
    }
  };
  

  const handleNext = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const phoneExists = await checkPhoneNumberExists();
      
      if (phoneExists) {
        setErrors({ phoneNumber: { message: 'เบอร์โทรนี้ถูกใช้ไปแล้ว' } });
        setIsLoading(false);
        return;
      }

      console.log({
        phoneNumber,
        selectedProvince,
        selectedVehicleType,
      });
  
      
      navigation.navigate('RegisterPersonalInfo', {
        phoneNumber,
        selectedProvince,
        selectedVehicleType,
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <AuthHeader
        title="ลงทะเบียน"
        onBack={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={tw`p-6`}
          keyboardShouldPersistTaps="handled"
        >
          <AuthLogo tagline="สมัครเป็นคนขับ" style="mb-6" />
          
          <AuthInput
            label="เบอร์โทรศัพท์"
            value={phoneNumber}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setPhoneNumber(text);
              }
            }}
            placeholder="เบอร์โทรศัพท์"
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            maxLength={10}
          />
          
          <CustomDropdown
            placeholder="เลือกจังหวัด"
            items={PROVINCES}
            value={selectedProvince}
            onChange={setSelectedProvince}
            error={errors.province}
          />
          
          <CustomDropdown
            placeholder="เลือกประเภทรถ"
            items={VEHICLE_TYPES}
            value={selectedVehicleType}
            onChange={setSelectedVehicleType}
            error={errors.vehicleType}
          />
          
          <TouchableOpacity
            style={tw`flex-row items-center mb-6`}
            onPress={() => setIsAcceptTerms(!isAcceptTerms)}
          >
            <View
              style={tw`w-6 h-6 border-2 border-gray-300 rounded mr-2 ${
                isAcceptTerms ? `bg-[${COLORS.PRIMARY}]` : 'bg-white'
              }`}
            />
            <Text
              style={{
                fontFamily: FONTS.FAMILY.REGULAR,
                ...tw`text-gray-700`,
              }}
            >
              ยอมรับเงื่อนไข SLIDEME
            </Text>
          </TouchableOpacity>
          
          {errors.terms && (
            <Text
              style={{
                fontFamily: FONTS.FAMILY.REGULAR,
                fontSize: FONTS.SIZE.S,
                ...tw`text-red-500 mb-4`,
              }}
            >
              {errors.terms.message}
            </Text>
          )}
          
          <View style={tw`mt-4`}>
            <AuthButton
              title="ถัดไป"
              onPress={handleNext}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;