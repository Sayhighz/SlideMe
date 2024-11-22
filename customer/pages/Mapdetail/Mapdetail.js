import React  , { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { UserContext } from "../../UserContext";
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
  {
    id: "6",
    title: "International Continuing Education Center, Sripatum",
    address: "Phahonyothin Road, Sena Nikhom, Chatuchak, ",
    distance: "32.0 km",
  },  {
    id: "7",
    title: "International Continuing Education Center, Sripatum",
    address: "Phahonyothin Road, Sena Nikhom, Chatuchak, ",
    distance: "32.0 km",
  },
];






export default function Mapdetail({ navigation }) {

  const route = useRoute();
  
  const origin = route.params?.origin || <Text style={styles.globalText}>ไม่ระบุ</Text>;
  const destination = route.params?.destination || <Text style={styles.globalText}>ไม่ระบุ</Text>;
  const confirmOrigin = route.params?.confirmOrigin || <Text style={styles.globalText}>ไม่ระบุ</Text>;
  const confirmDestination = route.params?.confirmDestination || <Text style={styles.globalText}>ไม่ระบุ</Text>;
  const {  userData } = useContext(UserContext);

  return (

    
    
    <SafeAreaView style={tw`bg-white relative flex-1`}>
      <View style={tw`p-4 flex-1`}>
        {/* <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`ml-3 text-lg font-bold`}>Map Details</Text>
        </View> */}

        {/* Pickup Location Input */}
        <View style={tw`flex-row items-center mt-4 bg-gray-200 rounded-lg`}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color="red"
            style={tw`ml-2`}
          />
          <TextInput
            style={[styles.globalText , tw`flex-1 p-2 text-gray-700`]}
            placeholder="Enter pickup location"
            value={confirmOrigin.length ? confirmOrigin : "สถานที่รับรถ"} 
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
            style={[styles.globalText , tw`flex-row p-2 text-gray-700`]}
            placeholder="Enter destination"
            value={confirmDestination.length ? confirmDestination : "สถานที่ปลายทาง"}
          />
        </View>
        <View >
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mt-6 p-4 bg-gray-100 rounded-lg`}
            onPress={() => {
              navigation.navigate("MapPage");
            }}
          >
            <View style={tw`flex-row items-center`}>
              <MaterialIcons name="map" size={24} color="black" />
              <Text style={[styles.globalText , tw`ml-3 text-gray-800 text-lg`]}>
                เลือกสถานที่
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {/* Divider */}
        <View style={tw`border-b border-gray-300 my-4`} />

        {/* Location List */}
        <View style={tw` h-5/12`}>
          <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            style={tw`flex-row justify-between items-center py-2 border-b border-gray-200`}
            >
                <View>
                  <Text style={[styles.globalText ,tw`font-semibold text-gray-800`]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.globalText , tw`text-sm text-gray-500`]}>{item.address}</Text>
                </View>
                <Text style={[styles.globalText , tw`text-gray-700`]}>{item.distance}</Text>
              </TouchableOpacity>
            )}
            />
          </View>
        
        <TouchableOpacity 
          style={tw`absolute bottom-4 self-center bg-white border-2 border-[#60B876] p-4 rounded-full bg-[#60B876]`}
            onPress={() => {
              navigation.navigate("Order",{
                origin,
                destination,
                confirmOrigin,
                confirmDestination,
              });
            }}
        >
          <Text style={[ styles.globalText, tw`text-xl font-bold text-white`]}>
            ยืนยัน
          </Text>
        </TouchableOpacity>
        
      </View>

    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular', 
  },
});


