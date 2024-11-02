import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

import { useRoute } from "@react-navigation/native";

const locations = [
  {
    id: "1",
    title: "Sripatum University",
    address: "Phahonyothin Road, Sena Nikhom, Chatuchak, ",
    distance: "32.0 km",
  },
  {
    id: "2",
    title: "Sripatum University International College",
    address: "Phahonyothin Road, Sena Nikhom, Chatuchak,",
    distance: "31.0 km",
  },
  {
    id: "3",
    title: "Sripatum University Chonburi Campus",
    address: "Khlong Tamru, Chon Buri District, ",
    distance: "45.0 km",
  },
  {
    id: "4",
    title: "School of Engineering, Sripatum University",
    address: "Phahonyothin Road, Sena Nikhom, Chatuchak, ",
    distance: "32.0 km",
  },
  {
    id: "5",
    title: "International Continuing Education Center, Sripatum",
    address: "Phahonyothin Road, Sena Nikhom, Chatuchak, ",
    distance: "32.0 km",
  },
];





export default function Mapdetail({ navigation }) {

  const route = useRoute();
  
  // const origin = route.params?.origin || "ไม่ระบุ";
  // const destination = route.params?.destination || "ไม่ระบุ";
  const confirmOrigin = route.params?.confirmOrigin || "ไม่ระบุ";
  const confirmDestination = route.params?.confirmDestination || "ไม่ระบุ";

  return (

    
    
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4`}>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`ml-3 text-lg font-bold`}>Map Details</Text>
        </View>

        {/* Pickup Location Input */}
        <View style={tw`flex-row items-center mt-4 bg-gray-200 rounded-lg`}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color="red"
            style={tw`ml-2`}
          />
          <TextInput
            style={tw`flex-1 p-2 text-gray-700`}
            placeholder="Enter pickup location"
            value={confirmOrigin.length ? confirmOrigin : "Enter Pickup Location"} 
         />
             
        </View>

        {/* Destination Location Input */}
        <View style={tw`flex-row items-center mt-4 bg-gray-200 rounded-lg`}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color="green"
            style={tw`ml-2`}
          />
          <TextInput
            style={tw`flex-1 p-2 text-gray-700`}
            placeholder="Enter destination"
            value={confirmDestination.length ? confirmDestination : "Enter Destination Location"}
          />
        </View>
        <View>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mt-6 p-4 bg-gray-100 rounded-lg`}
            onPress={() => {
              navigation.navigate("MapPage");
            }}
          >
            <View style={tw`flex-row items-center`}>
              <MaterialIcons name="map" size={24} color="black" />
              <Text style={tw`ml-3 text-gray-800 text-lg`}>
                Choose from map
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {/* Divider */}
        <View style={tw`border-b border-gray-300 my-4`} />

        {/* Location List */}
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}
            >
              <View>
                <Text style={tw`font-semibold text-gray-800`}>
                  {item.title}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>{item.address}</Text>
              </View>
              <Text style={tw`text-gray-700`}>{item.distance}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Floating Action Button */}
      {/* <TouchableOpacity
        style={tw`absolute bottom-10 left-10 right-10 bg-blue-600 p-4 rounded-full flex-row items-center justify-center`}
        onPress={() => {
          // Implement map navigation here
          console.log("Navigating to map...");
        }}
      >
        <MaterialIcons name="map" size={24} color="white" />
        <Text style={tw`ml-2 text-white font-semibold`}>Choose from map</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};


