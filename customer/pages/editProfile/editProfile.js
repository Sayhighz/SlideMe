import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import tw from 'twrnc'

const EditProfile = ({ navigation, route }) => {
  const { initialData } = route.params || {}
  const [firstName, setFirstName] = useState(initialData?.firstName || '')
  const [lastName, setLastName] = useState(initialData?.lastName || '')
  const [username, setUsername] = useState(initialData?.username || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber || '0954915724'
  )

  const handleSave = () => {
    navigation.navigate('UserProfile', {
      updatedData: {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
      },
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-1 p-5 bg-gray-100 justify-center items-center`}>
        <Text style={tw`text-xl font-bold mb-5`}>แก้ไขข้อมูลผู้ใช้</Text>

        {/* First Name Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='ชื่อ'
            value={firstName}
            onChangeText={setFirstName}
          />
          {firstName.length > 0 && (
            <TouchableOpacity onPress={() => setFirstName('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Last Name Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='นามสกุล'
            value={lastName}
            onChangeText={setLastName}
          />
          {lastName.length > 0 && (
            <TouchableOpacity onPress={() => setLastName('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Username Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='ชื่อผู้ใช้'
            value={username}
            onChangeText={setUsername}
          />
          {username.length > 0 && (
            <TouchableOpacity onPress={() => setUsername('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Email Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-5 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='อีเมล'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
          />
          {email.length > 0 && (
            <TouchableOpacity onPress={() => setEmail('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Phone Number Input - Not Editable */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-gray-200 rounded-lg mb-5 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='เบอร์โทรศัพท์'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType='number'
            editable={false}
          />
        </View>

        <View style={tw`flex-row w-full justify-between`}>
          <TouchableOpacity
            style={tw`bg-red-500 w-35 h-12 rounded-lg justify-center mr-2 border-b-4 border-red-700`}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Text style={tw`text-white text-center font-bold`}>ยกเลิก</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-green-500 w-35 h-12 rounded-lg justify-center ml-2 border-b-4 border-green-700`}
            onPress={handleSave}
          >
            <Text style={tw`text-white text-center font-bold`}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default EditProfile
