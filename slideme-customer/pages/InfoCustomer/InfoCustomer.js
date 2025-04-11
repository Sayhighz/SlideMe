// InfoCustomer.js
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, Modal, ImageBackground, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IP_ADDRESS } from '../../config';
import { useContext } from 'react'; // Import useContext
import { UserContext } from '../../UserContext'; // Import UserContext

const InfoCustomer = ({ onLogin }) => {
    const route = useRoute();
    const phoneNumber = route.params?.phoneNumber || '';
    const { setUserData } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [modalVisible, setModalVisible] = useState(true); // Modal is immediately visible
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [termsModalVisible, setTermsModalVisible] = useState(false); // modal เงื่อนไข

    const handleConfirm = async () => {
        if (!isTermsAccepted) {
            Alert.alert("ต้องยอมรับเงื่อนไข", "กรุณายอมรับเงื่อนไขก่อนดำเนินการต่อ");
            return;
        }
    
        if (!name || !email || !lastname) {
            Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
            return;
        }
    
        try {
            const response = await fetch(`http://${IP_ADDRESS}:4000/api/v1/customer/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    email: email,
                    username: username,
                    first_name: name,
                    last_name: lastname
                })
            });
    
            const result = await response.json();
            console.log("Response:", result);
    
            if (result.Status && result.customer_id) {
                Alert.alert("สำเร็ข", "สมัครมาชิคสำเร็จ ยินดีต้อนรับ!");
    
                const userData = {
                    customer_id: result.customer_id,
                    phone_number: phoneNumber,
                    email: email,
                    username: username,
                    first_name: name,
                    last_name: lastname,
                };
                setUserData(userData);
                onLogin();
            } else {
                Alert.alert("Error", result.Error || "User ID missing in response");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            Alert.alert("Error", "Failed to add user data");
        }
    
        setModalVisible(false);
    };
    
    const handleSkip = async () => {
        if (!isTermsAccepted) {
            Alert.alert("ต้องยอมรับเงื่อนไข", "กรุณายอมรับเงื่อนไขก่อนดำเนินการต่อ");
            return;
        }
    
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
                Alert.alert("สำเร็จ", "สมัครมาชิคสำเร็จ ยินดีต้อนรับ!");
    
                const userData = {
                    customer_id: result.customer_id,
                    phone_number: phoneNumber,
                };
                setUserData(userData);
                onLogin();
            } else {
                Alert.alert("Error", result.Error || "User ID missing in response");
            }
        } catch (error) {
            console.error("Fetch Error on Skip:", error);
            Alert.alert("Error", "ล้มเหลวในการเพิ่ม User Data");
        }
    
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
            {/* Modal Component */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`flex-1 justify-center items-center bg-black/40`}>
                        {/* Background with SlideME logo */}

                        <View style={tw`bg-white rounded-lg p-6 w-4/5`}>
                            <Text style={[styles.globalText, tw`text-xl font-bold text-center bg-[#60B879] text-white p-2 rounded-[100px]`]}> SLIDE ME </Text>
                            <Text style={[styles.globalText, tw`text-lg font-bold text-center mb-4`]}>กรอกข้อมูลส่วนตัว</Text>
                            <Text style={[styles.globalText, tw`text-gray-800 font-bold`]}>ชื่อ:</Text>
                            <TextInput
                                style={tw`border bg-gray-50 rounded-lg w-full p-2 mb-4`}
                                placeholder="กรอกชื่อจริง"
                                value={name}
                                onChangeText={setName}
                                required
                            />
                            <Text style={[styles.globalText, tw`text-gray-800 font-bold`]}>นามสกุล:</Text>
                            <TextInput
                                style={tw`border rounded-lg bg-gray-50 w-full p-2 mb-4`}
                                placeholder="กรอกนามสกุล"
                                value={lastname}
                                onChangeText={setLastName}
                            />
                            {/* <Text style={[styles.globalText, tw`text-gray-800 font-bold`]}>ชื่อผู้ใช้:<Text style={[styles.globalText, tw`text-gray-600 text-sm ml-2`]}>*ไม่จำเป็น</Text></Text>
                            <TextInput
                                style={tw`border rounded-lg bg-gray-50 w-full p-2 mb-4`}
                                placeholder="กรอกชื่อผู้ใช้"
                                value={username}
                                onChangeText={setUserName}
                                keyboardType='default'
                            /> */}
                            <Text style={[styles.globalText, tw`text-gray-800 font-bold`]}>อีเมลล์:</Text>
                            <TextInput
                                style={tw`border bg-gray-50 rounded-lg w-full p-2 mb-4`}
                                placeholder="กรอกอีเมลล์"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <Text style={[styles.globalText, tw`text-gray-800 font-bold`]}>เบอร์โทร:</Text>
                            <TextInput
                                style={tw`border rounded-lg bg-gray-200 w-full p-2 mb-2`}
                                value={phoneNumber}
                                editable={false}
                                keyboardType="phone-pad"
                            />
                            <TouchableOpacity
    style={tw`flex-row items-center mt-4`}
    onPress={() => setIsTermsAccepted(!isTermsAccepted)}
>
    <View
        style={tw`w-6 h-6 border-2 border-gray-300 rounded mr-2 ${isTermsAccepted ? 'bg-green-500' : 'bg-white'}`}
    />
    <Text style={[styles.globalText]}>
        ยอมรับเงื่อนไข SLIDEME 
        <Text onPress={() => setTermsModalVisible(true)} style={tw`text-blue-600 underline ml-2`}>(อ่าน)</Text>
    </Text>
</TouchableOpacity>
<Modal
    animationType="slide"
    transparent={true}
    visible={termsModalVisible}
    onRequestClose={() => setTermsModalVisible(false)}
>
    <View style={tw`flex-1 justify-center items-center bg-black/40`}>
        <View style={tw`bg-white rounded-lg p-6 w-4/5`}>
            <Text style={[styles.globalText, tw`text-lg font-bold text-center mb-4`]}>เงื่อนไขการใช้บริการ SLIDEME</Text>
            <Text style={[styles.globalText, tw`text-gray-700 mb-4`]}>
                - ข้อมูลที่คุณให้จะใช้เพื่อสร้างบัญชีและบริการให้คุณอย่างปลอดภัย{'\n'}
                - เราจะไม่เปิดเผยข้อมูลของคุณโดยไม่ได้รับความยินยอม{'\n'}
                - ผู้ใช้ต้องปฏิบัติตามนโยบายการใช้งานอย่างเคร่งครัด
            </Text>
            <TouchableOpacity
                style={tw`bg-green-500 rounded-lg p-3`}
                onPress={() => setTermsModalVisible(false)}
            >
                <Text style={[styles.globalText, tw`text-white font-bold text-center`]}>ปิด</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
                            <View style={tw`flex-row justify-around mt-4`}>
                                <TouchableOpacity
                                    style={tw`bg-gray-400 rounded-lg p-3 w-1/3`}
                                    onPress={handleSkip}
                                >
                                    <Text style={[styles.globalText, tw`text-center font-bold text-white`]}>ข้าม</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={tw`bg-[#60B876] rounded-lg p-3 w-1/3`}
                                    onPress={handleConfirm}
                                >
                                    <Text style={[styles.globalText, tw`text-white font-bold text-center`]}>ยืนยัน</Text>
                                </TouchableOpacity>
        
                            </View>
                        </View>
                        {/* </ImageBackground> */}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    globalText: {
        fontFamily: 'Mitr-Regular',
    },
});

export default InfoCustomer;
