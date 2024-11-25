import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { UserContext } from '../../UserContext';
import { IP_ADDRESS } from '../../config';

const UserProfile = ({ navigation }) => {
  const { userData, setUserData } = useContext(UserContext);
  const [firstName, setFirstName] = useState(userData.first_name || '');
  const [lastName, setLastName] = useState(userData.last_name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [isModified, setIsModified] = useState(false);
  const [profileBgColor, setProfileBgColor] = useState('');

  const formattedPhoneNumber = userData.phone_number?.startsWith('0')
    ? userData.phone_number.substring(1)
    : userData.phone_number;

  useEffect(() => {
    const hasChanged =
      firstName !== userData.first_name ||
      lastName !== userData.last_name ||
      email !== userData.email;
    setIsModified(hasChanged);
  }, [firstName, lastName, email, userData]);

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
        setUserData({ ...userData, first_name: firstName, last_name: lastName, email });
        Alert.alert('Success', 'บันทึกข้อมูลสำเร็จ');
      } else {
        Alert.alert('Error', result.Error || 'ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF8C33'];

  useEffect(() => {
    // Randomly select a color on component mount
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setProfileBgColor(randomColor);
  }, []); // Empty dependency array ensures this runs only once on mount

  const confirmSave = () => {
    Alert.alert(
      'ยืนยันการบันทึก',
      'คุณต้องการเปลี่ยนข้อมูลจริงๆ ใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'ยืนยัน', onPress: handleSave },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={tw`flex-1 bg-gray-100`}>
        <TouchableOpacity
          style={tw`absolute top-3 right-3 p-2 rounded-lg ${isModified ? 'bg-green-500' : 'bg-gray-400'}`}
          onPress={confirmSave}
          disabled={!isModified}
        >
          <Text style={tw`text-white font-bold`}>บันทึก</Text>
        </TouchableOpacity>
        {/* Profile Picture */}
        <View style={tw`items-center mt-8`}>
          <TouchableOpacity
            style={[
              tw`w-32 h-32 rounded-full items-center justify-center`,
              { backgroundColor: profileBgColor },
            ]}
            onPress={() => {
              // Optionally change color on press
              const newColor = colors[Math.floor(Math.random() * colors.length)];
              setProfileBgColor(newColor);
            }}
          >
            <Ionicons name="person" size={70} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Information */}
        <View style={tw`mx-5 mt-6`}>
          <TextInput
            style={tw`bg-white rounded-lg p-3 mb-3 border border-gray-300`}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="ชื่อ"
          />
          <TextInput
            style={tw`bg-white rounded-lg p-3 mb-3 border border-gray-300`}
            value={lastName}
            onChangeText={setLastName}
            placeholder="นามสกุล"
          />
          <TextInput
            style={tw`bg-white rounded-lg p-3 mb-3 border border-gray-300`}
            value={email}
            onChangeText={setEmail}
            placeholder="อีเมล"
            keyboardType="email-address"
          />
          <View style={tw`flex-row items-center`}>
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

        {/* Connect Accounts */}
        <View style={tw`mx-5 mt-6`}>
          <Text style={tw`text-gray-600 font-bold mb-3`}>บัญชีอื่นที่เชื่อมต่อ</Text>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text>Facebook</Text>
            <Switch value={false} onValueChange={() => { }} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={tw`mx-5 mt-6`}>
          <TouchableOpacity
            style={tw`bg-green-500 py-3 rounded-lg mb-3`}
            onPress={() => navigation.navigate('Bookmarklist')}
          >
            <Text style={tw`text-white text-center font-bold`}>เพิ่มรายการโปรด</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-green-500 py-3 rounded-lg mb-3`}
            onPress={() => navigation.navigate('PaymentMethodsStack')}
          >
            <Text style={tw`text-white text-center font-bold`}>ช่องทางการชำระเงิน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 py-3 rounded-lg`}
            onPress={() => navigation.navigate('HistoryPage')}
          >
            <Text style={tw`text-white text-center font-bold`}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default UserProfile;
