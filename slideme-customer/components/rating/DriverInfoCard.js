// components/rating/DriverInfoCard.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const DriverInfoCard = ({ driverData }) => {
  const truncateText = (text, maxLength = 22) => {
    if (typeof text !== "string") {
      return ""; // Return an empty string if text is undefined or not a string
    }
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Default avatar if no driver image is provided
  const avatarPlaceholder = "https://ui-avatars.com/api/?name=" + 
    encodeURIComponent((driverData.driver_first_name || "") + " " + (driverData.driver_last_name || "")) + 
    "&background=60B876&color=fff";

  return (
    <View
      style={[
        tw`flex bg-white p-4 rounded-lg border border-gray-300 w-full shadow-md mb-4`,
        styles.cardShadow,
      ]}
    >
      {/* Driver Header with Avatar */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-row items-center`}>
          <Image 
            source={{ uri: driverData.driver_image || avatarPlaceholder }} 
            style={tw`w-12 h-12 rounded-full mr-3 bg-gray-200`}
          />
          <View>
            <Text style={styles.driverName}>
              {`${driverData.driver_first_name || ""} ${driverData.driver_last_name || ""}`}
            </Text>
            <View style={tw`flex-row items-center`}>
              <MaterialIcons name="star" size={16} color="orange" style={tw`mr-1`} />
              <Text style={styles.ratingText}>
                {`${(parseFloat(driverData.average_rating) || 0).toFixed(1)}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`items-end`}>
          <View style={[tw`px-3 py-1 rounded-full`, styles.vehicleTypeBadge]}>
            <Text style={styles.vehicleTypeText}>{driverData.vehicletype_name || "รถยนต์"}</Text>
          </View>
          <Text style={styles.licensePlate}>{driverData.license_plate || ""}</Text>
        </View>
      </View>

      {/* Trip Details */}
      <View style={tw`border-t border-gray-200 pt-3`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={styles.sectionTitle}>รายละเอียดการเดินทาง</Text>
          <Text style={styles.priceText}>{driverData.offered_price_formatted || driverData.payment_amount || "฿0"}</Text>
        </View>

        {/* From Location */}
        <View style={tw`flex-row items-start mb-3`}>
          <View style={[tw`mr-3 mt-1`, styles.locationIconContainer]}>
            <MaterialIcons name="radio-button-on" size={18} color="#e74c3c" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={styles.locationLabel}>ต้นทาง</Text>
            <Text style={styles.locationText} numberOfLines={2} ellipsizeMode="tail">
              {driverData.location_from || ""}
            </Text>
          </View>
        </View>

        {/* Direction Line */}
        <View style={tw`flex-row items-center ml-3 pl-3 mb-3`}>
          <View style={styles.directionLine}></View>
          <View style={tw`flex-1 flex-row justify-between px-3`}>
            <Text style={styles.distanceText}>
              {driverData.trip_distance_text || driverData.distance_km || ""}
            </Text>
            <Text style={styles.durationText}>
              {driverData.estimated_duration_text || driverData.travel_time_minutes || ""}
            </Text>
          </View>
        </View>

        {/* To Location */}
        <View style={tw`flex-row items-start`}>
          <View style={[tw`mr-3 mt-1`, styles.locationIconContainer]}>
            <MaterialIcons name="location-on" size={18} color="#60B876" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={styles.locationLabel}>ปลายทาง</Text>
            <Text style={styles.locationText} numberOfLines={2} ellipsizeMode="tail">
              {driverData.location_to || ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Additional info - can be expanded if needed */}
      {driverData.customer_message && (
        <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
          <Text style={styles.noteLabel}>บันทึกเพิ่มเติม</Text>
          <Text style={styles.noteText}>{driverData.customer_message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  driverName: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  ratingText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: "#555",
  },
  vehicleTypeBadge: {
    backgroundColor: "#e6f7ed",
  },
  vehicleTypeText: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#60B876",
  },
  licensePlate: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  priceText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    fontWeight: "600",
    color: "#60B876",
  },
  locationIconContainer: {
    width: 24,
    alignItems: "center",
  },
  locationLabel: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  locationText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: "#333",
  },
  directionLine: {
    position: "absolute",
    left: 11,
    top: -10,
    bottom: -10,
    width: 2,
    backgroundColor: "#ddd",
  },
  distanceText: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#666",
  },
  durationText: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#666",
  },
  noteLabel: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  noteText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
  },
});

export default DriverInfoCard;