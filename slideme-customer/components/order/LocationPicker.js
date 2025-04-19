import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const LocationPicker = ({ confirmOrigin, confirmDestination, onPress }) => {
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Origin Row */}
      <View style={styles.locationRow}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="place" size={22} color="#EF4444" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.locationLabel}>ต้นทาง</Text>
          <Text style={styles.locationText}>
            {truncateText(confirmOrigin) || "โปรดระบุต้นทาง"}
          </Text>
        </View>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Destination Row */}
      <View style={styles.locationRow}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="place" size={22} color="#10B981" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.locationLabel}>ปลายทาง</Text>
          <Text style={styles.locationText}>
            {truncateText(confirmDestination) || "โปรดระบุปลายทาง"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  locationLabel: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 2,
  },
  locationText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
    marginLeft: 46,
  },
});

export default LocationPicker;