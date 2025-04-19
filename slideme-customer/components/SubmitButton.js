import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import tw from "twrnc";

const SubmitButton = ({ onPress, title, disabled = false, isLoading = false }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          disabled || isLoading ? styles.buttonDisabled : null
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
      
      {/* เพิ่ม Safe Area สำหรับ iPhone X และใหม่กว่า */}
      {Platform.OS === 'ios' && <View style={styles.bottomSafeArea} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#60B876',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    fontFamily: "Mitr-Regular",
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  bottomSafeArea: {
    height: Platform.OS === 'ios' ? 24 : 0,
  }
});

export default SubmitButton;