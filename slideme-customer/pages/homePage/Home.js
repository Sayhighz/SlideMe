import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../../UserContext";

// นำเข้าคอมโพเนนต์ย่อย
import Header from "../../components/home/Header";
import MainButton from "../../components/home/MainButton";
import AdsSwiper from "../../components/home/AdsSwiper";
import ActionButtons from "../../components/home/ActionButtons";
import RecentActivity from "../../components/home/RecentActivity";

// เมื่อนำไปใช้จริง ให้แน่ใจว่าได้นำเข้าฟังก์ชันที่จำเป็น
// import { checkOrderStatus } from "../../utils/homeUtils";

// กำหนดค่าคงที่ของธีม
const COLORS = {
  primary: "#4CAF50",
  secondary: "#2E7D32",
  accent: "#FF9800",
  text: "#333333",
  lightText: "#FFFFFF",
  background: "#F5F9F6",
  card: "#FFFFFF",
};

const Home = ({ navigation }) => {
  const { userData } = useContext(UserContext);
  const { width, height } = Dimensions.get("window");
  
  useEffect(() => {
    // เช็คสถานะการเรียกรถเมื่อหน้าโหลด
    // handleOrderStatus();
  }, [userData]);
  
  // ฟังก์ชันตรวจสอบสถานะการเรียกรถ
  const handleOrderStatus = () => {
    checkOrderStatus(userData, navigation);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.container}>
        <Header userData={userData} navigation={navigation} />
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ปุ่มเรียกรถหลัก */}
          <View style={styles.sectionContainer}>
            <MainButton navigation={navigation} />
          </View>
          
          {/* แบนเนอร์โฆษณา */}
          <View style={styles.sectionContainer}>
            <AdsSwiper />
          </View>
          
          {/* ปุ่มบริการเพิ่มเติม */}
          {/* <View style={styles.sectionContainer}>
            <ActionButtons navigation={navigation} />
          </View> */}
          
          {/* กิจกรรมล่าสุด (ถ้ามี component นี้) */}
          {RecentActivity && (
            <View style={styles.sectionContainer}>
              <RecentActivity navigation={navigation} />
            </View>
          )}
          
          {/* เพิ่มพื้นที่ด้านล่างเพื่อให้เลื่อนได้สุด */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary, // สีเขียวหลัก (สำหรับส่วน status bar)
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // สีพื้นหลังอ่อนๆ
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    marginVertical: 8,
  }
});

export default Home;