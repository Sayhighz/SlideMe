import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import tw from "twrnc";
import dayjs from "dayjs";
import "dayjs/locale/th";

const DateTimePickerComponent = ({ 
  formattedDate, 
  date, 
  setDate, 
  showPicker, 
  setShowPicker,
  showModal,
  setShowModal,
  showDatePicker,
  setShowDatePicker,
  showTimePicker,
  setShowTimePicker,
  formattedTime,
  handleDateChange,
  confirmDate
}) => {
  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Unified date/time picker modal for iOS
  const renderIOSDatePicker = () => {
    return (
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เลือกวันและเวลา</Text>
            </View>
            
            <View style={styles.pickerContainer}>
              <RNDateTimePicker
                mode="datetime"
                display="spinner"
                value={date}
                onChange={onChange}
                locale="th"
                minimumDate={new Date()}
                maximumDate={new Date("2024-12-31")}
                textColor="#000000"
                style={styles.datePicker}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={confirmDate}
                style={[styles.button, styles.confirmButton]}
              >
                <Text style={styles.confirmButtonText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Separate date and time picker modals for Android
  const renderAndroidDatePicker = () => {
    return (
      <>
        {showDatePicker && (
          <RNDateTimePicker
            value={date}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            minimumDate={new Date()}
            maximumDate={new Date("2024-12-31")}
          />
        )}
        
        {showTimePicker && (
          <RNDateTimePicker
            value={date}
            mode="time"
            display="clock"
            onChange={handleDateChange}
          />
        )}
        
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>เลือกวันและเวลา</Text>
              </View>
              
              <View style={styles.androidPickerContainer}>
                <Text style={styles.pickerLabel}>วันที่</Text>
                <TouchableOpacity
                  style={styles.androidPickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {formattedDate ? formattedDate.split(' ')[0] : 'เลือกวันที่'}
                  </Text>
                  <MaterialIcons name="calendar-today" size={20} color="#60B876" />
                </TouchableOpacity>
                
                <Text style={[styles.pickerLabel, tw`mt-4`]}>เวลา</Text>
                <TouchableOpacity
                  style={styles.androidPickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {formattedTime || 'เลือกเวลา'}
                  </Text>
                  <MaterialIcons name="access-time" size={20} color="#60B876" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={[styles.button, styles.confirmButton]}
                >
                  <Text style={styles.confirmButtonText}>ยืนยัน</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          Platform.OS === "ios" ? setShowPicker(true) : setShowModal(true)
        }
        style={styles.selector}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="event" size={24} color="#4B5563" />
        </View>
        <Text style={styles.labelText}>วันและเวลา</Text>
        <Text style={styles.valueText}>
          {formattedDate ? `${formattedDate}` : "เลือกวันและเวลา"}
        </Text>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color="#9CA3AF"
          style={styles.icon}
        />
      </TouchableOpacity>

      {Platform.OS === "ios" ? renderIOSDatePicker() : renderAndroidDatePicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  selector: {
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
    top: '50%',
    marginTop: Platform.OS === 'ios' ? 0 : -8,
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
  pickerContainer: {
    padding: 16,
  },
  datePicker: {
    height: 200,
    marginHorizontal: -10,
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
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#60B876',
  },
  cancelButtonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: '#4B5563',
  },
  confirmButtonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: 'white',
  },
  androidPickerContainer: {
    padding: 16,
  },
  pickerLabel: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  androidPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  pickerButtonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    color: '#1F2937',
  },
});

export default DateTimePickerComponent;