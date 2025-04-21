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
    Animated,
    KeyboardAvoidingView
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
    const [generatedOtp, setGeneratedOtp] = useState(initialOtp); // Store current OTP
    const [cooldown, setCooldown] = useState(0); // Cooldown state
    const [fadeIn] = useState(new Animated.Value(0));
    const [scaleIn] = useState(new Animated.Value(0.95));

    const { width, height } = Dimensions.get("window");
    const dynamicFontSize = (size) => Math.max(16, (size * width) / 375);
    const formattedPhoneNumber = phoneNumber ? phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') : '';

    const otpRefs = useRef([
        React.createRef(), 
        React.createRef(), 
        React.createRef(), 
        React.createRef()
    ]);

    useEffect(() => {
        // Animate entrance
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }),
            Animated.timing(scaleIn, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            })
        ]).start();

        // Handle OTP cooldown
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (value && !/^[0-9]$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto focus management
        if (value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].current.focus();
        } else if (!value && index > 0) {
            otpRefs.current[index - 1].current.focus();
        }
        
        // Auto-submit if all digits are filled
        if (value && index === otpRefs.current.length - 1) {
            const completeOtp = [...newOtp.slice(0, index), value].join('');
            if (completeOtp.length === 4) {
                Keyboard.dismiss();
                // Add a slight delay to give visual feedback
                setTimeout(() => handleVerifyOtp(completeOtp), 300);
            }
        }
    };

    const handleVerifyOtp = (completeOtp = otp.join('')) => {
        if (completeOtp === generatedOtp.toString()) {
            if (isExistingUser) {
                if (userDetails) {
                    const { customer_id, phone_number, email, username, first_name, last_name, role } = userDetails;
                    
                    // Save user details to UserContext
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

                // Success animation
                Animated.sequence([
                    Animated.timing(scaleIn, {
                        toValue: 1.05,
                        duration: 200,
                        useNativeDriver: true
                    }),
                    Animated.timing(scaleIn, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true
                    })
                ]).start(() => {
                    onLogin(); // Trigger the login process
                });
            } else {
                navigation.navigate('InfoCustomer', { phoneNumber });
            }
        } else {
            // Error animation
            Animated.sequence([
                Animated.timing(scaleIn, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true
                }),
                Animated.timing(scaleIn, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                })
            ]).start();
            
            Alert.alert("OTP ไม่ถูกต้อง", "กรุณาตรวจสอบ OTP อีกครั้ง");
        }
    };
    
    const handleResendClick = () => {
        if (cooldown === 0) {
            const newOtp = Math.floor(1000 + Math.random() * 9000);
            setGeneratedOtp(newOtp); // Update OTP state
            Alert.alert("New OTP Code", `OTP: ${newOtp}`);
            setCooldown(30); // Set 30 seconds cooldown
            
            // Clear current OTP input
            setOtp(['', '', '', '']);
            // Focus on first field
            otpRefs.current[0].current.focus();
        }
    };

    const handleKeyBackspace = (index, event) => {
        const { nativeEvent } = event;
        if (nativeEvent.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                otpRefs.current[index - 1].current.focus();
            }
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`flex-1 bg-white`}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={tw`flex-1`}
                >
                    <Animated.View 
                        style={[
                            tw`flex-1 justify-between`,
                            { opacity: fadeIn, transform: [{ scale: scaleIn }] }
                        ]}
                    >
                        {/* Logo Section */}
                        <View style={tw`items-center justify-center pt-8`}>
                            <TouchableOpacity
                                style={tw`absolute top-0 left-6 p-2 z-10`}
                                onPress={navigation.goBack}
                            >
                                <Text style={[styles.globalText, tw`text-gray-500 text-base`]}>แก้ไขเบอร์โทร</Text>
                            </TouchableOpacity>
                            
                            <View style={tw`items-center justify-center`}>
                                <Text
                                    style={[
                                        styles.globalText,
                                        tw.style("text-center", {
                                            fontSize: dynamicFontSize(42),
                                            color: "#60B876",
                                            lineHeight: dynamicFontSize(48),
                                        }),
                                    ]}
                                >
                                    SLIDE
                                </Text>
                                <Text
                                    style={[
                                        styles.globalText,
                                        tw.style("text-center", {
                                            fontSize: dynamicFontSize(64),
                                            color: "#60B876",
                                            lineHeight: dynamicFontSize(70),
                                            marginTop: -dynamicFontSize(10),
                                        }),
                                    ]}
                                >
                                    ME
                                </Text>
                            </View>
                        </View>

                        {/* OTP Section */}
                        <View style={tw`flex-1 items-center justify-center px-6 pb-8`}>
                            <View style={tw`w-full items-center`}>
                                <Text style={[styles.globalText, tw`text-xl text-gray-800 mb-2`]}>
                                    กรอกรหัส OTP CODE
                                </Text>
                                <Text style={[styles.globalText, tw`text-gray-500 mb-6 text-center`]}>
                                    รหัสยืนยันได้ถูกส่งไปที่หมายเลข {'\n'}
                                    <Text style={tw`text-gray-800 font-medium`}>{formattedPhoneNumber}</Text>
                                </Text>

                                <View style={tw`flex-row justify-center w-full mb-6`}>
                                    {otp.map((code, index) => (
                                        <View 
                                            key={index} 
                                            style={tw`mx-2 w-16 items-center`}
                                        >
                                            <TextInput
                                                ref={otpRefs.current[index]}
                                                style={[
                                                    styles.globalText,
                                                    tw`border-b-2 w-14 h-16 text-center text-2xl`,
                                                    code ? tw`border-[#60B876]` : tw`border-gray-300`,
                                                ]}
                                                maxLength={1}
                                                keyboardType="numeric"
                                                value={code}
                                                onChangeText={(value) => handleOtpChange(index, value)}
                                                onKeyPress={(e) => handleKeyBackspace(index, e)}
                                                selectionColor="#60B876"
                                            />
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        tw`rounded-full mt-4 w-full py-4 items-center shadow-sm`,
                                        isOtpComplete ? tw`bg-[#60B876]` : tw`bg-gray-300`
                                    ]}
                                    onPress={() => handleVerifyOtp()}
                                    disabled={!isOtpComplete}
                                >
                                    <Text style={[styles.globalText, tw`text-white text-lg font-medium`]}>
                                        ยืนยัน
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={tw`mt-4 py-2`}
                                    onPress={handleResendClick}
                                    disabled={cooldown > 0}
                                >
                                    <Text
                                        style={[
                                            styles.globalText, 
                                            cooldown > 0 ? tw`text-gray-400` : tw`text-[#60B876]`
                                        ]}
                                    >
                                        {cooldown > 0 ? `ส่งรหัสอีกครั้งใน ${cooldown} วินาที` : "ส่งรหัสอีกครั้ง"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {/* Bottom Section - Additional help */}
                        <View style={tw`items-center pb-6`}>
                            <TouchableOpacity>
                                <Text style={[styles.globalText, tw`text-sm text-gray-500`]}>
                                    ต้องการความช่วยเหลือ?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    globalText: {
        fontFamily: 'Mitr-Regular',
        includeFontPadding: false,
    },
});

export default PhoneVerify;