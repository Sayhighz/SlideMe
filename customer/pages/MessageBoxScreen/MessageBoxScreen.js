// MessageBoxScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';

const MessageBoxScreen = () => {
  // ตัวอย่างข้อมูลกล่องข้อความ
  const [messages, setMessages] = useState([
    { id: '1', type: 'coupon', title: 'ลดราคา 50%', content: 'ใช้โค๊ต DISCOUNT50 เพื่อลดราคา 50%.' },
    { id: '2', type: 'news', title: 'NETA Night ต้องการลากด่วน', content: 'ต้องการลากด่วน' },
    { id: '3', type: 'coupon', title: 'ส่งฟรี', content: 'ใช้โค๊ต FREEDELIVERY เพื่อส่งฟรี' },
    { id: '4', type: 'news', title: 'NETA Night ยางรั่ว', content: 'ยางรั่วปะด่วน' },
  ]);

  const [filter, setFilter] = useState('all'); // 'all' or 'coupon'
  const [selectedMessage, setSelectedMessage] = useState(null); // เก็บข้อความที่เลือก
  const [modalVisible, setModalVisible] = useState(false); // ควบคุมการแสดงผล Modal

  // ฟังก์ชันสำหรับฟิลเตอร์ข้อมูล
  const filteredMessages = messages.filter((message) => {
    if (filter === 'all') return true;
    return message.type === filter;
  });

  const openModal = (message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMessage(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={tw`flex-row items-center p-4 bg-white mb-2 rounded shadow`}>
        <Icon
          name={item.type === 'coupon' ? 'tag' : 'newspaper'}
          size={30}
          color={item.type === 'coupon' ? '#f59e0b' : '#3b82f6'}
          style={tw`mr-3`}
        />
        <View>
          <Text style={tw`text-lg font-bold`}>{item.title}</Text>
          <Text style={tw`text-sm mt-2`}>{item.content}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row justify-around bg-green-600 p-3`}>
        <TouchableOpacity
          style={filter === 'all' ? tw`border-b-2 border-white` : tw`opacity-70`}
          onPress={() => setFilter('all')}
        >
          <Text style={tw`text-white text-lg`}>ทั้งหมด</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={filter === 'coupon' ? tw`border-b-2 border-white` : tw`opacity-70`}
          onPress={() => setFilter('coupon')}
        >
          <Text style={tw`text-white text-lg`}>คูปองส่วนลด</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`p-5`}>
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-50`}>
          <View style={tw`w-11/12 bg-white p-5 rounded`}>
            {selectedMessage && (
              <>
                <Text style={tw`text-2xl font-bold mb-3`}>{selectedMessage.title}</Text>
                <Text style={tw`text-lg mb-5`}>{selectedMessage.content}</Text>
                <Button title="Close" color={'#60B876'} onPress={closeModal} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageBoxScreen;
