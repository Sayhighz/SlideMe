import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const HeaderWithBackButton = ({ showBackButton, title, onPress, rightIcon }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              onPress={onPress}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        
        <View style={styles.rightContainer}>
          {rightIcon && rightIcon}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    width: '100%',
    zIndex: 100,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      }
    })
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  titleText: {
    fontFamily: "Mitr-Regular",
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  }
});

export default HeaderWithBackButton;