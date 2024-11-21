import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity , StyleSheet } from 'react-native'
import tw from 'twrnc'

const EditProfile = ({ navigation }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <View style={tw`flex-1 p-5 bg-gray-100 justify-center items-center`}>
      <Text style={[styles.globalText , tw`text-xl font-bold mb-5`]}>แก้ไขข้อมูลผู้ใช้</Text>

      <TextInput
        style={[styles.globalText , tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`]}
        placeholder='ชื่อ'
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={[styles.globalText , tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`]}
        placeholder='นามสกุล'
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={[styles.globalText , tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-5`]}
        placeholder='อีเมล'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
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
          onPress={() => {
            console.log({ firstName, lastName, email })
          }}
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
