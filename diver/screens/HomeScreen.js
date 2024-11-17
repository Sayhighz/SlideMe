// screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";



export default function HomeScreen() {
  const navigation = useNavigation();
  const notice = [
    { id: 1, title: "แจ้งเตือนที่ 1", description: "โปรดอ่าน" },
    { id: 2, title: "แจ้งเตือนที่ 2", description: "ข่าวสาร" },
    { id: 3, title: "แจ้งเตือนที่ 3", description: "แจ้งเตือน" },
  ];

  // Mockup data for offers list
  const mockData = [
    {
      id: 1,
      source: "ต้นทาง 1",
      destination: "ปลายทาง 1",
      status: "สถานะ 1",
      type: "ประเภท 1",
      price: "1,500",
    },
    {
      id: 2,
      source: "ต้นทาง 2",
      destination: "ปลายทาง 2",
      status: "สถานะ 2",
      type: "ประเภท 2",
      price: "2,000",
    },
    {
      id: 3,
      source: "ต้นทาง 3",
      destination: "ปลายทาง 3",
      status: "สถานะ 3",
      type: "ประเภท 3",
      price: "3,000",
    },
    {
      id: 4,
      source: "ต้นทาง 4",
      destination: "ปลายทาง 4",
      status: "สถานะ 4",
      type: "ประเภท 3",
      price: "4,000",
    },
    // Add more mock data if needed
  ];

  

  return (
    <View style={tw`flex-1 bg-white`}>
      
        {/* Profile Section */}
        <View style={tw`flex-row items-center mt-10 p-2 w-19/20 mx-auto`}>
          <Image
            source={{ uri: "https://example.com/profile.jpg" }}
            style={tw`w-24 h-24 rounded-full border-4 border-gray-400`}
          />
          <View style={tw`ml-4`}>
            <Text style={[styles.globalText , tw`text-2xl`]}>สวัสดี!</Text>
            <Text style={[styles.globalText , tw`text-2xl font-bold text-green-600`]}>
              คุณคุณาธิป อู่ทอง
            </Text>
          </View>
        </View>

        {/* Earnings Section */}
        <View
          style={tw`flex-row justify-around w-19/20 mx-auto mt-4 p-4 bg-gray-100 rounded-lg`}
        >
          <View style={tw`items-center`}>
            <Text style={[styles.globalText ,tw`text-2xl font-bold text-green-600`]}>฿50.00</Text>
            <Text style={[styles.globalText ,tw`text-gray-600`]}>รายได้วันนี้</Text>
          </View>
        </View>

        {/* Offer List Section with Vertical Scrolling */}
        <View
          style={tw`w-19/20 mx-auto bg-white mt-4 rounded-lg p-4 border border-gray-200 h-64 shadow-lg`}
        >
          <Text style={[styles.globalText ,tw`text-gray-600 text-xl mb-2 text-center`]}>รายการเสนอราคา</Text>
          
            <FlatList
              data={mockData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={tw`flex-row justify-between p-2 bg-white rounded-lg mb-2 shadow-md border border-gray-300`}
                >
                  <View style={tw``}>
                    <Text style={[styles.globalText , styles.textSize ]}>{item.source}</Text>
                    <Text style={[styles.globalText]}>{item.destination}</Text>
                  </View>
                  <View>
                    <Text style={[styles.globalText, styles.textSize]}>{item.status}</Text>
                    <Text style={[styles.globalText, styles.textSize]}>{item.type}</Text>
                  </View>

                  <View>
                    <Text style={[styles.globalText , styles.textSize]}>ราคาที่เสนอ</Text>
                    <Text style={[styles.globalText , styles.textSize]}>{item.price}</Text>
                  </View>
                </View>
              )}

              
            />
          
        </View>

        {/* Notice/Swiper Section */}
        <View style={tw`w-19/20 mx-auto h-40 bg-gray-200 mt-4 mb-20 rounded-lg`}>
          <Swiper
            autoplay
            autoplayTimeout={3}
            showsPagination
            loop
            activeDotColor="green"
            dotColor="gray"
            dotStyle={tw`w-2 h-2 bg-gray-600 rounded-full`}
            activeDotStyle={tw`w-3 h-3 bg-green-500 rounded-full`}
          >
            {notice.map((ad) => (
              <View
                key={ad.id}
                style={tw`flex items-center justify-center w-full h-full`}
              >
                <Text style={[styles.globalText ,tw`text-gray-600 text-xl`]}>{ad.description}</Text>
              </View>
            ))}
          </Swiper>
        </View>
      

      {/* Button Section Fixed at the Bottom */}
      <View style={tw`absolute bottom-4 w-full items-center`}>
        <TouchableOpacity
          style={tw`w-11/12 bg-green-500 rounded-full p-4 items-center`}
          onPress={() => navigation.navigate("JobsScreen")}
        >
          <Text style={tw`text-white font-bold text-lg`}>ค้นหางาน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular',
  },
  textSize :{
    fontSize: 16
  }
});