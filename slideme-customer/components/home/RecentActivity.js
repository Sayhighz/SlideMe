import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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

// ข้อมูลจำลองสำหรับกิจกรรมล่าสุด
const recentActivities = [
  {
    id: "1",
    type: "ride",
    date: "18 เม.ย. 2025",
    status: "completed",
    from: "บ้านเลขที่ 123 ถนนสุขุมวิท",
    to: "เซ็นทรัล ลาดพร้าว",
    price: "฿180",
    icon: "directions-car"
  },
  {
    id: "2",
    type: "ride",
    date: "15 เม.ย. 2025",
    status: "completed",
    from: "สยามพารากอน",
    to: "สนามบินดอนเมือง",
    price: "฿350",
    icon: "directions-car"
  }
];

const RecentActivity = ({ navigation }) => {
  // ฟังก์ชันสำหรับไปยังหน้าประวัติทั้งหมด
  const navigateToHistory = () => {
    navigation.navigate("ประวัติการใช้บริการ");
  };
  
  // ฟังก์ชันสำหรับดูรายละเอียดการเดินทาง
  const viewOrderDetails = (item) => {
    // navigation.navigate("viewOrder", { orderId: item.id });
    console.log("กำลังพัฒนา")
  };
  
  // ฟังก์ชันสำหรับแสดงแต่ละรายการ
  const renderActivityItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.activityItem}
      onPress={() => viewOrderDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.activityHeader}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={item.icon} size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === "completed" ? "#E1F5E1" : "#FFF3E0" }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === "completed" ? COLORS.primary : COLORS.accent }
          ]}>
            {item.status === "completed" ? "เสร็จสิ้น" : "กำลังดำเนินการ"}
          </Text>
        </View>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="place" size={16} color="#F44336" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.from}
          </Text>
        </View>
        
        <View style={styles.routeLine}>
          <View style={styles.routeDot} />
          <View style={styles.routeDash} />
          <View style={styles.routeDot} />
        </View>
        
        <View style={styles.locationContainer}>
          <MaterialIcons name="place" size={16} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.to}
          </Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>ราคา:</Text>
        <Text style={styles.priceValue}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>กิจกรรมล่าสุด</Text>
        <TouchableOpacity onPress={navigateToHistory} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
          <MaterialIcons name="chevron-right" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {recentActivities.length > 0 ? (
        <FlatList
          data={recentActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={40} color="#CCCCCC" />
          <Text style={styles.emptyText}>ไม่มีกิจกรรมล่าสุด</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 4,
  },
  listContainer: {
    paddingBottom: 8,
  },
  activityItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: "#E8F5E9",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  routeContainer: {
    marginVertical: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    height: 16,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  routeDash: {
    flex: 1,
    height: 1,
    backgroundColor: "#CCCCCC",
    marginHorizontal: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  priceLabel: {
    fontSize: 14,
    color: "#666666",
    marginRight: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: "#999999",
  },
});

export default RecentActivity;