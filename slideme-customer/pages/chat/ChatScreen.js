import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Animated,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

// Import our new components
import MessageList from "../../components/chat/MessageList";
import ChatInput from "../../components/chat/ChatInput";
import NewMessageNotification from "../../components/chat/NewMessageNotification";
import ChatService from "../../components/chat/ChatService";

export default function ChatScreen({ route }) {
  const { room_id, user_name, phoneNumber } = route.params;
  const user_id = "customer"; // Current user ID (ประเภทผู้ใช้คงที่เป็น customer)
  const user_type = "customer"; // Explicitly define user type
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [atBottom, setAtBottom] = useState(true);
  const [newMessage, setNewMessage] = useState(false);
  
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const chatServiceRef = useRef(null);
  
  useEffect(() => {
    // Initialize chat service
    chatServiceRef.current = new ChatService(room_id, user_id, user_type, IP_ADDRESS);
    
    // Set message handler
    chatServiceRef.current.setMessageHandler((newMsg) => {
      // Check if we already have this message (prevent duplicates)
      setMessages((prevMessages) => {
        // Optional: Could add more sophisticated message deduplication here
        // For now, we're relying on the chatService to filter out self-messages
        
        const updatedMessages = [...prevMessages, newMsg];
        chatServiceRef.current.saveMessages(updatedMessages);
        
        // Show "new message" animation if not at bottom
        if (!atBottom) {
          setNewMessage(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativecustomer: true,
          }).start();
        }
        
        return updatedMessages;
      });
    });
    
    // Connect to socket
    chatServiceRef.current.connect().then(() => {
      // Load previous messages from AsyncStorage
      loadPreviousMessages();
    });
    
    // Clean up on unmount
    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.disconnect();
      }
    };
  }, []);

  const loadPreviousMessages = async () => {
    if (!chatServiceRef.current) return;
    
    try {
      const loadedMsgs = await chatServiceRef.current.loadMessages();
      if (loadedMsgs && loadedMsgs.length > 0) {
        setMessages(loadedMsgs);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const bottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    setAtBottom(bottom);
    if (bottom) {
      setNewMessage(false); // Hide new message indicator when at bottom
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setAtBottom(true);
    setNewMessage(false);
  };

  const sendMessage = () => {
    if (!message.trim() || !chatServiceRef.current) return;
    
    // Send message via chat service
    const sentMessage = chatServiceRef.current.sendMessage(message);
    
    if (sentMessage) {
      // Add to local state
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, sentMessage];
        chatServiceRef.current.saveMessages(updatedMessages);
        return updatedMessages;
      });
      
      // Clear input field
      setMessage("");
    }
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.openURL(url);
    } else {
      Alert.alert("หมายเลขโทรศัพท์", "หมายเลขโทรศัพท์ไม่พร้อมใช้งาน");
    }
  };

  return (
    <KeyboardAvoidingView style={tw`flex-1 bg-[#f5f7fa]`} behavior="padding">
      {/* Header */}
      <HeaderWithBackButton
        showBackButton={true}
        title={`คุณ ${user_name}`}
        onPress={() => navigation.goBack()}
      />
      <View style={tw`absolute right-7 top-15`}>
        <TouchableOpacity
          style={tw`bg-[#60B876] w-10 h-10 rounded-full flex items-center justify-center mx-1`}
          onPress={() => handleCall(phoneNumber)}
        >
          <Icon name="phone" size={15} color="white" />
        </TouchableOpacity>
      </View>

      {/* Debug message logger */}
      <View style={tw`px-4 py-1 bg-gray-100`}>
        <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>
          Debug: ขั้นตอน authenticate → joinRequest → รับข้อความ
        </Text>
      </View>

      {/* Message List Component */}
      <MessageList
        messages={messages}
        flatListRef={flatListRef}
        handleScroll={handleScroll}
        atBottom={atBottom}
        user_id={user_id}
        user_type={user_type}
        scrollToBottom={scrollToBottom}
      />

      {/* New Message Notification Component */}
      <NewMessageNotification 
        visible={newMessage && !atBottom} 
        fadeAnim={fadeAnim} 
      />

      {/* Chat Input Component */}
      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});