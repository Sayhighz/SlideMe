import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { Menu, Divider } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";

const VehicleTypeSelector = ({ 
  category, 
  menuVisible, 
  setMenuVisible, 
  vehicleTypes,
  selectCategory,
  isLoading
}) => {
  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        contentStyle={styles.menuContent}
        anchor={
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.selector}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5
                name="car-side"
                size={24}
                color="#4B5563"
              />
            </View>
            <Text style={styles.labelText}>ประเภทรถ</Text>
            <Text style={styles.valueText}>
              {category ? category : "เลือกประเภทรถ"}
            </Text>
            
            {isLoading ? (
              <ActivityIndicator size="small" color="#60B876" style={styles.icon} />
            ) : (
              <FontAwesome5
                name="chevron-down"
                size={16}
                color="#9CA3AF"
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        }
      >
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>เลือกประเภทรถ</Text>
        </View>
        <Divider />
        
        {vehicleTypes && vehicleTypes.length > 0 ? (
          vehicleTypes.map((option, index) => (
            <React.Fragment key={option.vehicletype_id}>
              <Menu.Item
                onPress={() => selectCategory(option.vehicletype_id, option.vehicletype_name)}
                title={option.vehicletype_id + " - " + option.vehicletype_name}
                style={styles.menuItem}
                titleStyle={styles.menuItemText}
              />
              {index < vehicleTypes.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Menu.Item
            title={isLoading ? "กำลังโหลด..." : "ไม่พบข้อมูลประเภทรถ"}
            disabled
            style={styles.menuItem}
            titleStyle={styles.menuItemText}
          />
        )}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  selector: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  valueText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: '#1F2937',
    paddingRight: 24,
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: Platform.OS === 'ios' ? 0 : -8,
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
    maxHeight: 300,
    marginTop: Platform.OS === 'ios' ? 10 : 50,
  },
  menuHeader: {
    padding: 12,
    alignItems: 'center',
  },
  menuTitle: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  menuItem: {
    height: 50,
    justifyContent: 'center',
  },
  menuItemText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: '#4B5563',
  }
});

export default VehicleTypeSelector;