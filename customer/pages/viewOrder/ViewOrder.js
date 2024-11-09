import { Pressable, SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { openURL } from "expo-linking";
import { rating } from "@material-tailwind/react";

export default function ViewOrder({ navigation }) {
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});

  const [driverInformation, setDriverInformation] = useState({});

  useEffect(() => {
    setOrigin({
      name: "ศรีปทุม",
      latitude: 13.855827502824274,
      longitude: 100.58551678180032,
    });
    setDestination({
      name: "เกษตร",
      latitude: 13.843811760571077,
      longitude: 100.57726985068038,
    });

    setDriverInformation({
      name: "นายคุณาธิป อู่ทอง",
      latitude: 13.875827502824274,
      longitude: 100.58551678180032,
      phone: "0808341035",
      rating: 4.5,
    });
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 relative `}>
      <View style={tw`flex-3`}>
        <View style={tw`z-10 flex-1 left-4 top-4 absolute`}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-2`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-1 flex-row justify-between px-4 items-end`}>
              <Text style={tw``}>10:12 AM 15 ม.ค. 2567</Text>
              <Text style={tw``}>xxxxxxxxxxxxxx</Text>
            </View>
            <View
              style={tw`flex-1 justify-around mx-4 px-4 bg-gray-200 rounded-lg`}
            >
              <View style={tw`flex-1 flex-row items-center`}>
                <MaterialIcons name="place" size={24} color="red" />
                <Text style={tw`items-center`}>ต้นทาง : {origin.name}</Text>
              </View>
              <View style={tw`flex-1 flex-row items-center`}>
                <MaterialIcons name="place" size={24} color="green" />
                <Text style={tw`items-center`}>
                  ปลายทาง : {destination.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`flex-2`}>
            <View style={tw`flex-1 bg-black justify-center`}>
              <MapView
                style={tw`flex-1`}
                initialRegion={{
                  latitude: 13.855890002666245,
                  longitude: 100.58553823947129,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={origin}
                  title="origin"
                  description="origin"
                />

                <Marker
                  coordinate={destination}
                  title="destination"
                  description="destination"
                  pinColor="green"
                />

                <Marker
                  coordinate={driverInformation}
                  title="driverLocation"
                  description="driverLocation"
                  pinColor="blue"
                />
              </MapView>
            </View>
          </View>
        </View>
        <View style={tw`flex-1`}>
          <Pressable
            style={tw`flex-1 flex-row bg-gray-300 m-4 rounded-lg items-center`}
          >
            <View style={tw`flex-1 items-center`}>
              <Text style={tw`text-2xl text-center `}>
                {driverInformation.name}
              </Text>
            </View>
            <View style={tw`flex-1 flex-row items-center justify-end`}>
              <Text style={tw`text-2xl text-center`}>
                {driverInformation.rating}
              </Text>
              <MaterialIcons name="star" size={24} color="yellow" />
            </View>
          </Pressable>
          <View style={tw`flex-2`}>
            <View style={tw`flex-1 flex-row justify-around mb-4`}>
              <Pressable
                style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3 mx-4`}
                onPress={() => {
                  openURL(`tel:${driverInformation.phone}`);
                }}
              >
                <MaterialIcons name="call" size={24} color="green" />
                <Text>โทร</Text>
              </Pressable>
              <Pressable
                style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3 mx-4`}
              >
                <MaterialIcons name="chat" size={24} color="black" />
                <Text>ข้อความ</Text>
              </Pressable>
            </View>
            <View style={tw`flex-1 justify-center items-center`}>
              <Pressable
                style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3`}
              >
                <MaterialIcons name="close" size={24} color="red" />
                <Text>ยกเลิก</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
