// LoginPage.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  StyleSheet,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SignupPage from '../SignupPage/SignupPage';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function LoginPage({ onLogin }) {
  const [showSignupContent, setShowSignupContent] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  
  // Calculate responsive sizes
  const dynamicFontSize = (size) => Math.max(16, (size * width) / 375);
  const contentHeight = height * 0.75;
  
  // Animate both opacity and position
  const animateTransition = (showMain) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: showMain ? 100 : -100,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowSignupContent(showMain);
      slideAnim.setValue(showMain ? -100 : 100);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleNext = () => animateTransition(false);
  const handleBack = () => animateTransition(true);

  return (
    <SafeAreaView style={[tw`flex-1 bg-white`, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={tw`flex-1 justify-between items-center`}>
        {/* Logo Section */}
        <View style={tw`items-center justify-center relative w-full h-1/3`}>
          {!showSignupContent && (
            <TouchableOpacity
              style={tw`absolute top-0 left-6 p-2 z-10`}
              onPress={handleBack}
              accessible={true}
              accessibilityLabel="Go Back"
            >
              <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
          )}
          
          <View style={tw`items-center justify-center`}>
            <Text
              style={[
                styles.globalText,
                tw.style("text-center", {
                  fontSize: dynamicFontSize(48),
                  color: "#60B876",
                  lineHeight: dynamicFontSize(54),
                }),
              ]}
            >
              SLIDE
            </Text>
            <Text
              style={[
                styles.globalText,
                tw.style("text-center", {
                  fontSize: dynamicFontSize(72),
                  color: "#60B876",
                  lineHeight: dynamicFontSize(78),
                  marginTop: -dynamicFontSize(12),
                }),
              ]}
            >
              ME
            </Text>
          </View>
        </View>

        {/* Main Content Section */}
        <Animated.View
          style={[
            tw`w-full flex-1 items-center overflow-hidden`,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
              height: contentHeight,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              maxHeight: height * 0.85,
            }
          ]}
        >
          {showSignupContent ? (
            <LinearGradient
              colors={['#60B876', '#4DA060']}
              style={[
                tw`w-full h-full items-center justify-between pt-8 pb-4`,
                { borderTopLeftRadius: 30, borderTopRightRadius: 30 }
              ]}
            >
              <View style={tw`items-center px-6`}>
                <Text style={[styles.globalText, tw`text-2xl text-white text-center mb-6`]}>
                  เรียกรถสไลด์ได้ง่าย ๆ ในไม่กี่คลิก!
                </Text>
                
                {/* <View style={tw`w-full items-center justify-center mt-2`}>
                  <Image
                    source={require('../assets/app-preview.png')} // You'll need to add this image to your assets
                    style={[tw`w-full`, { height: height * 0.35, resizeMode: 'contain' }]}
                  />
                </View> */}
              <View style={tw`w-full items-center px-6 mt-40`}>
                <TouchableOpacity
                  style={tw`w-64 bg-white py-4 rounded-full shadow-md`}
                  onPress={handleNext}
                  accessible={true}
                  accessibilityLabel="Start Using"
                >
                  <Text style={[styles.globalText, tw`text-[#60B876] text-lg text-center`]}>
                    เริ่มต้นใช้งาน
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={tw`mt-4`}>
                  <Text style={[styles.globalText, tw`text-sm text-white`]}>
                    ข้อมูลติดต่อ/ช่วยเหลือ
                  </Text>
                </TouchableOpacity>
              </View>
              </View>
              
            </LinearGradient>
          ) : (
            <SignupPage onLogin={onLogin} onBack={handleBack} />
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular',
    includeFontPadding: false,
  },
});

export default LoginPage;