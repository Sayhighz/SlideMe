// PhoneVerify.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Alert, 
  StyleSheet, 
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import tw from 'twrnc';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { LinearGradient } from 'expo-linear-gradient';

function PhoneVerify({ onLogin }) {
    const { setUserData } = useContext(UserContext);
    const route = useRoute();
    const navigation = useNavigation();
    const { phoneNumber, otp: initialOtp, isExistingUser, userDetails, token } = route.params;
    const [otp, setOtp] = useState(['', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState(initialOtp);
    const [cooldown, setCooldown] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeInput, setActiveInput] = useState(0);

    // ดึงค่าความกว้างของหน้าจอเพื่อใช้ในการคำนวณขนาดองค์ประกอบที่ตอบสนอง
    const { width } = Dimensions.get("window");
    const dynamicFontSize = (size) => Math.max(16, (size * width) / 375);
    const BOX_SIZE = width * 0.15; // ขนาดกล่อง OTP ที่ตอบสนองตามขนาดหน้าจอ

    const otpRefs = useRef([
      React.createRef(), 
      React.createRef(), 
      React.createRef(), 
      React.createRef()
    ]);

    // timer สำหรับการส่ง OTP ซ้ำ
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    // จัดการเมื่อมีการกรอก OTP
    const handleOtpChange = (index, value) => {
        // รับเฉพาะตัวเลข
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // ไปยังช่องถัดไปเมื่อกรอกข้อมูล หรือย้อนกลับเมื่อลบ
        if (value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].current.focus();
            setActiveInput(index + 1);
        } else if (!value && index > 0) {
            otpRefs.current[index - 1].current.focus();
            setActiveInput(index - 1);
        }
    };

    // จัดการการกดปุ่ม backspace ให้ย้อนกลับไปช่องก่อนหน้า
    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].current.focus();
            setActiveInput(index - 1);
        }
    };

    // แสดงการโหลดเมื่อกำลังตรวจสอบ OTP
    const handleLoginClick = () => {
        const enteredOtp = otp.join('');
        
        setIsSubmitting(true);
        
        // จำลองการรอที่เห็นได้ชัดเจน (ในระบบจริงอาจไม่จำเป็น)
        setTimeout(() => {
            if (enteredOtp === generatedOtp.toString()) {
                if (isExistingUser) {
                    if (userDetails) {
                        const { customer_id, phone_number, email, username, first_name, last_name, role } = userDetails;
                        
                        // บันทึกข้อมูลผู้ใช้ลง UserContext
                        setUserData({
                            customer_id,
                            phone_number,
                            email,
                            username,
                            first_name,
                            last_name,
                            role,
                            token
                        });
                    }
                    onLogin(); // เรียกฟังก์ชันล็อกอิน
                } else {
                    navigation.navigate('InfoCustomer', { phoneNumber });
                }
            } else {
                // แสดงการแจ้งเตือนเมื่อ OTP ไม่ถูกต้อง
                Alert.alert(
                    "OTP ไม่ถูกต้อง", 
                    "กรุณาตรวจสอบรหัส OTP และลองอีกครั้ง",
                    [{ text: "ตกลง", style: "default" }]
                );
                // เคลียร์ค่า OTP เมื่อกรอกผิด
                setOtp(['', '', '', '']);
                // โฟกัสที่ช่องแรก
                otpRefs.current[0].current.focus();
                setActiveInput(0);
            }
            setIsSubmitting(false);
        }, 1000); // เพิ่มการหน่วงเวลา 1 วินาที
    };
    
    // ส่ง OTP ใหม่
    const handleResendClick = () => {
        if (cooldown === 0) {
            const newOtp = Math.floor(1000 + Math.random() * 9000);
            setGeneratedOtp(newOtp);
            Alert.alert(
                "ส่งรหัส OTP แล้ว", 
                `รหัส OTP ใหม่ของคุณคือ: ${newOtp}`,
                [{ text: "ตกลง", style: "default" }]
            );
            setCooldown(60); // เวลาคูลดาวน์ 60 วินาที
            
            // เคลียร์ค่า OTP เก่า
            setOtp(['', '', '', '']);
            // โฟกัสที่ช่องแรก
            otpRefs.current[0].current.focus();
            setActiveInput(0);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[tw`flex-1 bg-white`, styles.container]}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                
                {/* Logo และส่วนหัว */}
                <View style={tw`flex-1 justify-center items-center mt-4`}>
                    <LinearGradient
                        colors={['#4CAF50', '#60B876', '#8FD3A5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={tw`rounded-full p-6 mb-4 shadow-lg`}
                    >
                        <View style={tw`items-center justify-center`}>
                            <Text style={[
                                styles.globalText,
                                tw.style("text-center", {
                                    fontSize: dynamicFontSize(40),
                                    color: "#FFFFFF",
                                    lineHeight: dynamicFontSize(42),
                                }),
                            ]}>
                                SLIDE
                            </Text>
                            <Text style={[
                                styles.globalText,
                                tw.style("text-center font-bold", {
                                    fontSize: dynamicFontSize(60),
                                    color: "#FFFFFF",
                                    lineHeight: dynamicFontSize(62),
                                }),
                            ]}>
                                ME
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* ส่วนกรอก OTP */}
                <View style={tw`flex-2 items-center p-5 bg-white rounded-t-3xl shadow-lg`}>
                    <Text style={[styles.title, tw`mb-2`]}>ยืนยันตัวตน</Text>
                    <Text style={[styles.subtitle, tw`mb-6 text-gray-500 text-center px-8`]}>
                        กรุณากรอกรหัส OTP 4 หลักที่ส่งไปยังเบอร์ {phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                    </Text>
                    
                    {/* OTP Input */}
                    <View style={tw`flex-row justify-center mb-8`}>
                        {otp.map((code, index) => (
                            <View key={index} style={tw`mx-2`}>
                                <TextInput
                                    ref={otpRefs.current[index]}
                                    style={[
                                        styles.otpInput,
                                        activeInput === index && styles.activeInput,
                                        {
                                            width: BOX_SIZE,
                                            height: BOX_SIZE,
                                            fontSize: BOX_SIZE * 0.5
                                        }
                                    ]}
                                    maxLength={1}
                                    keyboardType="numeric"
                                    value={code}
                                    onFocus={() => setActiveInput(index)}
                                    onChangeText={(value) => handleOtpChange(index, value)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    selectionColor="#60B876"
                                />
                            </View>
                        ))}
                    </View>

                    {/* ตัวเลือกรอง */}
                    <View style={tw`flex-row justify-between w-full mb-6 px-4`}>
                        <TouchableOpacity onPress={navigation.goBack}>
                            <Text style={[styles.link, tw`text-blue-500`]}>
                                แก้ไขเบอร์โทร
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={handleResendClick}
                            disabled={cooldown > 0}
                        >
                            <Text style={[
                                styles.link,
                                cooldown > 0 ? tw`text-gray-400` : tw`text-blue-500`
                            ]}>
                                {cooldown > 0 
                                    ? `ส่งรหัสอีกครั้งใน (${cooldown})` 
                                    : "ส่งรหัสอีกครั้ง"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ปุ่มยืนยัน */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            tw`mt-2 w-full`,
                            (!isOtpComplete || isSubmitting) && styles.buttonDisabled
                        ]}
                        onPress={handleLoginClick}
                        disabled={!isOtpComplete || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={[styles.buttonText]}>ยืนยัน</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    globalText: {
        fontFamily: 'Mitr-Regular',
        fontWeight: '500',
    },
    title: {
        fontFamily: 'Mitr-Medium',
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Mitr-Regular',
        fontSize: 16,
        color: '#666',
    },
    otpInput: {
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        textAlign: 'center',
        backgroundColor: '#F9F9F9',
        color: '#333333',
        fontFamily: 'Mitr-Regular',
        fontWeight: '500',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    activeInput: {
        borderColor: '#60B876',
        borderWidth: 2,
        backgroundColor: '#F0FFF4',
    },
    link: {
        fontFamily: 'Mitr-Regular',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#60B876',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#60B876',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC',
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Mitr-Medium',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PhoneVerify;