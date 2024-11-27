import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import hook
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IP_ADDRESS } from "../../config";

export default function HistoryScreen({ userData }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch job history every time the screen is focused
  const fetchJobHistory = async () => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/driver/getHistory?driver_id=${userData?.driver_id}`
      );
      const data = await response.json();
      if (data.Status) {
        setJobHistory(data.Result);
        setFilteredHistory(data.Result); // Assuming you want to update both
      } else {
        console.error("ไม่สามารถดึงประวัติการทำงานได้:", data.Error);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
  };

  // Call fetchJobHistory every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchJobHistory();
    }, 5000); // 5000ms = 5 seconds

    // Cleanup interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Filter the job history based on selected status
  useEffect(() => {
    filterHistory();
  }, [selectedStatus, jobHistory]);


  // Focus effect to reload the history when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchJobHistory();
    }, [])
  );


  const filterHistory = () => {
    if (selectedStatus === "all") {
      setFilteredHistory(jobHistory);
    } else {
      const filtered = jobHistory.filter((job) => job.status === selectedStatus);
      setFilteredHistory(filtered);
    }
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFilterModalVisible(false);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "accepted":
        return <Text style={[styles.globalText, tw`text-blue-500`]}>รับข้อเสนอแล้ว</Text>;
      case "completed":
        return <Text style={[styles.globalText, tw`text-green-500`]}>จัดส่งสำเร็จ</Text>;
      case "cancelled":
        return <Text style={[styles.globalText, tw`text-red-500`]}>ยกเลิกบริการ</Text>;
      default:
        return <Text style={styles.globalText}>{status}</Text>;
    }
  };

  const formatNumberWithCommas = (number) => {
    if (!number && number !== 0) return "0"; // Handle null, undefined, or other falsy values except 0
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const truncateText = (text, maxLength = 10) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filterOptions = [
    { label: "ทั้งหมด", value: "all" },
    { label: "รับข้อเสนอ", value: "accepted" },
    { label: "สำเร็จ", value: "completed" },
    { label: "ยกเลิก", value: "cancelled" },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mt-9 px-4 py-4`}>
        <Text style={[styles.globalText, tw`text-xl font-bold`]}>ประวัติการทำงาน</Text>
        <TouchableOpacity
          style={tw`p-3 bg-[#60B876] rounded`}
          onPress={() => setFilterModalVisible(true)}
        >  
          <Icon name="filter-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Job History List */}
      <ScrollView>
        {filteredHistory.map((job, index) => (
          <TouchableOpacity
            key={index}
            style={tw`p-4 mb-4 mx-3 bg-white rounded-lg shadow-md border border-gray-200 flex-row`}
            onPress={() => openModal(job)}
          >
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Icon name="map-marker" size={20} color="green" />
                <Text style={[styles.globalText, tw`ml-2 text-gray-800`]}>
                  {truncateText(job.origin)}
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Icon name="map-marker" size={20} color="red" />
                <Text style={[styles.globalText, tw`ml-2 text-gray-800`]}>
                  {truncateText(job.destination)}
                </Text>
              </View>
            </View>
            <View style={tw`ml-4 justify-center`}>
              <Text style={styles.globalText}>
                เริ่มงาน {new Date(job.start_time).toLocaleDateString()}
              </Text>
              <Text style={styles.globalText}>
                เวลา {new Date(job.start_time).toLocaleTimeString()}
              </Text>
              <Text style={styles.globalText}>
                รายได้: ฿{formatNumberWithCommas(job.profit)}
              </Text>
              {getStatusDisplay(job.status)}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
            <View style={tw`w-4/5 p-9 bg-white rounded-lg`}>
              <Text style={[styles.globalText, tw`text-lg font-bold mb-4 text-center`]}>รายละเอียดงาน</Text>
              <Text style={styles.globalText}><Icon name="map-marker" size={20} color="green" />ต้นทาง</Text>
              <Text style={[styles.globalText, tw`text-gray-500 mb-2`]}>{selectedJob.origin}</Text>
              <Text style={styles.globalText}> <Icon name="map-marker" size={20} color="red" />ปลายทาง</Text>
              <Text style={[styles.globalText, tw`text-gray-500 mb-2`]}>{selectedJob.destination}</Text>
              <Text style={styles.globalText}>
                วันที่เริ่มงาน:{" "}
                {new Date(selectedJob.start_time).toLocaleDateString()}
              </Text>
              <Text style={styles.globalText}>
                เวลาเริ่มงาน:{" "}
                {new Date(selectedJob.start_time).toLocaleTimeString()}
              </Text>
              <Text style={styles.globalText}>
                รายได้: ฿{formatNumberWithCommas(selectedJob.profit)}
              </Text>
              {getStatusDisplay(selectedJob.status)}

              <TouchableOpacity
                style={tw`mt-6 bg-[#60B876] p-3 rounded items-center`}
                onPress={closeModal}
              >
                <Text style={[styles.globalText, tw`text-white font-bold`]}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Filter Options Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`w-4/5 bg-white rounded-lg`}>
            <Text
              style={[styles.globalText, tw`text-lg font-bold p-4 text-center`]}
            >
              เลือกประเภทการกรอง
            </Text>
            <FlatList
              data={filterOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`p-4 border-b border-gray-200`}
                  onPress={() => handleStatusChange(item.value)}
                >
                  <Text
                    style={[
                      styles.globalText,
                      tw`text-center text-lg text-gray-800`,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={tw`p-4 bg-red-500 rounded-b-lg`}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={[styles.globalText, tw`text-white text-center font-bold`]}>
                ปิด
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  globalText: {
    fontFamily: "Mitr-Regular", // Use your custom font
  },
};
