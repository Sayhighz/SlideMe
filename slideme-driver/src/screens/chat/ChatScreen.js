import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Animated,
  Alert,
  Linking,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  SafeAreaView,
  BackHandler
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import HeaderWithBackButton from "../../components/common/HeaderWithBackButton";

// Import our components
import MessageList from "../../components/chat/MessageList";
import ChatInput from "../../components/chat/ChatInput";
import NewMessageNotification from "../../components/chat/NewMessageNotification";
import globalChatService from "../../services/GlobalChatService";

// สร้างฟังก์ชันเพื่อคำนวณขนาดตามอุปกรณ์
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width >= 768;
const isTablet = width >= 768 || height >= 1024;

export default function ChatScreen({ route }) {
  const { room_id, user_name, phoneNumber } = route.params;
  const user_id = "driver"; // Current user ID (ประเภทผู้ใช้คงที่เป็น driver)
  const user_type = "driver"; // Explicitly define user type
  const SCREEN_ID = "ChatScreen"; // Unique identifier for this screen
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [atBottom, setAtBottom] = useState(true);
  const [newMessage, setNewMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // ใช้ useCallback เพื่อปรับปรุงประสิทธิภาพ
  const handleNewMessage = useCallback((newMsg) => {
    console.log("[ChatScreen] Received new message:", newMsg);
    
    setMessages((prevMessages) => {
      // Check if message already exists to avoid duplicates
      const messageExists = prevMessages.some(msg => 
        msg.message === newMsg.message && 
        msg.sender === newMsg.sender &&
        msg.timestamp === newMsg.timestamp
      );
      
      if (messageExists) {
        console.log("[ChatScreen] Message already exists, skipping");
        return prevMessages;
      }
      
      const updatedMessages = [...prevMessages, newMsg];
      
      // Show "new message" animation if not at bottom
      if (!atBottom) {
        setNewMessage(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Auto scroll to bottom if already at bottom
        setTimeout(() => scrollToBottom(), 100);
      }
      
      return updatedMessages;
    });
  }, [atBottom]);

  // Back button handler for Android
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [navigation])
  );
  
  useEffect(() => {
    console.log("[ChatScreen] Initializing with room_id:", room_id);
    
    // Initialize global chat service for this room
    globalChatService.initialize(room_id, user_id, user_type);
    
    // Register message handler
    globalChatService.registerMessageHandler(SCREEN_ID, handleNewMessage);
    
    // Load previous messages
    loadPreviousMessages();
    
    // Clean up on unmount
    return () => {
      console.log("[ChatScreen] Unmounting, unregistering message handler");
      globalChatService.unregisterMessageHandler(SCREEN_ID);
    };
  }, [room_id, handleNewMessage]);

  const loadPreviousMessages = async () => {
    try {
      setIsLoading(true);
      console.log("[ChatScreen] Loading previous messages for room:", room_id);
      const loadedMsgs = await globalChatService.loadMessages();
      if (loadedMsgs && loadedMsgs.length > 0) {
        setMessages(loadedMsgs);
        // Scroll to bottom after messages are loaded with a small delay
        setTimeout(() => scrollToBottom(), 300);
      }
    } catch (error) {
      console.error("[ChatScreen] Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const bottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    setAtBottom(bottom);
    if (bottom && newMessage) {
      setNewMessage(false); // Hide new message indicator when at bottom
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      try {
        flatListRef.current.scrollToEnd({ animated: true });
        setAtBottom(true);
        setNewMessage(false);
      } catch (error) {
        console.error("[ChatScreen] Error scrolling to bottom:", error);
      }
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Send message via global chat service
    const sentMessage = globalChatService.sendMessage(message);
    
    if (sentMessage) {
      console.log("[ChatScreen] Sent message:", sentMessage);
      
      // Add to local state
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      
      // Clear input field
      setMessage("");
      
      // Ensure we're scrolled to the bottom
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert("หมายเลขโทรศัพท์", "ไม่สามารถโทรออกได้");
          }
        })
        .catch(error => {
          console.error("Failed to make call:", error);
          Alert.alert("หมายเลขโทรศัพท์", "เกิดข้อผิดพลาดในการโทร");
        });
    } else {
      Alert.alert("หมายเลขโทรศัพท์", "หมายเลขโทรศัพท์ไม่พร้อมใช้งาน");
    }
  };

  const renderCallButton = () => (
    <TouchableOpacity
      style={[
        tw`bg-[#60B876] rounded-full flex items-center justify-center mx-1`,
        isSmallDevice ? tw`w-8 h-8` : isLargeDevice ? tw`w-12 h-12` : tw`w-10 h-10`,
        styles.callButton
      ]}
      onPress={() => handleCall(phoneNumber)}
      activeOpacity={0.7}
    >
      <Icon 
        name="phone" 
        size={isSmallDevice ? 13 : isLargeDevice ? 20 : 15} 
        color="white" 
      />
    </TouchableOpacity>
  );

  // กำหนดรูปแบบ behavior ของ KeyboardAvoidingView ตามแพลตฟอร์ม
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  return (
    <SafeAreaView style={tw`flex-1 bg-[#f5f7fa]`}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <KeyboardAvoidingView 
        style={tw`flex-1`} 
        behavior={keyboardBehavior}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <HeaderWithBackButton
          showBackButton={true}
          title={`คุณ ${user_name}`}
          onPress={() => navigation.goBack()}
          rightComponent={renderCallButton()}
          style={styles.headerShadow}
        />

        {/* Message List Component */}
        <MessageList
          messages={messages}
          flatListRef={flatListRef}
          handleScroll={handleScroll}
          atBottom={atBottom}
          user_id={user_id}
          user_type={user_type}
          scrollToBottom={scrollToBottom}
          isLoading={isLoading}
        />

        {/* New Message Notification Component */}
        <NewMessageNotification 
          visible={newMessage && !atBottom} 
          fadeAnim={fadeAnim}
          onPress={scrollToBottom}
        />

        {/* Chat Input Component */}
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: Platform.OS === 'ios' ? "Sukhumvit Set" : "Mitr-Regular",
  },
  headerShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  callButton: {
    ...Platform.select({
      ios: {
        shadowColor: '#50A070',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  }
});