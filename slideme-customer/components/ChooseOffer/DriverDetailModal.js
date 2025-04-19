import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const DriverDetailModal = ({ visible, driver, fee = 0, onCancel, onConfirm }) => {
  // Animation for the modal appearance
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        tension: 70,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const modalScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const modalOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Handle case when no driver is selected
  if (!driver) {
    return null;
  }

  const totalPrice = driver.price + fee;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={[
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          tw`flex-1 justify-center items-center`,
        ]}
      >
        <Animated.View
          style={[
            tw`bg-white rounded-2xl p-6 w-11/12 max-w-sm`,
            styles.shadowProp,
            {
              transform: [{ scale: modalScale }],
              opacity: modalOpacity
            }
          ]}
        >
          <View style={tw`items-center mb-5`}>
            <View style={tw`h-20 w-20 rounded-full bg-blue-50 items-center justify-center mb-3`}>
              <MaterialIcons name="person" size={42} color="#3182CE" />
            </View>
            <Text style={[styles.globalText, tw`text-xl font-medium text-gray-800`]}>
              {driver.name}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <MaterialIcons name="star" size={16} color="#F6AD55" />
              <Text style={[styles.globalText, tw`text-gray-600 ml-1`]}>
                {driver.rating ? driver.rating.toFixed(1) : "0.0"}
              </Text>
            </View>
          </View>
          
          <View style={[tw`mb-5 bg-gray-50 rounded-xl p-4`, styles.infoCard]}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="payments" size={22} color="#3182CE" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={[styles.globalText, tw`text-gray-600 text-sm`]}>
                  ราคาทั้งหมด
                </Text>
                <Text style={[styles.globalText, tw`text-xl font-medium text-red-600`]}>
                  {totalPrice} บาท
                </Text>
                <Text style={[styles.globalText, tw`text-xs text-gray-500`]}>
                  รวมค่าธรรมเนียม {fee} บาท
                </Text>
              </View>
            </View>
            
            <View style={[styles.infoRow, tw`mt-3 pt-3 border-t border-gray-200`]}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="access-time" size={22} color="#3182CE" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={[styles.globalText, tw`text-gray-600 text-sm`]}>
                  เวลาโดยประมาณ
                </Text>
                <Text style={[styles.globalText, tw`text-lg font-medium text-gray-800`]}>
                  {driver.durationText || "-"} นาที
                </Text>
              </View>
            </View>
            
            <View style={[styles.infoRow, tw`mt-3 pt-3 border-t border-gray-200`]}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="map" size={22} color="#3182CE" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={[styles.globalText, tw`text-gray-600 text-sm`]}>
                  ระยะทาง
                </Text>
                <Text style={[styles.globalText, tw`text-lg font-medium text-gray-800`]}>
                  {driver.distance ? `${(driver.distance / 1000).toFixed(1)} กม.` : "- กม."}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={tw`flex-row justify-between mt-2`}>
            <TouchableOpacity
              style={[tw`flex-1 py-3 rounded-xl mr-2 flex-row justify-center items-center`, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={20} color="#4a5568" />
              <Text style={[styles.globalText, tw`text-gray-700 ml-2 font-medium`]}>
                ยกเลิก
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`flex-1 bg-green-500 py-3 rounded-xl ml-2 flex-row justify-center items-center`}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check" size={20} color="white" />
              <Text style={[styles.globalText, tw`text-white ml-2 font-medium`]}>
                ยืนยัน
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  infoCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6", // Light gray background for cancel button
    borderWidth: 1,
    borderColor: "#E5E7EB",
  }
});

export default DriverDetailModal;