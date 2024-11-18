import { Pressable, SafeAreaView, Text, View , StyleSheet } from "react-native";
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
import * as Location from "expo-location";

export default function ViewOrder({ navigation }) {
  const route = useRoute();

  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});

  const [driverInformation, setDriverInformation] = useState({});

  const [confirmFromDriver, setConfirmFromDriver] = useState(true);

  const [myLocation, setMyLocation] = useState({});

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

  useEffect(() => {
    _getLocation();
  }, []);

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      // เฝ้าดูตำแหน่งของผู้ใช้แบบเรียลไทม์
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 600000, // Update every 10 minutes
          distanceInterval: 500,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          setMyLocation(newRegion);
          console.log(myLocation)

        }
      );
    } catch (error) {
      console.warn("Error fetching location", error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 relative `}>
      <View style={tw`flex-2`}>
        <View style={tw`flex-2`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-1 flex-row justify-between px-4 items-end`}>
              <Text style={styles.globalText}>10:12 AM 15 ม.ค. 2567</Text>
              <Text style={styles.globalText}>xxxxxxxxxxxxxx</Text>
            </View>
            <View
              style={tw`flex-4 justify-around mx-4 px-4 bg-gray-200 rounded-lg`}
            >
              <View style={tw`flex-1 flex-row items-center`}>
                <MaterialIcons name="place" size={24} color="blue" />
                <Text style={[styles.globalText , tw`items-center`]}>
                  คนขับ : {driverInformation.name}
                </Text>
              </View>
              <View style={tw`flex-1 flex-row items-center`}>
                <MaterialIcons name="place" size={24} color="red" />
                <Text style={[styles.globalText , tw`items-center`]}>ต้นทาง : {origin.name}</Text>
              </View>
              <View style={tw`flex-1 flex-row items-center`}>
                <MaterialIcons name="place" size={24} color="green" />
                <Text style={[styles.globalText , tw`items-center`]}>
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

                <Marker
                  coordinate={myLocation}
                  title="myLocation"
                  description="myLocation"
                  pinColor="red"
                />

                {origin.latitude &&
                  origin.longitude &&
                  myLocation.latitude &&
                  myLocation.longitude &&
                  destination.latitude &&
                  destination.longitude &&
                  driverInformation.latitude &&
                  driverInformation.longitude && (
                    <MapViewDirections
                      strokeColor="blue"
                      strokeWidth={3}
                      apikey={GOOGLE_MAPS_API_KEY}
                      origin={{
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude,
                      }}
                      destination={
                        confirmFromDriver
                          ? {
                              latitude: destinationLocation.latitude,
                              longitude: destinationLocation.longitude,
                            }
                          : {
                              latitude: originLocation.latitude,
                              longitude: originLocation.longitude,
                            }
                      }
                      // onError={(errorMessage) => {
                      //   console.log("Error fetching directions: ", errorMessage);
                      //   alert("ไม่พบเส้นทางระหว่างจุดต้นทางและปลายทางที่ระบุ");
                      // }}
                    />
                  )}
              </MapView>
            </View>
          </View>
        </View>
        <View style={tw`flex-1`}>
          <Pressable
            style={tw`flex-1 flex-row bg-gray-300 m-4 rounded-lg items-center px-4`}
          >
            <View style={tw`flex-9`}>
              <Text style={[styles.globalText , tw`text-xl`]}>{driverInformation.name}</Text>
            </View>
            <View style={tw`flex-1 flex-row items-center justify-end`}>
              <Text style={[styles.globalText , tw`text-xl text-center`]}>
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
                <Text styles={styles.globalText}>โทร</Text>
              </Pressable>
              <Pressable
                style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3 mx-4`}
              >
                <MaterialIcons name="chat" size={24} color="black" />
                <Text styles={[styles.globalText , tw`text-xl`]}>ข้อความ</Text>
              </Pressable>
            </View>
            <View style={tw`flex-1 justify-center items-center`}>
              <Pressable
                style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3`}
                onPress={() => {
                  navigation.navigate("Rating");
                }}
              >
                <MaterialIcons name="close" size={24} color="red" />
                <Text styles={[styles.globalText , tw`text-xl`]}>ยกเลิก</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular'
  },
});