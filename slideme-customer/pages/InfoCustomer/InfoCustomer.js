// InfoCustomer.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { IP_ADDRESS } from '../../config';
import { UserContext } from '../../UserContext';
// import { tokens } from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';

const InfoCustomer = ({ onLogin }) => {
  const route = useRoute();
  const phoneNumber = route.params?.phoneNumber || '';
  const { setUserData } = useContext(UserContext);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lastname, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(true);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  // Form validation
  const [errors, setErrors] = useState({
    name: '',
    lastname: '',
    email: '',
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', lastname: '', email: '' };

    if (!name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
      isValid = false;
    }

    if (!lastname.trim()) {
      newErrors.lastname = 'กรุณากรอกนามสกุล';
      isValid = false;
    }

    if (email.trim() && !validateEmail(email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = async () => {
    if (!isTermsAccepted) {
      Alert.alert("ต้องยอมรับเงื่อนไข", "กรุณายอมรับเงื่อนไขก่อนดำเนินการต่อ");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://${IP_ADDRESS}:4000/api/v1/customer/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          email: email.trim(),
          username: username.trim(),
          first_name: name.trim(),
          last_name: lastname.trim()
        })
      });

      const result = await response.json();
      console.log("Response:", result);

      if (result.Status && result.customer_id) {
        const userData = {
          customer_id: result.customer_id,
          phone_number: phoneNumber,
          email: email.trim(),
          username: username.trim(),
          first_name: name.trim(),
          last_name: lastname.trim(),
          token: result.token
        };
        setUserData(userData);
        Alert.alert("สำเร็จ", "สมัครสมาชิกสำเร็จ ยินดีต้อนรับ!");
        onLogin();
      } else {
        Alert.alert("ผิดพลาด", result.Error || "ไม่พบข้อมูลผู้ใช้ในการตอบกลับ");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("ผิดพลาด", "ล้มเหลวในการเพิ่มข้อมูลผู้ใช้");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const handleSkip = async () => {
    if (!isTermsAccepted) {
      Alert.alert("ต้องยอมรับเงื่อนไข", "กรุณายอมรับเงื่อนไขก่อนดำเนินการต่อ");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://${IP_ADDRESS}:4000/api/v1/customer/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
        })
      });

      const result = await response.json();
      console.log("Response on Skip:", result);

      if (result.Status && result.customer_id) {
        const userData = {
          customer_id: result.customer_id,
          phone_number: phoneNumber,
          token: result.token
        };
        setUserData(userData);
        Alert.alert("สำเร็จ", "สมัครสมาชิกสำเร็จ ยินดีต้อนรับ!");
        onLogin();
      } else {
        Alert.alert("ผิดพลาด", result.Error || "ไม่พบข้อมูลผู้ใช้ในการตอบกลับ");
      }
    } catch (error) {
      console.error("Fetch Error on Skip:", error);
      Alert.alert("ผิดพลาด", "ล้มเหลวในการเพิ่มข้อมูลผู้ใช้");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const renderTermsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={termsModalVisible}
      onRequestClose={() => setTermsModalVisible(false)}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={[
          tw`bg-white rounded-2xl p-6 w-10/12 max-w-md`,
          styles.shadowProp
        ]}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={[styles.globalText, tw`text-xl font-bold text-gray-800`]}>เงื่อนไขการใช้บริการ</Text>
            <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color="#60B879" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={tw`max-h-96`}>
            <Text style={[styles.globalText, tw`text-base text-gray-700 mb-3`]}>
              <Text style={tw`font-bold`}>1. การยอมรับข้อกำหนด</Text>{'\n'}
              เมื่อคุณใช้บริการของ SLIDEME คุณตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขเหล่านี้
            </Text>
            
            <Text style={[styles.globalText, tw`text-base text-gray-700 mb-3`]}>
              <Text style={tw`font-bold`}>2. การเก็บข้อมูลส่วนบุคคล</Text>{'\n'}
              - ข้อมูลที่คุณให้จะถูกใช้เพื่อสร้างบัญชีและให้บริการแก่คุณ{'\n'}
              - เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณโดยไม่ได้รับความยินยอม{'\n'}
              - ข้อมูลจะถูกจัดเก็บอย่างปลอดภัยตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
            </Text>
            
            <Text style={[styles.globalText, tw`text-base text-gray-700 mb-3`]}>
              <Text style={tw`font-bold`}>3. การใช้บริการ</Text>{'\n'}
              - ผู้ใช้ต้องปฏิบัติตามนโยบายการใช้งานอย่างเคร่งครัด{'\n'}
              - ห้ามใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมายหรือละเมิดสิทธิของผู้อื่น{'\n'}
              - เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีที่ละเมิดข้อกำหนด
            </Text>
            
            <Text style={[styles.globalText, tw`text-base text-gray-700 mb-3`]}>
              <Text style={tw`font-bold`}>4. การเปลี่ยนแปลงข้อกำหนด</Text>{'\n'}
              SLIDEME อาจปรับปรุงข้อกำหนดเป็นครั้งคราว โดยจะแจ้งให้ผู้ใช้ทราบผ่านแอปพลิเคชัน
            </Text>
          </ScrollView>
          
          <TouchableOpacity
            style={[
              tw`bg-[#60B879] rounded-xl p-3 mt-4`,
              styles.buttonShadow
            ]}
            onPress={() => {
              setIsTermsAccepted(true);
              setTermsModalVisible(false);
            }}
          >
            <Text style={[styles.globalText, tw`text-white font-bold text-center text-lg`]}>ยอมรับเงื่อนไข</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const InputField = ({ label, placeholder, value, onChangeText, keyboardType, editable, error, isRequired }) => (
    <View style={tw`mb-4`}>
      <Text style={[styles.globalText, tw`text-gray-800 font-bold mb-1`]}>
        {label}{isRequired && <Text style={tw`text-red-500`}>*</Text>}
      </Text>
      <TextInput
        style={[
          tw`border rounded-xl p-3 ${editable === false ? 'bg-gray-100' : 'bg-white'}`,
          styles.input,
          error ? tw`border-red-500` : tw`border-gray-200`
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        editable={editable !== false}
        placeholderTextColor="#9CA3AF"
      />
      {error ? <Text style={[styles.globalText, tw`text-red-500 text-xs mt-1`]}>{error}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1`}
          >
            <View style={tw`flex-1 justify-center items-center bg-black/40`}>
              <View style={[
                tw`bg-white rounded-3xl p-6 w-11/12 max-w-md`,
                styles.cardShadow
              ]}>
                {/* Logo Header */}
                <View style={tw`items-center mb-6`}>
                  <LinearGradient
                    colors={['#60B879', '#3E9D5A']}
                    style={tw`rounded-full p-4 w-32 h-32 items-center justify-center`}
                  >
                    <Text style={[styles.globalText, tw`text-3xl font-bold text-white`]}>SLIDE ME</Text>
                  </LinearGradient>
                </View>
                
                <Text style={[styles.globalText, tw`text-xl font-bold text-center mb-6`]}>กรอกข้อมูลส่วนตัว</Text>
                
                <ScrollView showsVerticalScrollIndicator={false}>
                  <InputField
                    label="ชื่อ"
                    placeholder="กรอกชื่อจริง"
                    value={name}
                    onChangeText={setName}
                    error={errors.name}
                    isRequired
                  />
                  
                  <InputField
                    label="นามสกุล"
                    placeholder="กรอกนามสกุล"
                    value={lastname}
                    onChangeText={setLastName}
                    error={errors.lastname}
                    isRequired
                  />
                  
                  <InputField
                    label="อีเมลล์"
                    placeholder="กรอกอีเมลล์"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    error={errors.email}
                  />
                  
                  <InputField
                    label="เบอร์โทร"
                    value={phoneNumber}
                    editable={false}
                    keyboardType="phone-pad"
                  />
                  
                  {/* Terms & Conditions */}
                  <TouchableOpacity
                    style={tw`flex-row items-center mt-2 mb-6`}
                    onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      tw`w-6 h-6 rounded-md mr-3 items-center justify-center`,
                      isTermsAccepted ? tw`bg-[#60B879]` : tw`border-2 border-gray-300 bg-white`
                    ]}>
                      {isTermsAccepted && <Ionicons name="checkmark" size={18} color="white" />}
                    </View>
                    <Text style={[styles.globalText, tw`flex-1`]}>
                      ยอมรับเงื่อนไข SLIDEME 
                      <Text 
                        onPress={(e) => {
                          e.stopPropagation();
                          setTermsModalVisible(true);
                        }}
                        style={tw`text-[#60B879] font-bold ml-1`}
                      >
                        (อ่านเพิ่มเติม)
                      </Text>
                    </Text>
                  </TouchableOpacity>
                
                  {/* Action Buttons */}
                  <View style={tw`flex-row justify-between mt-2`}>
                    <TouchableOpacity
                      style={[
                        tw`bg-gray-200 rounded-xl py-3 px-6 flex-1 mr-3`,
                        styles.buttonShadow
                      ]}
                      onPress={handleSkip}
                      disabled={isLoading}
                    >
                      <Text style={[styles.globalText, tw`text-center font-bold text-gray-700 text-lg`]}>ข้าม</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        tw`bg-[#60B879] rounded-xl py-3 px-6 flex-1 flex-row justify-center items-center`,
                        styles.buttonShadow
                      ]}
                      onPress={handleConfirm}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={[styles.globalText, tw`text-white font-bold text-center text-lg`]}>ยืนยัน</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
      
      {renderTermsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  shadowProp: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  input: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export default InfoCustomer;