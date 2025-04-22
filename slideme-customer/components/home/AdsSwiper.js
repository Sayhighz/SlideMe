import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const AdsSwiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.85;
  
  // สีหลักที่ใช้
  const COLORS = {
    primary: "#4CAF50",
    primaryDark: "#388E3C",
    accent: "#FF5722",
    white: "#FFFFFF",
  };
  
  // ข้อมูลโปรโมชัน
  const promotions = [
    {
      id: 1,
      title: "โปรโมชั่นพิเศษ",
      description: "ลด 20% เมื่อเรียกรถสไลด์วันนี้!",
      icon: "local-offer",
      gradient: [COLORS.primary, COLORS.primaryDark]
    },
    {
      id: 2,
      title: "สมัครสมาชิกใหม่",
      description: "รับเครดิตฟรี 100 บาท",
      icon: "card-giftcard",
      gradient: ["#5C6BC0", "#3949AB"]
    },
    {
      id: 3,
      title: "ฟีเจอร์ใหม่",
      description: "จองรถล่วงหน้าได้แล้ววันนี้",
      icon: "event-available",
      gradient: [COLORS.accent, "#E64A19"]
    }
  ];
  
  // การจัดการ scroll event
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (cardWidth + 16));
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={cardWidth + 16}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
      >
        {promotions.map((promo) => (
          <TouchableOpacity 
            key={promo.id}
            style={[styles.promoCard, { width: cardWidth }]}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={promo.gradient}
              style={styles.promoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* เนื้อหาโปรโมชัน */}
              <View style={styles.promoContent}>
                <View style={styles.promoIconContainer}>
                  <MaterialIcons name={promo.icon} size={20} color={COLORS.white} />
                </View>
                <Text style={styles.promoTitle}>{promo.title}</Text>
                <Text style={styles.promoDescription}>{promo.description}</Text>
                <View style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>ดูรายละเอียด</Text>
                  <MaterialIcons name="arrow-forward" size={12} color={COLORS.white} />
                </View>
              </View>
              
              {/* ไอคอนด้านขวา */}
              <View style={styles.promoIconRight}>
                <MaterialIcons name="emoji-transportation" size={70} color={COLORS.white} style={{ opacity: 0.7 }} />
              </View>
              
              {/* เอฟเฟกต์วงกลม */}
              <View style={[styles.circleEffect, { right: -30, top: -30, width: 120, height: 120 }]} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* ตัวบอกตำแหน่งสไลด์ (pagination dots) */}
      <View style={styles.paginationContainer}>
        {promotions.map((_, index) => (
          <View 
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.activePaginationDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  promoCard: {
    height: 140,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  promoGradient: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    position: "relative",
  },
  promoContent: {
    flex: 1,
    justifyContent: "center",
  },
  promoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Mitr-Regular",
    marginBottom: 4,
  },
  promoDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Mitr-Regular",
    opacity: 0.9,
    marginBottom: 8,
  },
  promoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Mitr-Regular",
    marginRight: 4,
  },
  promoIconRight: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  circleEffect: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },
  activePaginationDot: {
    width: 16,
    height: 8,
    backgroundColor: "#4CAF50",
  },
});

export default AdsSwiper;