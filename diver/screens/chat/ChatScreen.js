import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Icon library
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";
import { useNavigation } from '@react-navigation/native';

const socket = io(`http://${IP_ADDRESS}:4000`);

export default function ChatScreen({ route }) {
  const { room_id } = route.params; // รับ room_id จาก Screen อื่น
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  // Key สำหรับจัดเก็บข้อความใน AsyncStorage
  const storageKey = `chat_messages_${room_id}`;

  useEffect(() => {
    // เข้าร่วมห้องเมื่อ Component Mount
    socket.emit("joinRoom", room_id);

    // รับข้อความจากเซิร์ฟเวอร์
    socket.on("receiveMessage", (data) => {
      const newMessage = data.message;
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        saveMessagesToStorage(updatedMessages); // บันทึกข้อความลง AsyncStorage
        return updatedMessages;
      });
    });

    // โหลดข้อความจาก AsyncStorage
    loadMessagesFromStorage();

    return () => {
      socket.off("receiveMessage");
    };
  }, [room_id]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: "self",
        message,
      };

      // ส่งข้อความไปยังเซิร์ฟเวอร์
      socket.emit("sendMessage", { room_id, message });

      // เพิ่มข้อความของตัวเองลงใน state และ AsyncStorage
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        saveMessagesToStorage(updatedMessages); // บันทึกข้อความลง AsyncStorage
        return updatedMessages;
      });

      setMessage(""); // เคลียร์ข้อความในช่อง Input
    }
  };

  // บันทึกข้อความลง AsyncStorage
  const saveMessagesToStorage = async (messages) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to AsyncStorage:", error);
    }
  };

  // โหลดข้อความจาก AsyncStorage
  const loadMessagesFromStorage = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem(storageKey);
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error("Error loading messages from AsyncStorage:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={tw`flex-1 bg-[#f5f7fa]`} behavior="padding">
      <View style={tw`p-4 pt-10 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold ml-4`}>ติดต่อลูกค้า</Text>
      </View>
    {/* Message List */}
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <View
          style={[
            tw`m-2 rounded-xl max-w-3/4 px-4 py-3 shadow-sm`,
            item.sender === "self"
              ? tw`bg-[#60B876] self-end`
              : tw`bg-white self-start border border-gray-200`,
          ]}
        >
          <Text
            style={[
                [styles.globalText,tw`text-sm`],
              item.sender === "self" ? tw`text-white` : tw`text-gray-700`,
            ]}
          >
            {item.message}
          </Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      style={tw`flex-1 px-4`}
      contentContainerStyle={tw`py-2`}
    />

    {/* Input and Action Buttons */}
    <View style={tw`flex-row items-center p-3 bg-white border-t border-gray-200`}>

      {/* Input */}
      <TextInput
        style={[styles.globalText,tw`flex-1 bg-gray-100 px-4 py-3 mx-2 rounded-full border border-gray-300`]}
        value={message}
        onChangeText={setMessage}
        placeholder="พิมพ์ข้อความ..."
        placeholderTextColor="#999"
      />

      {/* Send Icon */}
      <TouchableOpacity style={tw`p-3 bg-[#60B876] rounded-full`} onPress={sendMessage}>
        <Icon name="send" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    globalText: {
      fontFamily: "Mitr-Regular",
    },
  });
