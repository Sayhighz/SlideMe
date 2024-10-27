import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import tw from "twrnc"; // import twrnc

const HistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const serviceHistoryData = [
    { id: '1', date: '2024-10-20', serviceType: 'รถกระบะ', status: 'สำเร็จ', amount: '200฿', origin: 'ถนนสุขุมวิท', destination: 'ห้างสรรพสินค้า' },
    { id: '2', date: '2024-10-19', serviceType: 'มอไซ', status: 'ยกเลิก', amount: '0฿', origin: 'โกดังสินค้า', destination: 'บ้านลูกค้า' },
    { id: '3', date: '2024-10-18', serviceType: 'NETA NIGHT', status: 'สำเร็จ', amount: '300฿', origin: 'บ้านลูกค้า', destination: 'สำนักงาน' },
  ];

  // filter fuction
  const filteredData = serviceHistoryData.filter(item => {
    if (filter === 'success') return item.status === 'สำเร็จ';
    if (filter === 'canceled') return item.status === 'ยกเลิก';
    return true;
  });

  // modal
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={tw`bg-white rounded-lg p-4 mb-4 shadow`}>
        <Text style={tw`text-lg font-semibold`}>{item.serviceType}</Text>
        <Text style={tw`text-gray-600`}>วันที่: {item.date}</Text>
        <Text style={tw`text-gray-600`}>สถานะ: {item.status}</Text>
        <Text style={tw`text-gray-600`}>ค่าบริการ: {item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-4`}>ประวัติการเรียกใช้บริการ</Text>
      
      {/* filter button */}
      <View style={tw`flex-row mb-4`}>
        <TouchableOpacity 
          style={tw`bg-blue-500 rounded-full px-4 py-2 mr-2`}
          onPress={() => setFilter('success')}
        >
          <Text style={tw`text-white`}>สำเร็จ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tw`bg-red-500 rounded-full px-4 py-2 mr-2`}
          onPress={() => setFilter('canceled')}
        >
          <Text style={tw`text-white`}>ยกเลิก</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`bg-gray-300 rounded-full px-4 py-2`}
          onPress={() => setFilter('all')}
        >
          <Text>ทั้งหมด</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* โมดัลสำหรับแสดงรายละเอียดเพิ่มเติม */}
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
              <Text style={tw`text-lg`}>บริการ: {selectedItem.serviceType}</Text>
              <Text style={tw`text-lg`}>วันที่: {selectedItem.date}</Text>
              <Text style={tw`text-lg`}>สถานะ: {selectedItem.status}</Text>
              <Text style={tw`text-lg`}>ค่าบริการ: {selectedItem.amount}</Text>
              <Text style={tw`text-lg`}>ต้นทาง: {selectedItem.origin}</Text>
              <Text style={tw`text-lg`}>ปลายทาง: {selectedItem.destination}</Text>
              <TouchableOpacity
                style={tw`bg-blue-500 rounded-full px-4 py-2 mt-4`}
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
