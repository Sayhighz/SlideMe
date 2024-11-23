import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";
import { UserContext } from '../../UserContext';


// Utility function to format date to Thai format
const formatThaiDate = (dateString) => {
  const monthsThai = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthsThai[date.getMonth()];
  const year = date.getFullYear() + 543 - 2500; // Convert to BE (พ.ศ.) and simplify format

  return `${day} ${month} ${year}`;
};

// Function to map service status to Thai labels
const mapServiceStatus = (status) => {
  switch (status) {
    case 'completed':
      return 'สำเร็จ';
    case 'canceled':
      return 'ยกเลิก';
    default:
      return status;
  }
};

// Function to format number with commas
const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const HistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [serviceHistoryData, setServiceHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${IP_ADDRESS}:3000/auth/service_history_customer?customer_id=${userData.user_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log("Data:", data); // Log the data for debugging
        setServiceHistoryData(Array.isArray(data.Result) ? data.Result : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = Array.isArray(serviceHistoryData) ? serviceHistoryData.filter(item => {
    if (filter === 'completed') return item.service_status === 'completed';
    if (filter === 'canceled') return item.service_status === 'canceled';
    return true;
  }) : [];

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const getTextColor = (currentFilter) => {
    if (currentFilter === filter) {
      return currentFilter === 'completed'
        ? tw`text-green-500`
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
          color="green" 
          style={tw`mr-2`} 
        />
        <View>
          <Text style={tw`text-lg font-semibold`}>{item.vehicle_type || 'ไม่ระบุ'}</Text>
          <Text style={tw`text-gray-600`}>วันที่: {formatThaiDate(item.date)}</Text>
          <Text style={tw`text-gray-600`}>สถานะ: {mapServiceStatus(item.service_status)}</Text>
          <Text style={tw`text-gray-600`}>ค่าบริการ: {item.service_charge ? formatNumberWithCommas(item.service_charge) : 'ไม่ระบุ'} บาท</Text>
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
        <TouchableOpacity onPress={() => setFilter('completed')} style={tw`items-center`}>
          <Icon name="check-circle" size={24} color={filter === 'completed' ? 'green' : 'gray'} />
          <Text style={getTextColor('completed')}>สำเร็จ</Text>
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
        keyExtractor={(item, index) => index.toString()} // Use index as key since data may lack unique IDs
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
              <Text style={tw`text-lg`}>บริการ: {selectedItem.vehicle_type || 'ไม่ระบุ'}</Text>
              <Text style={tw`text-lg`}>วันที่: {formatThaiDate(selectedItem.date)}</Text>
              <Text style={tw`text-lg`}>สถานะ: {mapServiceStatus(selectedItem.service_status)}</Text>
              <Text style={tw`text-lg`}>ค่าบริการ: {formatNumberWithCommas(selectedItem.service_charge)} บาท</Text>
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
