import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import tw from 'twrnc'

const AddressPage = ({ navigation }) => {
  const [houseNumber, setHouseNumber] = useState('')
  const [street, setStreet] = useState('')
  const [subdistrict, setSubdistrict] = useState('')
  const [district, setDistrict] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')

  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <Text style={tw`text-xl font-bold mb-5`}>ข้อมูลที่อยู่</Text>

      <TextInput
        style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`}
        placeholder='หมายเลขบ้าน'
        value={houseNumber}
        onChangeText={setHouseNumber}
      />

      <TextInput
        style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`}
        placeholder='ถนน'
        value={street}
        onChangeText={setStreet}
      />

      <TextInput
        style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`}
        placeholder='ตำบล'
        value={subdistrict}
        onChangeText={setSubdistrict}
      />

      <TextInput
        style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`}
        placeholder='อำเภอ'
        value={district}
        onChangeText={setDistrict}
      />

      <TextInput
        style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`}
        placeholder='จังหวัด'
        value={province}
        onChangeText={setProvince}
      />

      <TextInput
        style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-5`}
        placeholder='รหัสไปรษณีย์'
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType='numeric'
      />

      <View style={tw`flex-row w-full justify-between`}>
        <TouchableOpacity
          style={tw`bg-red-500 w-1/2 h-12 rounded-lg justify-center mr-2 w-30`} // ใช้ mr-2 เพื่อเว้นระยะ
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Text style={tw`text-white text-center font-bold`}>ยกเลิก</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-green-500 w-35 h-12 rounded-lg justify-center`}
          onPress={() => {
            console.log({
              houseNumber,
              street,
              subdistrict,
              district,
              province,
              postalCode,
            })
          }}
        >
          <Text style={tw`text-white text-center font-bold`}>
            บันทึกข้อมูลที่อยู่
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddressPage
