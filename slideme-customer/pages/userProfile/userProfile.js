// UserProfile.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { UserContext } from "../../UserContext";
import { IP_ADDRESS } from "../../config";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

// กำหนดสีหลักของแอป
const PRIMARY_COLOR = "#60B876";
const PRIMARY_DARK = "#4C9A61";
const PRIMARY_LIGHT = "#7DC990";
const PRIMARY_GRADIENT = [PRIMARY_COLOR, PRIMARY_DARK];
const LOGOUT_COLOR = "#F85C50";

const UserProfile = ({ navigation, onLogout }) => {
  const { userData, setUserData } = useContext(UserContext);
  const [firstName, setFirstName] = useState(userData.first_name || "");
  const [lastName, setLastName] = useState(userData.last_name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (userData.phone_number) {
      return userData.phone_number.slice(-2);
    } else {
      return "?";
    }
  };

  // Save profile data
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/edit_profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            user_id: userData.user_id,
          }),
        }
      );
      
      if (!response.ok) {
        Alert.alert("ผิดพลาด", `เกิดข้อผิดพลาด: ${response.status}`);
        return;
      }
      
      const result = await response.json();
      if (result.Status) {
        setUserData({
          ...userData,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
        });
        Alert.alert("สำเร็จ", "บันทึกข้อมูลสำเร็จ");
      } else {
        Alert.alert("ผิดพลาด", result.Error || "ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (error) {
      Alert.alert("ผิดพลาด", error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation button component
  const NavButton = ({ icon, title, onPress, color, disabled = false }) => (
    <TouchableOpacity
      style={[
        tw`py-3 rounded-xl mb-3`,
        { backgroundColor: color || PRIMARY_COLOR },
        styles.buttonShadow,
        disabled && tw`opacity-50`
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <View style={tw`flex-row items-center justify-center`}>
        <Ionicons name={icon} size={22} color="white" />
        <Text style={[styles.buttonText, tw`text-white text-left ml-2`]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderWithBackButton 
        showBackButton={false} 
        title="ข้อมูลส่วนตัว" 
        backgroundColor={PRIMARY_COLOR}
        titleColor="white"
      />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['bottom']}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-8`}
          >
            {/* Profile Header */}
            <LinearGradient
              colors={PRIMARY_GRADIENT}
              style={tw`pt-4 pb-8 px-5 rounded-b-3xl`}
            >
              <View style={tw`flex-row items-center`}>
                {/* Profile Picture */}
                <View
                  style={[
                    tw`w-24 h-24 rounded-full items-center justify-center mr-4 border-4 border-white`,
                    styles.avatarShadow,
                  ]}
                >
                  <Text style={styles.initialsText}>
                    {getUserInitials()}
                  </Text>
                </View>

                {/* User Info */}
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-white text-xl font-bold mb-1`, styles.nameText]}>
                    {userData.first_name ? `${userData.first_name} ${userData.last_name || ""}` : userData.phone_number}
                  </Text>
                  
                  <View style={tw`flex-row items-center`}>
                    <Ionicons name="call" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={[tw`text-white text-sm ml-1 opacity-90`, styles.globalText]}>
                      {userData.phone_number || "ไม่ระบุเบอร์โทรศัพท์"}
                    </Text>
                  </View>
                  
                  {userData.email && (
                    <View style={tw`flex-row items-center mt-1`}>
                      <Ionicons name="mail" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={[tw`text-white text-sm ml-1 opacity-90`, styles.globalText]} numberOfLines={1}>
                        {userData.email}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>

            {/* White Card with Info */}
            <View style={[tw`mx-5 -mt-5 bg-white rounded-xl p-5`, styles.cardShadow]}>
              <Text style={[tw`text-gray-700 mb-3 font-bold`, styles.sectionTitle]}>
                รายละเอียดบัญชี
              </Text>
              
              <View style={tw`mb-2`}>
                <Text style={[tw`text-gray-500 text-xs mb-1`, styles.globalText]}>ชื่อ-นามสกุล</Text>
                <Text style={[tw`text-gray-800`, styles.globalText]}>
                  {userData.first_name && userData.last_name 
                    ? `${userData.first_name} ${userData.last_name}` 
                    : "ยังไม่ได้ระบุ"}
                </Text>
              </View>
              
              <View style={tw`mb-2`}>
                <Text style={[tw`text-gray-500 text-xs mb-1`, styles.globalText]}>อีเมล</Text>
                <Text style={[tw`text-gray-800`, styles.globalText]}>
                  {userData.email || "ยังไม่ได้ระบุ"}
                </Text>
              </View>
              
              <View>
                <Text style={[tw`text-gray-500 text-xs mb-1`, styles.globalText]}>เบอร์โทรศัพท์</Text>
                <Text style={[tw`text-gray-800`, styles.globalText]}>
                  {userData.phone_number || "ยังไม่ได้ระบุ"}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={tw`mx-5 mt-5`}>
              <Text style={[tw`text-gray-700 mb-3 font-bold`, styles.sectionTitle]}>
                การจัดการบัญชี
              </Text>
              
              <NavButton 
                icon="create-outline" 
                title="แก้ไขข้อมูลผู้ใช้" 
                onPress={() => navigation.navigate("editProfile")} 
              />
              
              {/* <NavButton 
                icon="heart-outline" 
                title="รายการโปรด" 
                onPress={() => navigation.navigate("Bookmarklist")} 
              /> */}
              
              <NavButton 
                icon="card-outline" 
                title="ช่องทางการชำระเงิน" 
                onPress={() => navigation.navigate("PaymentMethodsStack")} 
              />
              
              <NavButton 
                  icon="log-out-outline" 
                  title="ออกจากระบบ" 
                  onPress={onLogout}
                  color={LOGOUT_COLOR}
                />
        
            </View>
          </ScrollView>
          
          {isLoading && (
            <View style={tw`absolute inset-0 bg-black/30 items-center justify-center`}>
              <View style={tw`bg-white p-4 rounded-xl`}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <Text style={[styles.globalText, tw`mt-2 text-gray-700`]}>กำลังดำเนินการ...</Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  nameText: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
    fontSize: 18,
    color: "#4C9A61", // ใช้สีเข้มของสีหลักเพื่อความสวยงาม
  },
  buttonText: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
    fontSize: 16,
  },
  initialsText: {
    fontFamily: Platform.OS === 'ios' ? 'Mitr-Regular' : 'Mitr-Regular',
    fontSize: 28,
    color: 'white',
    letterSpacing: 1,
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#60B876',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
    backgroundColor: "#60B876", // ใช้สีหลักเสมอสำหรับรูปโปรไฟล์
  },
});

export default UserProfile;