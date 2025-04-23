// components/rating/ActionButtons.js
import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Animated,
  Easing 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 
import tw from "twrnc";

const ActionButtons = ({ onSubmit, onBack, isSubmitting }) => {
  // Animation for the button scale effect
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={tw`w-full mt-4`}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onSubmit}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isSubmitting}
          style={[
            tw`rounded-xl p-4 mb-3`,
            styles.primaryButton,
            isSubmitting && styles.disabledButton,
          ]}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <View style={tw`flex-row justify-center items-center`}>
              <ActivityIndicator size="small" color="#fff" style={tw`mr-2`} />
              <Text style={[styles.buttonText, tw`text-white text-center`]}>
                กำลังส่ง...
              </Text>
            </View>
          ) : (
            <View style={tw`flex-row justify-center items-center`}>
              <Text style={[styles.buttonText, tw`text-white text-center`]}>
                ส่งรีวิว
              </Text>
              <MaterialIcons name="send" size={20} color="white" style={tw`ml-2`} />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* <TouchableOpacity
        onPress={onBack}
        style={[tw`rounded-xl p-3`, styles.secondaryButton]}
        activeOpacity={0.7}
      >
        <View style={tw`flex-row justify-center items-center`}>
          <MaterialIcons name="arrow-back" size={18} color="#60B876" style={tw`mr-2`} />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            ย้อนกลับ
          </Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#60B876",
    shadowColor: "#60B876",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#60B876",
  },
  disabledButton: {
    backgroundColor: "#a0d8ae",
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 16,
    fontWeight: "500",
  },
  secondaryButtonText: {
    color: "#60B876",
  },
});

export default ActionButtons;