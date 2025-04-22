import React from "react";
import { TouchableOpacity, Text, View, Dimensions, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const MainButton = ({ navigation }) => {
  // สีหลักที่ใช้
  const COLORS = {
    primary: "#4CAF50",
    primaryDark: "#388E3C",
    white: "#FFFFFF",
  };

  return (
    <TouchableOpacity
      style={styles.mainButtonContainer}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("Order")}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainButtonGradient}
      >
        {/* เอฟเฟกต์วงกลม */}
        <View style={[styles.circleEffect, { top: -30, left: -30, width: 100, height: 100 }]} />
        <View style={[styles.circleEffect, { bottom: -20, right: 20, width: 80, height: 80 }]} />
        
        {/* ไอคอนรถ */}
        <View style={styles.carIconContainer}>
          <MaterialIcons name="directions-car" size={60} color={COLORS.white} />
        </View>
        
        {/* ข้อความ */}
        <View style={styles.mainButtonTextContainer}>
          <Text style={styles.mainButtonSubtext}>เรียกบริการ</Text>
          <Text style={styles.mainButtonText}>รถสไลด์</Text>
          <View style={styles.mainButtonCallToAction}>
            <Text style={styles.callToActionText}>คลิกเพื่อเรียกใช้บริการ</Text>
            <MaterialIcons name="arrow-forward" size={16} color={COLORS.white} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 5,
    borderRadius: 22,
    elevation: 10,
    shadowColor: "rgba(76, 175, 80, 0.4)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    overflow: "hidden",
  },
  mainButtonGradient: {
    flexDirection: "row",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    height: 140,
    overflow: "hidden",
    position: "relative",
  },
  circleEffect: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  carIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  mainButtonTextContainer: {
    flex: 1,
  },
  mainButtonSubtext: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Mitr-Regular",
    opacity: 0.9,
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
    fontFamily: "Mitr-Regular",
    marginBottom: 5,
  },
  mainButtonCallToAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  callToActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Mitr-Regular",
  },
});

export default MainButton;