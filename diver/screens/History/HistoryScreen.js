// screens/HistoryScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HistoryScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobHistory = [
    { id: 1, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
    { id: 2, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
    { id: 3, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
    { id: 4, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
    { id: 5, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
    { id: 6, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
    { id: 7, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
    { id: 8, origin: 'ต้นทาง', destination: 'ปลายทาง', startDate: '25 ก.ย. 67', startTime: '17:00น', carType: 'รถรับ 2008' },
  ];

  const openModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setModalVisible(false);
  };

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-xl font-bold my-9`}>ประวัติการทำงาน</Text>
      
      <ScrollView>
        {jobHistory.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={tw`p-4 mb-4 bg-white rounded-lg shadow flex-row`}
            onPress={() => openModal(job)}
          >
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Icon name="map-marker" size={20} color="gray" />
                <Text style={tw`ml-2 text-gray-800`}>{job.origin}</Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Icon name="map-marker" size={20} color="gray" />
                <Text style={tw`ml-2 text-gray-800`}>{job.destination}</Text>
              </View>
            </View>
            <View style={tw`ml-4 justify-center`}>
              <Text>เริ่มงาน {job.startDate}</Text>
              <Text>เวลา {job.startTime}</Text>
              <Text>{job.carType}</Text>
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
              <Text>วันที่เริ่มงาน: {selectedJob.startDate}</Text>
              <Text>เวลาเริ่มงาน: {selectedJob.startTime}</Text>
              <Text>ประเภท: {selectedJob.carType}</Text>
              
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
