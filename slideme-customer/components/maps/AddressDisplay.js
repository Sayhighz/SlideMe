import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";

const AddressDisplay = ({ title, address, titleStyle, addressStyle, isLoading }) => {
  return (
    <View style={tw`px-2`}>
      <Text style={[styles.globalText, tw`text-xl font-bold mb-2 text-[#4B5563]`, titleStyle]}>
        {title}
      </Text>
      
      <View style={tw`flex-row items-start`}>
        <MaterialIcons 
          name="location-on" 
          size={22} 
          color="#4B5563" 
          style={tw`mr-2 mt-0.5`} 
        />
        
        <View style={tw`flex-1`}>
          {address ? (
            <Text 
              style={[styles.globalText, tw`text-gray-600 leading-5 text-base`, addressStyle]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {address}
            </Text>
          ) : (
            <Text 
              style={[styles.globalText, tw`text-gray-400 leading-5 italic text-base`, addressStyle]}
              numberOfLines={1}
            >
              กรุณาเลือกสถานที่
            </Text>
          )}
        </View>
        
        {isLoading && (
          <ActivityIndicator size="small" color="#3B82F6" style={tw`ml-2`} />
        )}
      </View>

      {address && (
        <Text style={[styles.globalText, tw`text-blue-500 mt-2 text-sm`]}>
          เลือกตำแหน่งที่ถูกต้องบนแผนที่
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default AddressDisplay;