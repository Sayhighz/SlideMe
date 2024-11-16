import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import tw from 'twrnc'
import provinces from './provinceData'

const AddressPage = ({ navigation, route }) => {
  const { initialAddressData } = route.params || {}
  const [houseNumber, setHouseNumber] = useState(
    initialAddressData?.houseNumber || ''
  )
  const [alley, setAlley] = useState(initialAddressData?.alley || '')
  const [street, setStreet] = useState(initialAddressData?.street || '')
  const [subdistrict, setSubdistrict] = useState(
    initialAddressData?.subdistrict || ''
  )
  const [district, setDistrict] = useState(initialAddressData?.district || '')
  const [province, setProvince] = useState(initialAddressData?.province || '')

  const [openProvince, setOpenProvince] = useState(false)

  const handleSave = () => {
    const addressData = {
      houseNumber,
      street,
      alley,
      subdistrict,
      district,
      province,
    }
    navigation.navigate('UserProfile', { addressData })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-1 p-5 bg-gray-100 items-center`}>
        <Text style={tw`text-xl font-bold mb-5`}>ข้อมูลที่อยู่</Text>
        {/* House Number Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='บ้านเลขที่'
            value={houseNumber}
            onChangeText={setHouseNumber}
          />
          {houseNumber.length > 0 && (
            <TouchableOpacity onPress={() => setHouseNumber('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Alley Input */}
        <View
          style={tw`w-full h-20 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='ชื่อหมู่บ้าน / ซอย และ รายละเอียดเพิ่มเติม'
            value={alley}
            onChangeText={setAlley}
            multiline={true}
          />
          {alley.length > 0 && (
            <TouchableOpacity onPress={() => setAlley('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Street Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='ถนน'
            value={street}
            onChangeText={setStreet}
          />
          {street.length > 0 && (
            <TouchableOpacity onPress={() => setStreet('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Subdistrict Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='ตำบล'
            value={subdistrict}
            onChangeText={setSubdistrict}
          />
          {subdistrict.length > 0 && (
            <TouchableOpacity onPress={() => setSubdistrict('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* District Input */}
        <View
          style={tw`w-full h-12 border border-gray-300 bg-white rounded-lg mb-3 flex-row items-center px-3`}
        >
          <TextInput
            style={tw`flex-1 h-full`}
            placeholder='อำเภอ'
            value={district}
            onChangeText={setDistrict}
          />
          {district.length > 0 && (
            <TouchableOpacity onPress={() => setDistrict('')}>
              <Text style={tw`text-red-500 ml-3 font-bold`}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Province Dropdown */}
        <DropDownPicker
          open={openProvince}
          value={province}
          items={provinces}
          setOpen={setOpenProvince}
          setValue={setProvince}
          placeholder='เลือกจังหวัด'
          searchable={true}
          searchPlaceholder='ค้นหาจังหวัด'
          style={tw`w-full mb-3 border border-gray-300`}
          dropDownContainerStyle={tw`border border-gray-300`}
          listmode='SCROLLVIEW'
          dropDownDirection='BOTTOM'
          maxHeight={180}
        />
        {/* Buttons */}
        <View style={tw`flex-row w-full justify-between`}>
          <TouchableOpacity
            style={tw`bg-red-500 w-30 h-12 rounded-lg justify-center border-b-4 border-red-700`}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Text style={tw`text-white text-center font-bold`}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-green-500 w-35 h-12 rounded-lg justify-center border-b-4 border-green-700`}
            onPress={handleSave}
          >
            <Text style={tw`text-white text-center font-bold`}>
              บันทึกข้อมูลที่อยู่
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AddressPage