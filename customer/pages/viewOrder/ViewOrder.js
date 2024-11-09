import { Pressable, SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { openURL } from "expo-linking";
import { rating } from "@material-tailwind/react";
import { useRoute } from "@react-navigation/native";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";
import MapViewDirections from "react-native-maps-directions";

export default function ViewOrder({ navigation }) {
  const route = useRoute();

  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});

  const [driverInformation, setDriverInformation] = useState({});

  const driverProfile = route.params?.driverProfile.chooseDriver || "ไม่ระบุ";
  const originLocation = route.params?.originLocation || "ไม่ระบุ";
  const destinationLocation = route.params?.destinationLocation || "ไม่ระบุ";

  useEffect(() => {
    setOrigin({
      name: originLocation.name,
      latitude: originLocation.latitude,
      longitude: originLocation.longitude,
    });
    setDestination({
      name: destinationLocation.name,
      latitude: destinationLocation.latitude,
      longitude: destinationLocation.longitude,
    });

    setDriverInformation({
      name: driverProfile.name,
      latitude: driverProfile.location.latitude,
      longitude: driverProfile.location.longitude,
      phone: "0808341035",
      rating: driverProfile.rating,
    });
  }, [route.params]);

  // useEffect(() => {
  //   console.log(route.params);
  // }, [route.params]);

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

                <MapViewDirections
                  strokeColor="blue"
                  strokeWidth={3}
                  origin={{
                    latitude: driverInformation.latitude,
                    longitude: driverInformation.longitude,
                  }}
                  destination={{
                    latitude: originLocation.latitude,
                    longitude: originLocation.longitude,
                  }}
                  apikey={GOOGLE_MAPS_API_KEY}
                  // onError={(errorMessage) => {
                  //   console.log("Error fetching directions: ", errorMessage);
                  //   alert("ไม่พบเส้นทางระหว่างจุดต้นทางและปลายทางที่ระบุ");
                  // }}
                />
              </MapView>
            </View>
          </View>
        </View>
        <View style={tw`flex-1`}>
          <Pressable
            style={tw`flex-1 flex-row bg-gray-300 m-4 rounded-lg items-center px-4`}
          >
            <View style={tw`flex-9`}>
              <Text style={tw`text-xl`}>{driverInformation.name}</Text>
            </View>
            <View style={tw`flex-1 flex-row items-center justify-end`}>
              <Text style={tw`text-xl text-center`}>
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
