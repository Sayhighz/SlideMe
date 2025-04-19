import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

const BookmarkItem = ({ item, handleRequestFromBookmark, styles, truncateText }) => {
  const { width } = Dimensions.get("window");
  
  return (
    <TouchableOpacity
      style={[
        tw`mb-3 shadow-md rounded-xl overflow-hidden`,
        { width: width * 0.75 },
      ]}
      onPress={() => handleRequestFromBookmark(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["#FFFFFF", "#F9FEFC"]}
        style={tw`p-3 border border-gray-100`}
      >
        <LinearGradient
          colors={["#60B876", "#55A76B"]}
          style={tw`py-1.5 px-3 rounded-lg mb-3 self-center`}
        >
          <Text
            style={[
              tw`text-base font-semibold text-white text-center`,
              styles.globalText,
            ]}
          >
            {item.save_name}
          </Text>
        </LinearGradient>

        <View style={tw`py-1`}>
          <View style={tw`flex-row items-center mb-2.5 bg-white/90 p-1.5 rounded-lg`}>
            <View style={tw`bg-[#60B876]/10 p-1 rounded-full`}>
              <MaterialIcons
                name="directions-car"
                size={20}
                color="#60B876"
              />
            </View>
            <Text
              style={[styles.globalText, tw`text-gray-700 ml-2 text-sm`]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.vahicle_type}
            </Text>
          </View>

          <View style={tw`flex-row items-center mb-2.5 bg-white/90 p-1.5 rounded-lg`}>
            <View style={tw`bg-red-500/10 p-1 rounded-full`}>
              <MaterialIcons
                name="location-pin"
                size={20}
                color="#E53935"
              />
            </View>
            <Text
              style={[styles.globalText, tw`text-gray-700 ml-2 text-sm`]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {truncateText(item.location_from)}
            </Text>
          </View>

          <View style={tw`flex-row items-center bg-white/90 p-1.5 rounded-lg`}>
            <View style={tw`bg-[#60B876]/10 p-1 rounded-full`}>
              <MaterialIcons
                name="location-pin"
                size={20}
                color="#60B876"
              />
            </View>
            <Text
              style={[styles.globalText, tw`text-gray-700 ml-2 text-sm`]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {truncateText(item.location_to)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default BookmarkItem;