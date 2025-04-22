import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// ค่าคงที่สี
const COLORS = {
  primary: "#4CAF50",
  secondary: "#2E7D32",
  accent: "#FF9800",
  text: "#333333",
  lightText: "#FFFFFF",
  background: "#F5F9F6",
  card: "#FFFFFF",
};

const Header = ({ userData, navigation }) => {
  // ฟังก์ชันสำหรับนำทางไปยังโปรไฟล์ผู้ใช้
  const goToProfile = () => {
    navigation.navigate("โปรไฟล์ผู้ใช้");
  };
  
  // ฟังก์ชันสำหรับเปิดการแจ้งเตือน
  const openNotifications = () => {
    // ในอนาคตสามารถใส่การนำทางไปยังหน้าแจ้งเตือนได้
    console.log("Notifications button pressed");
  };

  return (
    <View style={styles.container}>
      {/* ส่วนข้อมูลผู้ใช้ */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>
            {userData?.first_name ? userData.first_name.charAt(0).toUpperCase() : "S"}
          </Text>
        </View>
        
        <View style={styles.userGreeting}>
          <Text style={styles.greetingText}>สวัสดี,</Text>
          <Text style={styles.userName}>
            {userData?.first_name || userData?.phone_number || "คุณ"}!
          </Text>
        </View>
      </View>
      
      {/* ส่วนปุ่มด้านขวา */}
      <View style={styles.actionsContainer}>
        {/* ปุ่มการแจ้งเตือน */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={openNotifications}
        >
          <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
          {/* แต้มแจ้งเตือน (ถ้ามี) */}
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        
        {/* ปุ่มโปรไฟล์ */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={goToProfile}
        >
          <MaterialIcons name="person" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitial: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.lightText,
  },
  userGreeting: {
    justifyContent: "center",
  },
  greetingText: {
    fontSize: 14,
    color: "#666666",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#F44336",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  badgeText: {
    color: COLORS.lightText,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default Header;