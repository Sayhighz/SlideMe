import React from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

const MainButton = ({ navigation, styles }) => {
  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.92;

  return (
    <View style={tw`w-full justify-center items-center`}>
      <TouchableOpacity
        style={[tw`w-full shadow-xl`, {
          shadowColor: "#60B876",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 10,
        }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Order")}
      >
        <LinearGradient
          colors={["#73CB89", "#60B876", "#4DA864"]}
          style={[
            tw`rounded-3xl flex-row items-center justify-center border border-gray-100`,
            {
              width: responsiveWidth,
              height: height * 0.22,
              paddingHorizontal: 24,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons
            name="car-repair"
            size={78}
            color="white"
            style={tw`mr-6`}
          />
          <View>
            <Text
              style={[
                styles.globalText,
                tw`text-white text-xl font-light tracking-wider`,
              ]}
            >
              เรียกบริการ
            </Text>
            <Text 
              style={[
                styles.globalText, 
                tw`text-white text-4xl font-medium tracking-wide`
              ]}
            >
              รถสไลด์
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default MainButton;