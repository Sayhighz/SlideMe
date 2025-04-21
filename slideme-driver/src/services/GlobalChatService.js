import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { IP_ADDRESS } from "../config";

/**
 * GlobalChatService - สำหรับการจัดการการเชื่อมต่อ WebSocket และข้อความในระดับแอปพลิเคชัน
 * Service นี้จะทำงานตลอดช่วงการทำงานของคนขับตั้งแต่รับงานจนถึงส่งมอบ
 */
class GlobalChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isAuthenticated = false;
    this.hasJoinedRoom = false;
    this.messageHandlers = new Map(); // เก็บ handlers จากหลายหน้าจอ
    this.currentRoomId = null;
    this.userId = null;
    this.userType = null;
    this.debug = true; // ตั้งค่าเป็น false ในโหมด production
  }

  log(message, ...args) {
    if (this.debug) {
      console.log(`[GlobalChatService] ${message}`, ...args);
    }
  }

  /**
   * เริ่มเซอร์วิสและเชื่อมต่อกับห้องสนทนา
   * @param {string} room_id - ID ของห้องสนทนา
   * @param {string} user_id - ID ของผู้ใช้ (คนขับ)
   * @param {string} user_type - ประเภทผู้ใช้ (คนขับ)
   */
  initialize(room_id, user_id, user_type = "driver") {
    this.log("Initializing with room:", room_id, "user:", user_id);
    
    // บันทึกข้อมูลห้องและผู้ใช้
    this.currentRoomId = room_id;
    this.userId = user_id;
    this.userType = user_type;
    this.storageKey = `chat_messages_${room_id}`;
    
    // เชื่อมต่อ socket หากยังไม่ได้เชื่อมต่อ
    if (!this.socket) {
      this.connect();
    } else if (this.currentRoomId && this.currentRoomId !== room_id) {
      // หากมีการเปลี่ยนห้อง ให้เชื่อมต่อใหม่
      this.disconnect();
      this.connect();
    }
    
    return this;
  }

  /**
   * เชื่อมต่อกับเซิร์ฟเวอร์ socket
   */
  connect() {
    this.log("Connecting to socket server");
    
    // สร้างการเชื่อมต่อใหม่
    this.socket = io(`http://${IP_ADDRESS}:4000`);
    
    // จัดการกับเหตุการณ์การเชื่อมต่อ
    this.socket.on('connect', () => {
      this.log("Connected to socket server");
      this.isConnected = true;
      
      // ทำการยืนยันตัวตนทันทีหลังจากเชื่อมต่อ
      this.authenticate();
    });
    
    // จัดการกับเหตุการณ์การตัดการเชื่อมต่อ
    this.socket.on('disconnect', () => {
      this.log("Disconnected from socket server");
      this.isConnected = false;
      this.isAuthenticated = false;
      this.hasJoinedRoom = false;
    });
    
    // จัดการกับเหตุการณ์ข้อผิดพลาด
    this.socket.on('error', (data) => {
      console.error("Socket error:", data.message);
      if (typeof data === 'object' && data.message) {
        this.log("Socket error:", data.message);
      } else {
        this.log("Socket error:", data);
      }
    });
    
    // จัดการกับเหตุการณ์การยืนยันตัวตน
    this.socket.on('authenticated', (data) => {
      this.log("Authentication response:", data);
      if (data && data.success) {
        this.log("Authentication successful");
        this.isAuthenticated = true;
        
        // เข้าร่วมห้องหลังจากยืนยันตัวตนสำเร็จ
        this.joinRoom();
      }
    });
    
    // จัดการกับเหตุการณ์การเข้าร่วมห้อง (รองรับทั้งสองรูปแบบ)
    this.socket.on('joinedRequest', (data) => {
      this.log("Joined request response:", data);
      if (data && data.success) {
        this.log("Successfully joined room:", this.currentRoomId);
        this.hasJoinedRoom = true;
      }
    });
    
    this.socket.on('joinedRoom', (data) => {
      this.log("Joined room response:", data);
      if (data && data.success) {
        this.log("Successfully joined room:", this.currentRoomId);
        this.hasJoinedRoom = true;
      }
    });
    
    // จัดการกับเหตุการณ์ข้อความใหม่ (รองรับทั้งสองรูปแบบ)
    this.socket.on('newMessage', (data) => this.handleIncomingMessage(data));
    this.socket.on('receiveMessage', (data) => this.handleIncomingMessage(data));
    
    // ลองเข้าร่วมห้องโดยตรงหลังจากหมดเวลา (fallback)
    setTimeout(() => {
      if (!this.socket || this.hasJoinedRoom) return;
      this.log("Fallback: trying to join room directly");
      this.socket.emit('joinRoom', { 
        room_id: this.currentRoomId, 
        user_id: this.userId 
      });
    }, 3000);
  }

  /**
   * ยืนยันตัวตนกับเซิร์ฟเวอร์
   */
  authenticate() {
    if (!this.isConnected || !this.socket) return;
    
    this.log("Authenticating with user_type:", this.userType, "user_id:", this.userId);
    this.socket.emit('authenticate', {
      user_type: this.userType,
      user_id: this.userId
    });
  }

  /**
   * เข้าร่วมห้องสนทนา
   */
  joinRoom() {
    if (!this.isConnected || !this.socket || this.hasJoinedRoom || !this.currentRoomId) return;
    
    this.log("Joining room:", this.currentRoomId);
    
    // ลองทั้งสองวิธีในการเข้าร่วมห้อง
    this.socket.emit('joinRequest', {
      request_id: this.currentRoomId,
      user_type: this.userType,
      user_id: this.userId
    });
    
    this.socket.emit('joinRoom', {
      room_id: this.currentRoomId,
      user_id: this.userId
    });
  }

  /**
   * ลงทะเบียน handler สำหรับรับข้อความใหม่จากห้องที่ระบุ
   * 
   * @param {string} screenId - เอกลักษณ์ของหน้าจอ (เช่น "ChatScreen", "JobWorkingPickup")
   * @param {Function} handler - ฟังก์ชันที่จะถูกเรียกเมื่อมีข้อความใหม่
   */
  registerMessageHandler(screenId, handler) {
    this.log(`Registering message handler for screen: ${screenId}`);
    this.messageHandlers.set(screenId, handler);
  }

  /**
   * ยกเลิกการลงทะเบียน handler ของหน้าจอที่ระบุ
   * 
   * @param {string} screenId - เอกลักษณ์ของหน้าจอที่ต้องการยกเลิก
   */
  unregisterMessageHandler(screenId) {
    this.log(`Unregistering message handler for screen: ${screenId}`);
    if (this.messageHandlers.has(screenId)) {
      this.messageHandlers.delete(screenId);
    }
  }

  /**
   * จัดการกับข้อความขาเข้า
   * 
   * @param {Object} data - ข้อมูลข้อความที่ได้รับ
   */
  handleIncomingMessage(data) {
    this.log("Received message:", data);
    
    // ตรวจสอบโครงสร้างข้อมูลจริง
    this.log("Message data structure:", JSON.stringify(data));
    
    // รองรับทั้งรูปแบบข้อมูลเก่าและใหม่
    const message = data.message || data.text || '';
    const sender = data.sender || data.sender_id || data.user_id || 'unknown';
    const senderType = data.sender_type || (sender === this.userId ? this.userType : 'customer');
    
    // ข้ามข้อความจากตัวเองเพื่อหลีกเลี่ยงข้อความซ้ำ
    if (sender === this.userId) {
      this.log("Skipping message from self to avoid duplicate");
      return;
    }
    
    // ทำให้รูปแบบข้อความง่ายขึ้น
    const processedMessage = {
      sender,
      sender_type: senderType,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.log("Processed message:", processedMessage);
    
    // เรียก handler ทั้งหมดที่ลงทะเบียนไว้
    this.messageHandlers.forEach((handler, screenId) => {
      this.log(`Calling message handler for screen: ${screenId}`);
      handler(processedMessage);
    });
    
    // บันทึกข้อความลงใน AsyncStorage
    this.appendMessageToStorage(processedMessage);
  }

  /**
   * ส่งข้อความไปยังห้องสนทนาปัจจุบัน
   * 
   * @param {string} messageText - ข้อความที่ต้องการส่ง
   * @returns {Object|null} - ข้อความที่ส่ง หรือ null หากไม่สามารถส่งได้
   */
  sendMessage(messageText) {
    if (!messageText.trim() || !this.isConnected || !this.socket || !this.currentRoomId) return null;
    
    // ใช้ชื่อเหตุการณ์ตามที่ index.html ใช้ คือ chatMessage
    const messageData = {
      request_id: this.currentRoomId,
      sender_type: this.userType,
      sender_id: this.userId,
      message: messageText.trim()
    };
    
    this.log("Sending message with chatMessage event:", messageData);
    this.socket.emit('chatMessage', messageData);
    
    // ส่งด้วยชื่อเหตุการณ์เดิมด้วยเผื่อเซิร์ฟเวอร์รับทั้งสองแบบ
    const legacyData = {
      room_id: this.currentRoomId,
      user_id: this.userId,
      message: messageText.trim()
    };
    this.log("Also sending with sendMessage event:", legacyData);
    this.socket.emit('sendMessage', legacyData);
    
    // สร้างข้อความสำหรับเพิ่มลงใน state ทันที (optimistic update)
    const newMessage = {
      sender: this.userId,
      sender_type: this.userType,
      message: messageText.trim(),
      timestamp: new Date().toISOString()
    };
    
    // บันทึกข้อความลงใน AsyncStorage
    this.appendMessageToStorage(newMessage);
    
    return newMessage;
  }

  /**
   * ตัดการเชื่อมต่อ WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.log("Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.isAuthenticated = false;
      this.hasJoinedRoom = false;
    }
  }

  /**
   * เพิ่มข้อความลงใน AsyncStorage
   * 
   * @param {Object} message - ข้อความที่ต้องการบันทึก
   */
  async appendMessageToStorage(message) {
    if (!this.currentRoomId) return;
    
    try {
      // อ่านข้อความที่มีอยู่
      const existingMessagesStr = await AsyncStorage.getItem(this.storageKey);
      let messages = [];
      
      if (existingMessagesStr) {
        messages = JSON.parse(existingMessagesStr);
      }
      
      // เพิ่มข้อความใหม่
      messages.push(message);
      
      // บันทึกกลับลง AsyncStorage
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(messages));
      this.log(`Saved message to AsyncStorage for room: ${this.currentRoomId}`);
    } catch (error) {
      console.error("Error saving message to AsyncStorage:", error);
    }
  }

  /**
   * โหลดข้อความทั้งหมดสำหรับห้องสนทนาปัจจุบัน
   * 
   * @returns {Array} - รายการข้อความทั้งหมด
   */
  async loadMessages() {
    if (!this.currentRoomId) return [];
    
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

  /**
   * บันทึกรายการข้อความทั้งหมดลง AsyncStorage
   * 
   * @param {Array} messages - รายการข้อความที่ต้องการบันทึก
   */
  async saveMessages(messages) {
    if (!this.currentRoomId) return;
    
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(messages));
      this.log(`Saved all messages to AsyncStorage for room: ${this.currentRoomId}`);
    } catch (error) {
      console.error("Error saving messages to AsyncStorage:", error);
    }
  }
}

// สร้างและส่งออก singleton instance
const globalChatService = new GlobalChatService();
export default globalChatService;