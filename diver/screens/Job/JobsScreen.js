import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";

function truncateText(text, maxLength = 12) {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "ไม่ทราบระยะห่าง";

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((earthRadiusKm * c).toFixed(2)); // Return distance rounded to 2 decimal places
}

// Job Card Component
function JobCard({
  requestId,
  distance,
  origin,
  destination,
  type,
  time,
  message,
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={tw`p-4 bg-white rounded-lg mb-4 shadow-lg`}
      onPress={() =>
        navigation.navigate("JobDetail", {
          requestId,
          distance,
          origin,
          destination,
          type,
          message,
        })
      }
    >
      <Text style={[styles.globalText, tw`text-gray-800 font-bold text-lg mb-4`]}>
    ระยะทางประมาณ {distance} KM
  </Text>

  {/* Locations (Origin and Destination) */}
  <View style={tw`flex-row justify-between items-center mb-4`}>
    {/* Origin */}
    <View style={tw`flex-1 flex-row items-center`}>
      <Icon name="map-marker" size={20} color="green" />
      <Text style={[styles.globalText, tw`text-gray-600 ml-2 text-base`]}>
        {truncateText(origin)}
      </Text>
    </View>
    {/* Destination */}
    <View style={tw`flex-1 flex-row items-center justify-end`}>
      <Icon name="map-marker" size={20} color="red" />
      <Text style={[styles.globalText, tw`text-gray-600 ml-2 text-base`]}>
        {truncateText(destination)}
      </Text>
    </View>
  </View>

  {/* Type and Time */}
  <View style={tw`flex-row justify-between items-center mb-4`}>
    <Text style={[styles.globalText, tw`flex-1 text-gray-500 text-sm`]}>ประเภท: {type}</Text>
    <Text style={[styles.globalText, tw`flex-1 text-gray-500 text-sm text-right`]}>
      เวลาเริ่มงาน: {time ? time : "ไม่ระบุ"}
    </Text>
  </View>

  {/* Customer Message */}
  {message && (
    <View style={tw`mt-2`}>
      <Text style={[styles.globalText, tw`text-gray-600`]}>
        ข้อความลูกค้า: {truncateText(message)}
      </Text>
    </View>
  )}
</TouchableOpacity>
  );
}

export default function JobsScreen() {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDistance, setFilterDistance] = useState(10); // Default filter to 10km

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/auth/getRequests`
        );
        const data = await response.json();

        if (data && data.Status && Array.isArray(data.Result)) {
          setRequests(data.Result);
        } else {
          console.warn("รูปแบบข้อมูลจาก API ไม่ถูกต้อง:", data);
          setRequests([]);
        }
      } catch (error) {
        console.error("ข้อผิดพลาดในการดึงข้อมูลงาน:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on the distance filter
  const filteredRequests = requests.filter((request) => {
    const distance = calculateDistance(
      parseFloat(request.pickup_lat),
      parseFloat(request.pickup_long),
      parseFloat(request.dropoff_lat),
      parseFloat(request.dropoff_long)
    );
    return distance <= filterDistance;
  });

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header Bar */}
      <View style={tw`bg-green-500 p-4 pt-10 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.globalText, tw`text-2xl font-bold text-white ml-4`]}>
          งานวันนี้
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={tw`flex-row justify-around bg-gray-200 p-2`}>
        {[2, 5, 10].map((distance) => (
          <TouchableOpacity
            key={distance}
            style={[
              tw`p-2 rounded-lg`,
              filterDistance === distance
                ? tw`bg-green-500`
                : tw`bg-gray-200`,
            ]}
            onPress={() => setFilterDistance(distance)}
          >
            <Text
              style={[
                styles.globalText,
                tw`text-center ${
                  filterDistance === distance ? "text-white" : "text-gray-800"
                }`,
              ]}
            >
              {distance} KM
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Jobs List */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const distance = calculateDistance(
              parseFloat(request.pickup_lat),
              parseFloat(request.pickup_long),
              parseFloat(request.dropoff_lat),
              parseFloat(request.dropoff_long)
            );

            return (
              <JobCard
                key={request.request_id}
                requestId={request.request_id}
                distance={distance}
                origin={request.location_from}
                destination={request.location_to}
                type={request.vehicle_type}
                time={
                  request.booking_time
                    ? new Date(request.booking_time).toLocaleTimeString(
                        "th-TH",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "ไม่ระบุ"
                }
                message={request.customer_message}
              />
            );
          })
        ) : (
          <Text
            style={[styles.globalText, tw`text-center text-gray-500 mt-4`]}
          >
            ไม่มีงานในระยะที่เลือก
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular", // Ensure this font is loaded in your project
  },
});
