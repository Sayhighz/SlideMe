import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ใช้ COLORS ถ้ามีการนำเข้า หรือใช้ค่าสีโดยตรง
const COLORS = {
  primary: "#4CAF50",
  secondary: "#2E7D32",
  accent: "#FF9800",
  text: "#333333",
  lightText: "#FFFFFF",
  background: "#F5F9F6",
  card: "#FFFFFF",
};

const ActionButtons = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const buttonSize = width * 0.22; // ลดขนาดปุ่มลงเล็กน้อย
  
  // สร้างฟังก์ชันสำหรับการนำทางไปยังหน้าต่างๆ
  const navigateToHistory = () => {
    navigation.navigate("ประวัติการใช้บริการ");
  };
  
  const navigateToPayment = () => {
    navigation.navigate("payment");
  };
  
  const navigateToMessages = () => {
    navigation.navigate("กล่องข้อความ");
  };
  
  const navigateToContacts = () => {
    // สำหรับปุ่มติดต่อเรา - สามารถเพิ่มฟังก์ชันที่เหมาะสมในอนาคต
    console.log("Contact button pressed");
  };
  
  // ฟังก์ชันสร้างปุ่ม
  const renderButton = (iconName, text, onPress, backgroundColor) => (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        { width: buttonSize, height: buttonSize }
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <LinearGradient
        colors={[backgroundColor, backgroundColor + "DD"]}
        style={styles.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name={iconName} size={24} color="white" />
        </View>
        <Text style={styles.buttonText} numberOfLines={1}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* หัวข้อกล่อง */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.headerContainer}
      >
        <Text style={styles.headerText}>
          บริการเพิ่มเติม
        </Text>
      </LinearGradient>
      
      {/* กลุ่มปุ่ม */}
      <View style={styles.buttonsRow}>
        {/* ปุ่มประวัติการใช้บริการ */}
        {renderButton(
          "history", 
          "ประวัติ", 
          navigateToHistory,
          "#FF9800"
        )}
        
        {/* ปุ่มวิธีการชำระเงิน */}
        {renderButton(
          "credit-card", 
          "ชำระเงิน", 
          navigateToPayment,
          "#3F51B5"
        )}
        
        {/* ปุ่มข้อความ */}
        {renderButton(
          "email", 
          "ข้อความ", 
          navigateToMessages,
          "#00BCD4"
        )}
        
        {/* ปุ่มติดต่อเรา */}
        {renderButton(
          "call", 
          "ติดต่อเรา", 
          navigateToContacts,
          "#4CAF50"
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
});

export default ActionButtons;