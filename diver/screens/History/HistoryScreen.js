import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IP_ADDRESS } from '../../config';

export default function HistoryScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchJobHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [selectedStatus, jobHistory]);

  const fetchJobHistory = async () => {
    try {
      const driver_id = 3; // Replace with actual driver_id as needed
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/driver/getHistory?driver_id=${driver_id}`);
      const data = await response.json();
      if (data.Status) {
        setJobHistory(data.Result);
        setFilteredHistory(data.Result);
      } else {
        console.error('Failed to fetch job history:', data.Error);
      }
    } catch (error) {
      console.error('Error fetching job history:', error);
    }
  };

  const filterHistory = () => {
    if (selectedStatus === 'all') {
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

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'accepted':
        return <Text style={tw`text-blue-500`}>รับข้อเสนอแล้ว</Text>;
      case 'completed':
        return <Text style={tw`text-green-500`}>จัดส่งสำเร็จ</Text>;
      case 'cancelled':
        return <Text style={tw`text-red-500`}>ยกเลิกบริการ</Text>;
      default:
        return <Text>{status}</Text>;
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const truncateText = (text, maxLength = 10) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-xl font-bold my-4`}>ประวัติการทำงาน</Text>

      <View style={tw`flex-row justify-around mb-4 border-b pb-2`}>
        <TouchableOpacity onPress={() => handleStatusFilter('all')} style={tw`flex-1 items-center`}>
          <Icon
            name="filter-outline"
            size={30}
            color={selectedStatus === 'all' ? 'blue' : 'gray'}
          />
          <Text style={tw`${selectedStatus === 'all' ? 'text-blue-500' : 'text-gray-500'}`}>ทั้งหมด</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('accepted')} style={tw`flex-1 items-center`}>
          <Icon
            name="checkbox-marked-circle-outline"
            size={30}
            color={selectedStatus === 'accepted' ? 'blue' : 'gray'}
          />
          <Text style={tw`${selectedStatus === 'accepted' ? 'text-blue-500' : 'text-gray-500'}`}>รับข้อเสนอ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('completed')} style={tw`flex-1 items-center`}>
          <Icon
            name="check-circle-outline"
            size={30}
            color={selectedStatus === 'completed' ? 'blue' : 'gray'}
          />
          <Text style={tw`${selectedStatus === 'completed' ? 'text-blue-500' : 'text-gray-500'}`}>สำเร็จ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('cancelled')} style={tw`flex-1 items-center`}>
          <Icon
            name="close-circle-outline"
            size={30}
            color={selectedStatus === 'cancelled' ? 'blue' : 'gray'}
          />
          <Text style={tw`${selectedStatus === 'cancelled' ? 'text-blue-500' : 'text-gray-500'}`}>ยกเลิก</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
      {filteredHistory.map((job, index) => (
        <TouchableOpacity
          key={index}
          style={tw`p-4 mb-4 bg-white rounded-lg shadow flex-row`}
          onPress={() => openModal(job)}
        >
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Icon name="map-marker" size={20} color="gray" />
              <Text style={tw`ml-2 text-gray-800`}>{truncateText(job.origin)}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Icon name="map-marker" size={20} color="gray" />
              <Text style={tw`ml-2 text-gray-800`}>{truncateText(job.destination)}</Text>
            </View>
          </View>
          <View style={tw`ml-4 justify-center`}>
            <Text>เริ่มงาน {new Date(job.start_time).toLocaleDateString()}</Text>
            <Text>เวลา {new Date(job.start_time).toLocaleTimeString()}</Text>
            <Text>รายได้: ฿{formatNumberWithCommas(job.profit)}</Text>
            {getStatusDisplay(job.status)}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>

      {selectedJob && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
            <View style={tw`w-4/5 p-6 bg-white rounded-lg`}>
              <Text style={tw`text-lg font-bold mb-4`}>รายละเอียดงาน</Text>
              <Text>ต้นทาง: {selectedJob.origin}</Text>
              <Text>ปลายทาง: {selectedJob.destination}</Text>
              <Text>วันที่เริ่มงาน: {new Date(selectedJob.start_time).toLocaleDateString()}</Text>
              <Text>เวลาเริ่มงาน: {new Date(selectedJob.start_time).toLocaleTimeString()}</Text>
              <Text>รายได้: ฿{formatNumberWithCommas(selectedJob.profit)}</Text>
              {getStatusDisplay(selectedJob.status)}

              <TouchableOpacity
                style={tw`mt-6 bg-blue-500 p-3 rounded-full items-center`}
                onPress={closeModal}
              >
                <Text style={tw`text-white font-bold`}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
