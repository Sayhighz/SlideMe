// components/payment/PromptPayQR.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, AppState } from "react-native";
import QRCode from "react-native-qrcode-svg";
import tw from "twrnc";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const PromptPayQR = ({ totalPrice, phoneNumber = "0812345678", onPaymentComplete }) => {
  const [scanStartTime, setScanStartTime] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  
  // ตรวจจับเมื่อแอปถูกเปลี่ยนสถานะ (ปิด/เปิด)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      // เมื่อแอปกลับมาจากแอปอื่น (เช่น แอปธนาคาร)
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // หากมีการตั้งเวลาการสแกนไว้ก่อนหน้านี้และกลับมาภายในเวลาที่สมเหตุสมผล
        if (scanStartTime && (Date.now() - scanStartTime) > 5000 && (Date.now() - scanStartTime) < 300000) {
          // แสดงปุ่มยืนยันการชำระเงินแบบอัตโนมัติ
          showPaymentButton();
        }
      }
      
      // บันทึกสถานะล่าสุดของแอป
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [scanStartTime]);

  // เมื่อกดที่ QR Code ให้บันทึกเวลาเริ่มสแกน
  const handleQRPress = () => {
    setScanStartTime(Date.now());
  };

  // แสดงปุ่มยืนยันการชำระเงิน
  const showPaymentButton = () => {
    if (onPaymentComplete) {
      return (
        <TouchableOpacity
          style={[
            tw`mt-3 bg-[#60B876] py-3 px-6 rounded-xl flex-row items-center justify-center`,
            Platform.select({
              ios: tw`shadow-lg`,
              android: { elevation: 4, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }
            }),
          ]}
          onPress={onPaymentComplete}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="check-circle" size={18} color="white" style={tw`mr-2`} />
          <Text style={[styles.globalText, tw`text-white font-medium`]}>
            ฉันได้ชำระเงินเรียบร้อยแล้ว
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={tw`items-center justify-center pb-2`}>
      <View style={[
        tw`bg-white p-6 rounded-3xl items-center w-full`,
        Platform.select({
          ios: tw`shadow-xl`,
          android: { elevation: 8, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }
        }),
      ]}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-center mb-5 w-full`}>
          <View style={tw`bg-[#056BD1] bg-opacity-10 p-2 rounded-full mr-3`}>
            <Image 
              source={require('../../assets/promptpay-logo.png')} 
              style={tw`w-8 h-8`} 
              resizeMode="contain"
            />
          </View>
          <View style={tw`flex-1`}>
            <Text style={[styles.globalText, tw`text-lg font-medium text-gray-800`]}>
              สแกนเพื่อชำระเงิน
            </Text>
            <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>
              PromptPay QR Payment
            </Text>
          </View>
        </View>
        
        {/* Price Display */}
        <View style={tw`bg-[#FFF9E6] px-5 py-3 rounded-xl mb-5 w-full flex-row items-center justify-between`}>
          <Text style={[styles.globalText, tw`text-[#B58B00] font-medium`]}>
            ยอดเงินที่ต้องชำระ:
          </Text>
          <Text style={[styles.globalText, tw`text-[#B58B00] font-medium text-lg`]}>
            {Number(totalPrice).toLocaleString()} บาท
          </Text>
        </View>
        
        {/* QR Code - ทำให้กดได้ */}
        <TouchableOpacity 
          style={tw`p-4 border-2 border-[#E0E0E0] rounded-2xl bg-white mb-5`}
          onPress={handleQRPress}
          activeOpacity={0.9}
        >
          <QRCode
            size={180}
            value={`https://promptpay.io/${phoneNumber}/${totalPrice}`}
            logoBackgroundColor="white"
            backgroundColor="#FFFFFF"
            color="#000000"
          />
        </TouchableOpacity>
        
        {/* Payment Reference */}
        <View style={tw`w-full mb-2`}>
          <View style={tw`flex-row items-center justify-between mb-1`}>
            <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>
              เบอร์พร้อมเพย์:
            </Text>
            <Text style={[styles.globalText, tw`text-sm text-gray-700 font-medium`]}>
              {phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
            </Text>
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>
              วันที่และเวลา:
            </Text>
            <Text style={[styles.globalText, tw`text-sm text-gray-700 font-medium`]}>
              {new Date().toLocaleString('th-TH')}
            </Text>
          </View>
        </View>
        
        {/* Notice */}
        <View style={tw`mt-1 flex-row items-center justify-center bg-gray-50 p-3 rounded-xl w-full`}>
          <FontAwesome5 name="info-circle" size={16} color="#4B5563" style={tw`mr-2`} />
          <Text style={[styles.globalText, tw`text-sm text-gray-600 text-center flex-1`]}>
            กรุณาบันทึกหลักฐานการชำระเงิน
          </Text>
        </View>
      </View>
      
      {/* Instructions - Made more compact */}
      <View style={tw`mt-4 w-full`}>
        <View style={[
          tw`bg-[#EBF5FF] p-4 rounded-2xl`,
          Platform.select({
            ios: tw`shadow-md`,
            android: { elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }
          }),
        ]}>
          <View style={tw`flex-row items-center mb-2`}>
            <MaterialIcons name="payments" size={18} color="#1E40AF" style={tw`mr-2`} />
            <Text style={[styles.globalText, tw`text-[#1E40AF] font-medium text-sm`]}>
              วิธีการชำระเงิน
            </Text>
          </View>
          
          <View style={tw`flex-row flex-wrap`}>
            <View style={tw`flex-row items-center mr-2 mb-1`}>
              <View style={tw`w-5 h-5 rounded-full bg-[#1E40AF] items-center justify-center mr-1`}>
                <Text style={[styles.globalText, tw`text-white text-xs`]}>1</Text>
              </View>
              <Text style={[styles.globalText, tw`text-[#1E40AF] text-xs`]}>
                แตะที่ QR Code
              </Text>
            </View>
            
            <View style={tw`flex-row items-center mr-2 mb-1`}>
              <View style={tw`w-5 h-5 rounded-full bg-[#1E40AF] items-center justify-center mr-1`}>
                <Text style={[styles.globalText, tw`text-white text-xs`]}>2</Text>
              </View>
              <Text style={[styles.globalText, tw`text-[#1E40AF] text-xs`]}>
                เปิดแอปธนาคาร
              </Text>
            </View>
            
            <View style={tw`flex-row items-center mr-2 mb-1`}>
              <View style={tw`w-5 h-5 rounded-full bg-[#1E40AF] items-center justify-center mr-1`}>
                <Text style={[styles.globalText, tw`text-white text-xs`]}>3</Text>
              </View>
              <Text style={[styles.globalText, tw`text-[#1E40AF] text-xs`]}>
                ชำระเงิน
              </Text>
            </View>
            
            <View style={tw`flex-row items-center mb-1`}>
              <View style={tw`w-5 h-5 rounded-full bg-[#1E40AF] items-center justify-center mr-1`}>
                <Text style={[styles.globalText, tw`text-white text-xs`]}>4</Text>
              </View>
              <Text style={[styles.globalText, tw`text-[#1E40AF] text-xs`]}>
                กลับมาที่แอป
              </Text>
            </View>
          </View>
        </View>
        
        {/* Confirm Payment Button */}
        {appStateVisible === "active" && scanStartTime && onPaymentComplete && (
          showPaymentButton()
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.select({
      ios: "Mitr-Regular",
      android: "Mitr-Regular",
      default: "System"
    }),
  },
});

export default PromptPayQR;