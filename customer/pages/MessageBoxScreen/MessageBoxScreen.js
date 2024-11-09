import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';

const MessageBoxScreen = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'coupon'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for the API call

  // Fetch messages from an API endpoint
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://192.168.1.108:3000/auth/getAllDiscounts'); // Replace with your API endpoint
        const data = await response.json();
        console.log('Fetched data:', data); // Debugging output

        if (data && Array.isArray(data.Result)) {
          setMessages(data.Result); // Access the array inside the "Result" key
        } else {
          console.error('Expected array in data.Result but received:', data);
          setMessages([]); // Fallback to an empty array if data is not as expected
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]); // Fallback to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

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
          <Text style={tw`text-lg font-bold`}>{item.discount_code}</Text>
          <Text style={tw`text-sm mt-2`}>{item.discount_message}</Text>
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
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <FlatList
            data={filteredMessages}
            keyExtractor={(item) => item.discount_code}
            renderItem={renderItem}
          />
        )}
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
                <Text style={tw`text-2xl font-bold mb-3`}>{selectedMessage.discount_code}</Text>
                <Text style={tw`text-lg mb-5`}>{selectedMessage.discount_message}</Text>
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
