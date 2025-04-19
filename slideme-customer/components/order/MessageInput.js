import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const MessageInput = ({
  moreDetail,
  showModal2,
  setShowModal2,
  preMoreDetail,
  setPreMoreDetail,
  handleRequestSubmit
}) => {
  const charCount = preMoreDetail ? preMoreDetail.length : 0;
  const maxChars = 255;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.messageBox}
        activeOpacity={0.7}
        onPress={() => setShowModal2(true)}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="message" size={24} color="#4B5563" />
        </View>
        <Text style={styles.labelText}>ข้อความถึงคนขับ</Text>
        <Text style={styles.valueText} numberOfLines={2} ellipsizeMode="tail">
          {moreDetail ? moreDetail : "คลิกเพื่อเพิ่มข้อความถึงคนขับ..."}
        </Text>
        <MaterialIcons
          name="edit"
          size={20}
          color="#9CA3AF"
          style={styles.icon}
        />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showModal2}
        animationType="fade"
        onRequestClose={() => setShowModal2(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ข้อความถึงคนขับ</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="เช่น สถานที่จุดนัดพบ, รายละเอียดเพิ่มเติม..."
                value={preMoreDetail}
                onChangeText={setPreMoreDetail}
                multiline={true}
                maxLength={maxChars}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {charCount}/{maxChars}
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setShowModal2(false)}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
              </TouchableOpacity>
              
              {preMoreDetail ? (
                <TouchableOpacity
                  onPress={() => setPreMoreDetail("")}
                  style={[styles.button, styles.clearButton]}
                >
                  <Text style={styles.clearButtonText}>ล้างข้อมูล</Text>
                </TouchableOpacity>
              ) : null}
              
              <TouchableOpacity
                onPress={handleRequestSubmit}
                style={[styles.button, styles.confirmButton, preMoreDetail ? {} : { flex: 2 }]}
              >
                <Text style={styles.confirmButtonText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  messageBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  valueText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: '#1F2937',
    paddingRight: 24,
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: "Mitr-Regular",
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  inputContainer: {
    padding: 16,
  },
  textInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: '#1F2937',
  },
  charCount: {
    alignSelf: 'flex-end',
    marginTop: 8,
    fontFamily: "Mitr-Regular",
    fontSize: 12,
    color: '#6B7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  clearButton: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FEF2F2',
  },
  confirmButton: {
    backgroundColor: '#60B876',
  },
  cancelButtonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: '#4B5563',
  },
  clearButtonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: '#EF4444',
  },
  confirmButtonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: 'white',
  },
});

export default MessageInput;