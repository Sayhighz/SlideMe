import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'
import { IP_ADDRESS } from '../../config'
import tw from 'twrnc'
import { UserContext } from '../../UserContext'
import HeaderWithBackButton from '../../components/HeaderWithBackButton'
import SubmitButton from '../../components/SubmitButton'

const EditProfile = ({ navigation }) => {
  const { userData, setUserData } = useContext(UserContext);
  const [firstName, setFirstName] = useState(userData.first_name || '');
  const [lastName, setLastName] = useState(userData.last_name || '');
  const [email, setEmail] = useState(userData.email || '');

  const formattedPhoneNumber = userData.phone_number?.startsWith('0')
    ? userData.phone_number.substring(1)
    : userData.phone_number;

    const confirmAndSave = () => {
      Alert.alert(
          'ยืนยันการบันทึก',
          'คุณต้องการบันทึกข้อมูลหรือไม่?',
          [
              {
                  text: 'ยกเลิก',
                  style: 'cancel',
              },
              {
                  text: 'ตกลง',
                  onPress: handleSave, // Call the actual save function
              },
          ],
          { cancelable: true }
      );
  };

    const handleSave = async () => {
      try {
          const response = await fetch(`http://${IP_ADDRESS}:3000/auth/edit_profile`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  first_name: firstName,
                  last_name: lastName,
                  email,
                  user_id: userData.user_id,
              }),
          });
  
          if (!response.ok) {
              Alert.alert('Error', `HTTP Error: ${response.status}`);
              return;
          }
  
          const result = await response.json();
          if (result.Status) {
              // Update the context with the new data
              setUserData((prev) => ({ ...prev, first_name: firstName, last_name: lastName, email }));
              Alert.alert('Success', 'บันทึกข้อมูลสำเร็จ');
              navigation.goBack(); // Return to UserProfile
          } else {
              Alert.alert('Error', result.Error || 'ไม่สามารถบันทึกข้อมูลได้');
          }
      } catch (error) {
          Alert.alert('Error', error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
  };
  

  return (
    <>
    <HeaderWithBackButton showBackButton={true} title="แก้ไขข้อมูลผู้ใช้" onPress={() => navigation.goBack()} />
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={[styles.globalText, tw`text-xl font-bold mb-5`]}>แก้ไขข้อมูลผู้ใช้</Text>


      <TextInput
        style={[styles.globalText, tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`]}
        placeholder={userData.first_name || "ชื่อ"}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}

      />


      <TextInput
        style={[styles.globalText, tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`]}
        placeholder={userData.last_name || "นามสกุล"}
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
      />

      <TextInput
        style={[styles.globalText, tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`]}
        placeholder={userData.email || "อีเมล"}
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
      />

      <View style={tw`flex-row items-center mb-4`}>
        <View style={tw`mr-2 border border-gray-300 rounded-lg p-2 bg-white`}>
          <Text style={tw`text-lg text-gray-800`}>🇹🇭 +66</Text>
        </View>
        <View style={tw`flex-1 border border-gray-300 rounded-lg bg-gray-200`}>
          <TextInput
            style={tw`p-2 text-gray-800`}
            value={formattedPhoneNumber}
            placeholder="เบอร์โทรศัพท์"
            editable={false}
          />
        </View>
      </View>
    </View>
    <SubmitButton onPress={confirmAndSave} title="บันทึก" />
    </>
  )
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular'
  },
});

export default EditProfile
