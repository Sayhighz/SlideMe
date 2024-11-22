import React from 'react'
import { View, Text, TouchableOpacity , StyleSheet , Dimensions} from 'react-native'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';


const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;
  const responsiveHeight = height * 0.2;
const UserProfile = ({ navigation }) => {
  return (
    <SafeAreaView style={[tw`flex-1 p-1 bg-gray-100`]}>
    <View style={[{height: height * 0.55} ,tw`bg-gray-100 justify-center items-center`]}>
      
      <TouchableOpacity
        style={tw`items-center justify-center w-32 h-32 rounded-full bg-gray-200 mb-3`}
        onPress={() => {
          // ใส่ฟังก์ชันแก้ไขรูปภาพ
        }}
      >
        <Ionicons name='camera' size={30} color='gray' />
      </TouchableOpacity>
      <Text style={[styles.globalText , tw`text-center text-gray-500 font-bold mb-8`]}>
        แก้ไขโปรไฟล์
      </Text>

      <TouchableOpacity
        style={[{height: height * 0.05, width: width * 0.5} ,tw`bg-green-500 items-center justify-center rounded-lg mb-3 w-50`]}
        onPress={() => navigation.navigate('editProfile')}
      >
        <Text style={[styles.globalText , tw`text-white text-center font-bold`]}>
          แก้ไขข้อมูลผู้ใช้
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[{height: height * 0.05 , width : width * 0.5} ,tw`bg-green-500 items-center justify-center rounded-lg mb-3 w-50`]}
        onPress={() => navigation.navigate('addressPage')}
      >
        <Text style={[styles.globalText , tw`text-white text-center font-bold`]}>เพิ่มรายการโปรด</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[{height: height * 0.05 , width: width * 0.5} ,tw`bg-green-500 items-center justify-center rounded-lg mb-3 w-50`]}
        onPress={() => navigation.navigate('PaymentMethodsStack')}
      >
        <Text style={[styles.globalText , tw`text-white text-center font-bold`]}>
          ช่องทางการชำระเงิน
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[{height: height * 0.05 , width: width * 0.5 },tw`bg-green-500 items-center justify-center rounded-lg mb-30 w-50`]}
        onPress={() => navigation.navigate('HistoryPage')}
      >
        <Text style={[styles.globalText , tw`text-white text-center font-bold`]}>
          ประวัติการใช้บริการ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[{height: height * 0.05 , width: width * 0.5},tw`bg-red-500 items-center justify-center rounded-lg`]}
        onPress={() => navigation.navigate('HistoryPage')}
      >
        <Text style={[styles.globalText , tw`text-white text-center font-bold`]}>ลงชื่อออก</Text>
      </TouchableOpacity>
      
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular'
  },
});

export default UserProfile
