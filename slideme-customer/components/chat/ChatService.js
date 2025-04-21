import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

class ChatService {
  constructor(room_id, user_id, user_type, IP_ADDRESS) {
    this.room_id = room_id;
    this.user_id = user_id;
    this.user_type = user_type;
    this.IP_ADDRESS = IP_ADDRESS;
    this.socket = null;
    this.isConnected = false;
    this.isAuthenticated = false;
    this.hasJoinedRoom = false;
    this.messageHandler = null;
    this.storageKey = `chat_messages_${room_id}`;
  }

  connect() {
    return new Promise((resolve) => {
      // Create a new socket connection
      this.socket = io(`http://${this.IP_ADDRESS}:4000`);
      console.log('Created socket connection to:', `http://${this.IP_ADDRESS}:4000`);
      
      // Handle connection event
      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.isConnected = true;
        
        // Authenticate immediately after connection
        this.authenticate();
        resolve(true);
      });
      
      // Handle disconnect event
      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        this.isConnected = false;
        this.isAuthenticated = false;
        this.hasJoinedRoom = false;
      });
      
      // Handle error event
      this.socket.on('error', (data) => {
        console.error('Socket error:', data.message);
        Alert.alert('Error', data.message);
      });
      
      // Handle authenticated event
      this.socket.on('authenticated', (data) => {
        if (data && data.success) {
          console.log('Authentication successful');
          this.isAuthenticated = true;
          
          // Join room after successful authentication
          this.joinRoom();
        }
      });
      
      // Handle joinedRequest/joinedRoom event
      this.socket.on('joinedRequest', (data) => {
        if (data.success) {
          console.log('Successfully joined room:', this.room_id);
          this.hasJoinedRoom = true;
        }
      });
      
      // Alternative event name for joining room
      this.socket.on('joinedRoom', (data) => {
        if (data.success) {
          console.log('Successfully joined room:', this.room_id);
          this.hasJoinedRoom = true;
        }
      });
      
      // Handle newMessage or receiveMessage event
      this.socket.on('newMessage', (data) => this.handleIncomingMessage(data));
      this.socket.on('receiveMessage', (data) => this.handleIncomingMessage(data));
      
      // Fallback: try to join room directly after a timeout
      setTimeout(() => {
        if (!this.socket) return;
        console.log('Fallback: trying to join room directly');
        this.socket.emit('joinRoom', { room_id: this.room_id, user_id: this.user_id });
      }, 3000);
    });
  }

  authenticate() {
    if (!this.isConnected) return;
    
    console.log('Authenticating with user_type:', this.user_type, 'user_id:', this.user_id);
    this.socket.emit('authenticate', {
      user_type: this.user_type,
      user_id: this.user_id
    });
  }

  joinRoom() {
    if (!this.isConnected || this.hasJoinedRoom) return;
    
    console.log('Joining room:', this.room_id);
    
    // Try both methods for joining
    this.socket.emit('joinRequest', {
      request_id: this.room_id,
      user_type: this.user_type,
      user_id: this.user_id
    });
    
    this.socket.emit('joinRoom', {
      room_id: this.room_id,
      user_id: this.user_id
    });
    
    // Set this immediately (don't wait for server response)
    console.log('Assuming room join success');
    this.hasJoinedRoom = true;
  }

  setMessageHandler(handler) {
    this.messageHandler = handler;
  }

  handleIncomingMessage(data) {
    console.log('Received message:', data);
    
    // Check actual data structure
    console.log('Message data structure:', JSON.stringify(data));
    
    // Support both old and new data formats
    const message = data.message || data.text || '';
    const sender = data.sender || data.sender_id || data.user_id || 'unknown';
    
    // Skip messages from ourselves to avoid duplicates
    if (sender === this.user_id) {
      console.log('Skipping message from self to avoid duplicate');
      return;
    }
    
    // Simplify message format
    const processedMessage = {
      sender: sender,
      message: message,
    };
    
    console.log('Processed message:', processedMessage);
    
    if (this.messageHandler) {
      this.messageHandler(processedMessage);
    }
  }

  sendMessage(messageText) {
    if (!messageText.trim() || !this.isConnected) return false;
    
    // Use event name as in index.html: chatMessage
    const messageData = {
      request_id: this.room_id,
      sender_type: this.user_type,
      sender_id: this.user_id,
      message: messageText.trim()
    };
    
    console.log('Sending message with chatMessage event:', messageData);
    this.socket.emit('chatMessage', messageData);
    
    // Also send with legacy event name as backup
    const legacyData = {
      room_id: this.room_id,
      user_id: this.user_id,
      message: messageText.trim()
    };
    console.log('Also sending with sendMessage event:', legacyData);
    this.socket.emit('sendMessage', legacyData);
    
    // Return the message object to be added to local state
    return {
      sender: this.user_id,
      message: messageText.trim(),
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected socket');
      this.socket = null;
    }
  }

  // AsyncStorage methods
  async saveMessages(messages) {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to AsyncStorage:", error);
    }
  }

  async loadMessages() {
    try {
      const cachedMessages = await AsyncStorage.getItem(this.storageKey);
      if (cachedMessages) {
        return JSON.parse(cachedMessages);
      }
      return [];
    } catch (error) {
      console.error("Error loading messages from AsyncStorage:", error);
      return [];
    }
  }
}

export default ChatService;