import React from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator,Button } from "react-native";
import StatusItem from "../../components/StatusItem"; // ปรับเส้นทางให้ตรงตามที่คุณจัดเก็บไฟล์
import { useFonts } from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons";

import tw from "twrnc"; // import twrnc
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

const HomePage = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "Mitr-Regular": require("../../assets/fonts/Mitr-Regular.ttf"), // ใช้ฟอนต์ที่คุณต้องการ
    "Mitr-Medium": require("../../assets/fonts/Mitr-Medium.ttf"), // ฟอนต์หนา
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-500 justify-center items-center `}>
      <View style={tw` justify-center items-center flex flex-col mb-10 `}>
          <View style={tw`bg-lime-600 w-3/5 h-20 justify-around items-center mb-10 rounded-lg pr-5 pl-5 mt-5`}>
            <Button title="ร้านแนะนำ" color="white" onPress={() => navigation.navigate("RecommendedStore")}  />
          </View>
          <View style={tw`bg-lime-600 w-3/5 h-20 justify-around items-center mb-10 rounded-lg pr-5 pl-5`}><Text>ตำแหน่งต้นทาง</Text></View>
          <View style={tw`bg-lime-600 w-3/5 h-20 justify-around items-center mb-10`}><Text>ตำแหน่งปลายทาง</Text></View>
          <View style={tw` w-full h-20 flex flex-row mb-10`}>
            <View style={tw`bg-white w-2/6 justify-around items-center rounded-lg`}><Text>ตำแหน่งที่สร้างไว้</Text></View>
            <View style={tw`bg-white w-2/6 justify-around items-center rounded-lg`}><Text>ตำแหน่งที่สร้างไว้</Text></View>
            <View style={tw`bg-white w-2/6 justify-around items-center rounded-lg`}><Text>ตำแหน่งที่สร้างไว้</Text></View>
          </View>
          <View style={tw`bg-lime-600 w-64 h-20 justify-around items-center`}>
            <Text style={tw`text-white text-3xl font-bold `}>โฆษณา</Text>
          </View>
        </View>
    </SafeAreaView>
  );
};

export default HomePage;
