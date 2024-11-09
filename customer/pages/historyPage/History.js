import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome5 for the car slide icon
import tw from "twrnc";

const HistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [serviceHistoryData, setServiceHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.0.2.2:3000/auth/service_history_customer?customer_id=2');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServiceHistoryData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = serviceHistoryData.filter(item => {
    if (filter === 'success') return item.service_status === 'สำเร็จ';
    if (filter === 'canceled') return item.service_status === 'ยกเลิก';
    return true;
  });

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const getTextColor = (currentFilter) => {
    if (currentFilter === filter) {
      return currentFilter === 'success'
        ? tw`text-blue-500`
        : currentFilter === 'canceled'
        ? tw`text-red-500`
        : tw`text-black`;
    }
    return tw`text-gray-500`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={tw`bg-white rounded-lg p-4 mb-4 shadow flex-row items-center`}>
        <Icon 
          name="truck-moving"
          size={24} 
          color="blue" 
          style={tw`mr-2`} 
        />
        <View>
          <Text style={tw`text-lg font-semibold`}>{item.vehicle_type}</Text>
          <Text style={tw`text-gray-600`}>วันที่: {item.date}</Text>
          <Text style={tw`text-gray-600`}>สถานะ: {item.service_status}</Text>
          <Text style={tw`text-gray-600`}>ค่าบริการ: {item.service_charge}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <View style={tw`flex-1 justify-center items-center`}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={tw`flex-1 justify-center items-center`}><Text>Error: {error}</Text></View>;
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold text-center my-4`}>ประวัติการเรียกใช้บริการ</Text>
      
      {/* Navbar filter */}
      <View style={tw`flex-row justify-around bg-white p-4 shadow`}>
        <TouchableOpacity onPress={() => setFilter('success')} style={tw`items-center`}>
          <Icon name="check-circle" size={24} color={filter === 'success' ? 'blue' : 'gray'} />
          <Text style={getTextColor('success')}>สำเร็จ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter('canceled')} style={tw`items-center`}>
          <Icon name="times-circle" size={24} color={filter === 'canceled' ? 'red' : 'gray'} />
          <Text style={getTextColor('canceled')}>ยกเลิก</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter('all')} style={tw`items-center`}>
          <Icon name="list" size={24} color={filter === 'all' ? 'black' : 'gray'} />
          <Text style={getTextColor('all')}>ทั้งหมด</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
            <View style={tw`bg-white rounded-lg p-4 w-11/12`}>
              <Text style={tw`text-xl font-bold mb-2`}>รายละเอียดเพิ่มเติม</Text>
              <Text style={tw`text-lg`}>บริการ: {selectedItem.vehicle_type}</Text>
              <Text style={tw`text-lg`}>วันที่: {selectedItem.date}</Text>
              <Text style={tw`text-lg`}>สถานะ: {selectedItem.service_status}</Text>
              <Text style={tw`text-lg`}>ค่าบริการ: {selectedItem.service_charge}</Text>
              <Text style={tw`text-lg`}>ต้นทาง: {selectedItem.origin}</Text>
              <Text style={tw`text-lg`}>ปลายทาง: {selectedItem.destination}</Text>
              <TouchableOpacity
                style={tw`bg-green-600 rounded-full px-4 py-2 mt-4`}
                onPress={() => setModalVisible(false)}
              >
                <Text style={tw`text-white text-center`}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default HistoryPage;
