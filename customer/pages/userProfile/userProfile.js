import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';

const UserProfile = ({ navigation, route }) => {
  const [profileData, setProfileData] = useState({
    firstName: 'รัตนพล',
    lastName: 'ศรีโนนยาง',
    username: 'Rattanapon',
    email: 'aof4463@gmail.com',
    phoneNumber: '0954915724',
  });

  const [addressData, setAddressData] = useState({
    houseNumber: '',
    street: '',
    alley: '',
    subdistrict: '',
    district: '',
    province: '',
  });

  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.updatedData) {
        setProfileData(route.params.updatedData);
      }
      if (route.params?.addressData) {
        setAddressData(route.params.addressData);
      }
    }, [route.params])
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <ScrollView contentContainerStyle={tw`p-5 bg-gray-100 items-center`}>
      <TouchableOpacity
        style={tw`items-center justify-center w-32 h-32 rounded-full bg-gray-200 border-4 border-green-300 mb-3`}
        onPress={toggleModal}
      >
        <Ionicons name='camera' size={30} color='gray' />
      </TouchableOpacity>
      <Text style={tw`text-center text-gray-500 font-bold mb-2`}>
        รูปโปรไฟล์
      </Text>

      <Modal isVisible={isModalVisible}>
        <View style={tw`bg-white p-5 rounded-lg`}>
          <Text style={tw`text-lg font-bold mb-4 text-center`}>
            เลือกรูปภาพ
          </Text>
          <View style={tw`items-center`}>
            <TouchableOpacity
              style={tw`bg-blue-500 py-3 px-6 rounded-lg mb-3 w-40 shadow-lg border-b-4 border-blue-700`}
              onPress={() => {
                console.log('เลือกจากแกลเลอรี');
                toggleModal();
              }}
            >
              <Text style={tw`text-white text-center font-bold`}>
                เลือกจากแกลเลอรี
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-green-500 py-3 px-6 rounded-lg mb-3 w-40 shadow-lg border-b-4 border-green-700`}
              onPress={() => {
                console.log('ถ่ายรูปใหม่');
                toggleModal();
              }}
            >
              <Text style={tw`text-white text-center font-bold`}>
                ถ่ายรูปใหม่
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-red-500 py-3 px-6 rounded-lg w-40 shadow-lg border-b-4 border-red-700`}
              onPress={toggleModal}
            >
              <Text style={tw`text-white text-center font-bold`}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={tw`bg-white p-5 rounded-lg shadow-md w-full mb-3 border-2 border-gray-300`}
      >
        <View style={tw`flex-row items-center mb-2`}>
          <Ionicons name='person' size={24} color='black' style={tw`mr-2`} />
          <Text style={tw`text-lg font-bold`}>ข้อมูลโปรไฟล์</Text>
        </View>
        <View style={tw`h-0.5 bg-gray-300 mb-3`} />
        <View style={tw`mb-2`}>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>ชื่อ:</Text>
            <Text style={tw`text-base text-gray-700`}>
              {profileData.firstName}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>นามสกุล:</Text>
            <Text style={tw`text-base text-gray-700`}>
              {profileData.lastName}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>ชื่อผู้ใช้:</Text>
            <Text style={tw`text-base text-gray-700`}>
              {profileData.username}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>อีเมล:</Text>
            <Text style={tw`text-base text-gray-700`}>{profileData.email}</Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>เบอร์โทร:</Text>
            <Text style={tw`text-base text-gray-700`}>
              {profileData.phoneNumber}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 px-6 rounded-lg mt-3 w-full shadow-lg border-b-4 border-blue-700 flex-row items-center justify-center`}
          onPress={() =>
            navigation.navigate('editProfile', { initialData: profileData })
          }
        >
          <Text style={tw`text-white text-center font-bold`}>
            แก้ไขข้อมูลผู้ใช้
          </Text>
          <Ionicons name="pencil" size={20} color="white" style={tw`ml-2`} />
        </TouchableOpacity>
      </View>

      <View
        style={tw`bg-white p-5 rounded-lg shadow-md w-full mb-3 border-2 border-gray-300`}
      >
        <View style={tw`flex-row items-center mb-2`}>
          <Ionicons name='location' size={24} color='black' style={tw`mr-2`} />
          <Text style={tw`text-lg font-bold`}>ข้อมูลที่อยู่</Text>
        </View>
        <View style={tw`h-0.5 bg-gray-300 mb-3`} />
        <View style={tw`mb-2`}>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>บ้านเลขที่:</Text>
            <Text style={[tw`text-base text-gray-700`, { flex: 1 }]}>
              {addressData.houseNumber}
            </Text>
          </View>
          <View style={tw`flex-row py-1`}>
            <Text style={tw`text-base text-gray-700`}>ชื่อหมู่บ้าน / ซอย และ รายละเอียดเพิ่มเติม:</Text>
          </View>
          <View style={tw`py-1`}>
            <Text style={[tw`text-base text-gray-700`, { flex: 1 }]}>
              {addressData.alley}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>ถนน:</Text>
            <Text style={[tw`text-base text-gray-700`, { flex: 1 }]}>
              {addressData.street}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>ตำบล:</Text>
            <Text style={[tw`text-base text-gray-700`, { flex: 1 }]}>
              {addressData.subdistrict}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>อำเภอ:</Text>
            <Text style={[tw`text-base text-gray-700`, { flex: 1 }]}>
              {addressData.district}
            </Text>
          </View>
          <View style={tw`flex-row justify-between py-1`}>
            <Text style={tw`text-base text-gray-700`}>จังหวัด:</Text>
            <Text style={[tw`text-base text-gray-700`, { flex: 1 }]}>
              {addressData.province}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 px-6 rounded-lg mt-3 w-full shadow-lg border-b-4 border-blue-700 flex-row items-center justify-center`}
          onPress={() =>
            navigation.navigate('addressPage', {
              initialAddressData: addressData,
            })
          }
        >
          <Text style={tw`text-white text-center font-bold`}>
            แก้ไขข้อมูลที่อยู่
          </Text>
          <Ionicons name="pencil" size={20} color="white" style={tw`ml-2`} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`bg-white py-3 px-6 rounded-lg mb-3 w-50 shadow-lg border-b-4 border-gray-300 flex-row items-center justify-center`}
        onPress={() => navigation.navigate('PaymentMethodsStack')}
      >
        <Text style={tw`text-blue-600 text-center font-bold`}>
          ช่องทางการชำระเงิน
        </Text>
        <Ionicons name="wallet" size={20} color="rgb(37 99 235)" style={tw`ml-2`} />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-white py-3 px-6 rounded-lg mb-3 w-50 shadow-lg border-b-4 border-gray-300 flex-row items-center justify-center`}
        onPress={() => navigation.navigate('HistoryPage')}
      >
        <Text style={tw`text-blue-600 text-center font-bold`}>
          ประวัติการใช้บริการ
        </Text>
        <Ionicons name="time" size={20} color="rgb(37 99 235)" style={tw`ml-2`} />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-red-500 py-3 px-6 rounded-lg w-50 shadow-lg border-b-4 border-red-700 flex-row items-center justify-center`}
        onPress={() => navigation.navigate('HistoryPage')}
      >
        <Text style={tw`text-white text-center font-bold`}>ลงชื่อออก</Text>
        <Ionicons name="log-out-outline" size={20} color="white" style={tw`ml-2`} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserProfile;