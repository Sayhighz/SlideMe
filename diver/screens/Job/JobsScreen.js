import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";

function truncateText(text, maxLength = 12) {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

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
        ระยะทางประมาณ {distance} กิโลเมตร
      </Text>

      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View style={tw`flex-1 flex-row items-center`}>
          <Icon name="map-marker" size={20} color="green" />
          <Text style={[styles.globalText, tw`text-gray-600 ml-2 text-base`]}>
            {truncateText(origin)}
          </Text>
        </View>
        <View style={tw`flex-1 flex-row items-center justify-end`}>
          <Icon name="map-marker" size={20} color="red" />
          <Text style={[styles.globalText, tw`text-gray-600 ml-2 text-base`]}>
            {truncateText(destination)}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={[styles.globalText, tw`flex-1 text-gray-500 text-sm`]}>
          ประเภท: {type}
        </Text>
        <Text
          style={[
            styles.globalText,
            tw`flex-1 text-gray-500 text-sm text-right`,
          ]}
        >
          เวลาเริ่มงาน: {time ? time : "ไม่ระบุ"}
        </Text>
      </View>

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

export default function JobsScreen({ route }) {
  const navigation = useNavigation();
  const { driver_id } = route.params || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDistance, setFilterDistance] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("latest");
  const [showSortModal, setShowSortModal] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/auth/getRequests?driver_id=${driver_id}`
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

    const intervalId = setInterval(() => {
      fetchRequests();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, [driver_id]);

  const filteredRequests = requests.filter((request) => {
    const distance = calculateDistance(
      parseFloat(request.pickup_lat),
      parseFloat(request.pickup_long),
      parseFloat(request.dropoff_lat),
      parseFloat(request.dropoff_long)
    );
    return distance <= filterDistance;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortCriteria === "latest") {
      return new Date(b.booking_time) - new Date(a.booking_time);
    }
    if (sortCriteria === "oldest") {
      return new Date(a.booking_time) - new Date(b.booking_time);
    }
    if (sortCriteria === "shortest") {
      const distanceA = calculateDistance(
        parseFloat(a.pickup_lat),
        parseFloat(a.pickup_long),
        parseFloat(a.dropoff_lat),
        parseFloat(a.dropoff_long)
      );
      const distanceB = calculateDistance(
        parseFloat(b.pickup_lat),
        parseFloat(b.pickup_long),
        parseFloat(b.dropoff_lat),
        parseFloat(b.dropoff_long)
      );
      return distanceA - distanceB;
    }
    if (sortCriteria === "longest") {
      const distanceA = calculateDistance(
        parseFloat(a.pickup_lat),
        parseFloat(a.pickup_long),
        parseFloat(a.dropoff_lat),
        parseFloat(a.dropoff_long)
      );
      const distanceB = calculateDistance(
        parseFloat(b.pickup_lat),
        parseFloat(b.pickup_long),
        parseFloat(b.dropoff_lat),
        parseFloat(b.dropoff_long)
      );
      return distanceB - distanceA;
    }
    return 0;
  });

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-[#60B876] p-4 pt-13 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.globalText, tw`text-2xl font-bold text-white ml-4`]}>
          งานวันนี้
        </Text>
      </View>

      <View style={tw`flex-row justify-between items-center bg-gray-200 p-2`}>
        <Text style={[styles.globalText, tw`text-gray-700 ml-4`]}>
          ระยะห่างจากต้นทาง: {filterDistance} กิโลเมตร
        </Text>
        <TouchableOpacity
          style={tw`p-2 bg-[#60B876] rounded-full`}
          onPress={() => setShowFilterModal(true)}
        >
          <Icon name="filter" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`p-2 bg-blue-500 rounded-full ml-2`}
          onPress={() => setShowSortModal(true)}
        >
          <Icon name="sort" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
        animationType="fade"
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white w-3/4 p-4 rounded-lg`}>
            <Text
              style={[styles.globalText, tw`text-lg font-bold text-center mb-4`]}
            >
              เลือกระยะทาง
            </Text>
            {[10, 20, 30].map((distance) => (
              <TouchableOpacity
                key={distance}
                style={[
                  tw`p-2 rounded-lg mb-2`,
                  filterDistance === distance ? tw`bg-[#60B876]` : tw`bg-gray-200`,
                ]}
                onPress={() => {
                  setFilterDistance(distance);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.globalText,
                    tw`text-center ${filterDistance === distance ? "text-white" : "text-black"}`,
                  ]}
                >
                  {distance} กิโลเมตร
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={tw`mt-4 bg-red-500 p-2 rounded-lg`}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={[styles.globalText, tw`text-center text-white font-bold`]}>
                ปิด
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        transparent={true}
        visible={showSortModal}
        onRequestClose={() => setShowSortModal(false)}
        animationType="fade"
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white w-3/4 p-4 rounded-lg`}>
            <Text
              style={[styles.globalText, tw`text-lg font-bold text-center mb-4`]}
            >
              เลือกการเรียงลำดับ
            </Text>
            {[
              { label: "ล่าสุด-เก่า", value: "latest" },
              { label: "เก่า-ล่าสุด", value: "oldest" },
              { label: "ระยะรับรถใกล้กับจุดส่งที่สุด", value: "shortest" },
              { label: "ระยะส่งรถไกลกับจุดรับที่สุด", value: "longest" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  tw`p-2 rounded-lg mb-2`,
                  sortCriteria === option.value ? tw`bg-blue-500` : tw`bg-gray-200`,
                ]}
                onPress={() => {
                  setSortCriteria(option.value);
                  setShowSortModal(false);
                }}
              >
                <Text
                  style={[
                    styles.globalText,
                    tw`text-center ${sortCriteria === option.value ? "text-white" : "text-black"}`,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={tw`mt-4 bg-red-500 p-2 rounded-lg`}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={[styles.globalText, tw`text-center text-white font-bold`]}>
                ปิด
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={tw`p-4`}>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : sortedRequests.length > 0 ? (
          sortedRequests.map((request) => {
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
    fontFamily: "Mitr-Regular",
  },
});
