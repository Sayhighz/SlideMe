import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const CancelModal = ({ visible, onCancel, onConfirm }) => {
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
            tw`bg-white rounded-2xl p-6 w-4/5 max-w-sm`,
            styles.shadowProp,
            {
              transform: [{ scale: modalScale }],
              opacity: modalOpacity
            }
          ]}
        >
          <View style={tw`items-center mb-5`}>
            <View style={tw`bg-red-100 p-3 rounded-full mb-3`}>
              <MaterialIcons name="error-outline" size={36} color="#f56565" />
            </View>
            <Text style={[styles.globalText, tw`text-xl font-medium text-gray-800`]}>
              ยืนยันการยกเลิก
            </Text>
            <Text style={[styles.globalText, tw`text-center text-gray-600 mt-2 px-2`]}>
              คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการขอรถครั้งนี้?
            </Text>
          </View>
          
          <View style={tw`flex-row justify-between mt-3`}>
            <TouchableOpacity
              style={[tw`flex-1 py-3 rounded-xl mr-2 flex-row justify-center items-center`, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={20} color="#4a5568" />
              <Text style={[styles.globalText, tw`text-gray-700 ml-2 font-medium`]}>
                ไม่
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`flex-1 bg-red-500 py-3 rounded-xl ml-2 flex-row justify-center items-center`}
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
  cancelButton: {
    backgroundColor: "#F3F4F6", // Light gray background for cancel button
    borderWidth: 1,
    borderColor: "#E5E7EB",
  }
});

export default CancelModal;