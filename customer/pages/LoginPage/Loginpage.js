// LoginPage.js
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SignupPage from '../SignupPage/SignupPage';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context'; // ใช้ SafeAreaView จาก react-native-safe-area-context

function LoginPage({ onLogin }) {
    const [showSignupContent, setshowSignupContent] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const { width: screenWidth } = Dimensions.get('window');

    const animateFade = (showMain) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setshowSignupContent(showMain);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleNext = () => animateFade(false);
    const handleBack = () => animateFade(true);

    return (
        <SafeAreaView style={tw`flex-1 bg-white relative`} edges={['top']}>
            <View style={tw`flex-1 justify-center items-center`}>
                <View style={[tw`rounded-lg items-center w-full h-full` ]}>
                    {!showSignupContent && (
                        <TouchableOpacity
                            style={tw`absolute top-4 left-4 p-2 z-10`}
                            onPress={handleBack}
                            accessible={true}
                            accessibilityLabel="Go Back"
                        >
                            <Icon name="arrow-left" size={20} color="#000" />
                        </TouchableOpacity>
                    )}

                    <View style={tw`p-4 items-center justify-center mt-5 flex-2`}>
                        <Text style={tw`text-6xl text-[#60B876] font-bold text-center`}>SLIDE</Text>
                        <Text style={tw`text-8xl text-[#60B876] font-bold text-center leading-none z-10`}>ME</Text>
                    </View>

                    <Animated.View
                        style={[
                            tw`border-2 border-[#60B876] rounded-3xl w-full flex-8 justify-start bg-[#60B876] items-center shadow-md shadow-black`,
                            { opacity: fadeAnim, height: screenWidth < 400 ? '80%' : '80%' }
                        ]} 
                    >
                        {showSignupContent ? (
                            <View style={tw`flex justify-center items-center mt-5 w-full `}>
                                <Text style={tw`text-xl font-bold text-white text-center `}>
                                    เรียกรถสไลด์ได้ง่าย ๆ ในไม่กี่คลิก!
                                </Text>
                                <TouchableOpacity
                                    style={tw`w-[50%] bg-transparent border-2 border-white py-3 rounded-lg mt-50`}
                                    onPress={handleNext}
                                    // accessible={true}
                                    // accessibilityLabel="Start Using"
                                >
                                    <Text style={tw`font-bold text-white text-lg text-center`}>เริ่มต้นใช้งาน</Text>
                                </TouchableOpacity>

                                <Text style={tw`mt-2 text-xs font-bold text-white`}>
                                    ข้อมูลติดต่อ/ช่วยเหลือ
                                </Text>
                            </View>

                        ) : (
                            <SignupPage onLogin={onLogin} onBack={handleBack} />
                        )}
                    </Animated.View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default LoginPage;
