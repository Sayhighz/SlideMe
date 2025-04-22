import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Dimensions } from "react-native";
import { UserContext } from "../../UserContext";

// นำเข้าคอมโพเนนต์ย่อย
import Header from "../../components/home/Header";
import MainButton from "../../components/home/MainButton";
import AdsSwiper from "../../components/home/AdsSwiper";
import ActionButtons from "../../components/home/ActionButtons";
import RecentActivity from "../../components/home/RecentActivity";

// เมื่อนำไปใช้จริง ให้แน่ใจว่าได้นำเข้าฟังก์ชันที่จำเป็น
import { checkOrderStatus } from "../../utils/homeUtils";

// นำเข้าค่าคงที่ของธีม (ถ้ามี)
import { COLORS } from "../../components/home/Theme";

const Home = ({ navigation }) => {
  const { userData } = useContext(UserContext);
  const { width, height } = Dimensions.get("window");
  
  useEffect(() => {
    // เช็คสถานะการเรียกรถเมื่อหน้าโหลด
    handleOrderStatus();
  }, [userData]);
  
  // ฟังก์ชันตรวจสอบสถานะการเรียกรถ
  const handleOrderStatus = () => {
    checkOrderStatus(userData, navigation);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar backgroundColor={COLORS ? COLORS.primary : "#4CAF50"} barStyle="light-content" />
      <View style={styles.container}>
        <Header userData={userData} navigation={navigation} />
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <MainButton navigation={navigation} />
          <AdsSwiper />
          <ActionButtons navigation={navigation} />
          <RecentActivity navigation={navigation} />
          
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
    backgroundColor: "#4CAF50", // สีเขียวหลัก (สำหรับส่วน status bar)
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F9F6", // สีพื้นหลังอ่อนๆ
  },
  scrollContent: {
    paddingBottom: 20,
  }
});

export default Home;