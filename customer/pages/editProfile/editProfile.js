import React, { useState , useContext } from 'react'
import { View, Text, TouchableOpacity , TextInput , StyleSheet , Alert} from 'react-native'
import { IP_ADDRESS } from '../../config'
import tw from 'twrnc'
import { UserContext } from '../../UserContext'

const EditProfile = ({ navigation }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username , setUsername] = useState('')
  const [userId, setUserId] = useState('1');
  const { userData } = useContext(UserContext);

  const handleSave = async () => {
    if ( !firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }
  
    try {
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/edit_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          user_id: userData.user_id,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Read error response
        console.error('Error:', errorText);
        Alert.alert('Error', `HTTP Error: ${response.status}`);
        return;
      }
  
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const errorText = await response.text(); // Read raw response for debugging
        console.error('Error Parsing JSON:', errorText);
        Alert.alert('Error', 'Invalid JSON response from server.');
        return;
      }
  
      if (result.Status) {
        Alert.alert('Success', 'Profile updated successfully.');
        navigation.goBack(); // Navigate back on success
      } else {
        Alert.alert('Error', result.Error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'An error occurred.');
    }
  };
  return (
    <View style={tw`flex-1 p-5 bg-gray-100 justify-center items-center`}>
      <Text style={[styles.globalText , tw`text-xl font-bold mb-5`]}>แก้ไขข้อมูลผู้ใช้</Text>

     
      <TextInput
        style={[styles.globalText , tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`]}
        placeholder={userData.first_name || "ชื่อ"}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
        
      />
      

      <TextInput
        style={[styles.globalText , tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`]}
        placeholder={userData.last_name || "นามสกุล"}
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
      />

      <TextInput
        style={[styles.globalText , tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-5`]}
        placeholder={userData.email || "อีเมล"}
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
      />

      <View style={tw`flex-row w-full justify-between`}>
        <TouchableOpacity
          style={tw`bg-red-500 w-1/2 h-12 rounded-lg justify-center mr-2 w-30`} // ใช้ mr-2 เพื่อเว้นระยะ
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Text style={[styles.globalText , tw`text-white text-center font-bold`]}>ยกเลิก</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-green-500 w-1/2 h-12 rounded-lg justify-center ml-2 w-30`} // ใช้ ml-2 เพื่อเว้นระยะ
          onPress={handleSave}
        >
          <Text style={[styles.globalText , tw`text-white text-center font-bold`]}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular'
  },
});

export default EditProfile
