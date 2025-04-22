import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const RecentActivity = ({ navigation }) => {
  // ข้อมูลกิจกรรมล่าสุด (ในการใช้งานจริงควรดึงจาก API)
  const activities = [
    {
      id: 1,
      type: "ride",
      title: "การเดินทางล่าสุด",
      description: "บางนา - อโศก • 120 บาท",
      time: "วันนี้, 14:30",
      icon: "directions-car",
      color: "#4CAF50"
    },
    {
      id: 2,
      type: "payment",
      title: "การชำระเงิน",
      description: "เติมเงินในบัญชี • 500 บาท",
      time: "เมื่อวาน, 10:15",
      icon: "payment",
      color: "#3949AB"
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>กิจกรรมล่าสุด</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("ประวัติการใช้บริการ")}
        >
          <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
          <MaterialIcons name="chevron-right" size={16} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {activities.map((activity) => (
        <TouchableOpacity 
          key={activity.id}
          style={styles.activityCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("ActivityDetail", { activityId: activity.id })}
        >
          <View 
            style={[
              styles.activityIconContainer,
              { backgroundColor: `${activity.color}15` } // ใช้สีเดียวกับไอคอนแต่ความโปร่งแสง 15%
            ]}
          >
            <MaterialIcons name={activity.icon} size={24} color={activity.color} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDescription}>{activity.description}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#BDBDBD" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#212121",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Mitr-Regular",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#4CAF50",
    fontSize: 14,
    fontFamily: "Mitr-Regular",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Mitr-Regular",
  },
  activityDescription: {
    color: "#757575",
    fontSize: 14,
    fontFamily: "Mitr-Regular",
    marginTop: 2,
  },
  activityTime: {
    color: "#9E9E9E",
    fontSize: 12,
    fontFamily: "Mitr-Regular",
    marginTop: 2,
  },
});

export default RecentActivity;