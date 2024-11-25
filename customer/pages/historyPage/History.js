import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";

// Utility function to format date to Thai format
const formatThaiDate = (dateString) => {
  const monthsThai = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthsThai[date.getMonth()];
  const year = date.getFullYear() + 543 - 2500;

  return `${day} ${month} ${year}`;
};

// Function to map service status to Thai labels
const mapServiceStatus = (status) => {
  switch (status) {
    case "completed":
      return "สำเร็จ";
    case "canceled":
      return "ยกเลิก";
    default:
      return "กำลังดำเนินการ";
  }
};

// Function to determine icon and background color for service status
const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return { icon: "check-circle", color: "#28a745", bgColor: "#d4edda" };
    case "canceled":
      return { icon: "times-circle", color: "#dc3545", bgColor: "#f8d7da" };
    default:
      return { icon: "hourglass-half", color: "#ffc107", bgColor: "#fff3cd" };
  }
};

// Function to format number with commas
const formatNumberWithCommas = (number) => {
  return number
    ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "ไม่ระบุ";
};

const HistoryPage = () => {
  const [filter, setFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [serviceHistoryData, setServiceHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/auth/service_history_customer?customer_id=${userData.user_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setServiceHistoryData(Array.isArray(data.Result) ? data.Result : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = serviceHistoryData.filter((item) => {
    if (filter === "completed") return item.service_status === "completed";
    if (filter === "canceled") return item.service_status === "canceled";
    return true;
  });

  const openModal = (item) => {
    if (!item) {
      console.warn("Item is null or undefined");
      return;
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const { icon, color, bgColor } = getStatusIcon(item.service_status);

    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        <View
          style={tw`bg-white rounded-lg p-4 mb-4 shadow flex-row items-center`}
        >
          <View
            style={[
              tw`items-center justify-center mr-4`,
              {
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: bgColor,
              },
            ]}
          >
            <Icon name={icon} size={24} color={color} />
          </View>
          <View>
            <Text style={[tw`text-lg font-semibold`, styles.customFont]}>
              {item.vehicle_type || "ไม่ระบุ"}
            </Text>
            <Text style={[tw`text-gray-600`, styles.customFont]}>
              วันที่: {formatThaiDate(item.date)}
            </Text>
            <Text style={[tw`text-gray-600`, styles.customFont]}>
              สถานะ: {mapServiceStatus(item.service_status)}
            </Text>
            <Text style={[tw`text-gray-600`, styles.customFont]}>
              ค่าบริการ:{" "}
              {item.service_charge
                ? formatNumberWithCommas(item.service_charge)
                : "0"}{" "}
              บาท
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return item && item.id ? item.id.toString() : `index-${index}`;
        }}
        contentContainerStyle={tw`pb-15`}
      />

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 `}
          >
            <View
              style={[
                tw`bg-white rounded-lg p-6 w-11/12`,
                { maxHeight: "90%" },
              ]}
            >
              <Text
                style={[
                  tw`text-2xl font-bold mb-4 text-black`,
                  styles.customFont,
                ]}
              >
                รายละเอียดเพิ่มเติม
              </Text>
              <View style={tw`mb-4`}>
                <View style={tw`flex-row items-start mb-3  justify-center`}>
                  <Icon
                    name="car"
                    size={20}
                    color="black"
                    style={tw`mr-4 mt-1`}
                  />
                  <Text
                    style={[
                      tw`text-lg items-center text-black flex-1`,
                      styles.customFont,
                    ]}
                  >
                    บริการ: {selectedItem.vehicle_type || "ไม่ระบุ"}
                  </Text>
                </View>
                <View style={tw`flex-row items-start mb-3`}>
                  <Icon
                    name="calendar-alt"
                    size={20}
                    color="#3B82F6"
                    style={tw`mr-4 mt-1`}
                  />
                  <Text
                    style={[
                      tw`text-lg text-black flex-1 `,
                      styles.customFont,
                    ]}
                  >
                    วันที่: {formatThaiDate(selectedItem.date)}
                  </Text>
                </View>
                <View style={tw`flex-row items-start mb-3`}>
                  <Icon
                    name="info-circle"
                    size={20}
                    color="#FF9800"
                    style={tw`mr-4 mt-1`}
                  />
                  <Text
                    style={[
                      tw`text-lg text-black flex-1 `,
                      styles.customFont,
                    ]}
                  >
                    สถานะ: {mapServiceStatus(selectedItem.service_status)}
                  </Text>
                </View>
                <View style={tw`flex-row items-start mb-3`}>
                  <Icon
                    name="money-bill-wave"
                    size={20}
                    color="#4CAF50"
                    style={tw`mr-4 mt-1`}
                  />
                  <Text
                    style={[
                      tw`text-lg text-black flex-1 `,
                      styles.customFont,
                    ]}
                  >
                    ค่าบริการ:{" "}
                    {formatNumberWithCommas(selectedItem.service_charge)} บาท
                  </Text>
                </View>
                <View style={tw`flex-row items-start mb-3`}>
                  <Icon
                    name="map-marker-alt"
                    size={20}
                    color="#E91E63"
                    style={tw`mr-4 mt-1`}
                  />
                  <Text
                    style={[
                      tw`text-lg text-black flex-1`,
                      styles.customFont,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    ต้นทาง: {selectedItem.origin || "ไม่ระบุ"}
                  </Text>
                </View>
                <View style={tw`flex-row items-start`}>
                  <Icon
                    name="flag-checkered"
                    size={20}
                    color="#60B876"
                    style={tw`mr-4 mt-1`}
                  />
                  <Text
                    style={[
                      tw`text-lg text-black flex-1 `,
                      styles.customFont,
                    ]}
                    numberOfLines={1}
            ellipsizeMode="tail"
                  >
                    ปลายทาง: {selectedItem.destination || "ไม่ระบุ"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={tw`bg-[#60B876] rounded px-4 py-2 mt-4`}
                onPress={() => setModalVisible(false)}
              >
                <Text style={tw`text-white text-center text-lg`}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: "Mitr-Regular",
    flexWrap: "wrap", // Ensure text wraps if it exceeds the container
  },
});

export default HistoryPage;
