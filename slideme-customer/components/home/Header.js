import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

const Header = ({ userData, styles }) => {
  return (
    <View style={tw`w-full items-start px-2 mt-6`}>
      <View style={tw`border-l-4 border-[#60B876] pl-2`}>
        <Text
          style={[
            styles.globalText,
            tw`text-gray-500 text-sm mb-1`,
          ]}
        >
          สวัสดี
        </Text>
        <Text
          style={[
            styles.globalText,
            tw`text-2xl font-medium text-[#60B876] mb-2`,
          ]}
        >
          {userData?.first_name || userData?.phone_number}!
        </Text>
      </View>
    </View>
  );
};

export default Header;