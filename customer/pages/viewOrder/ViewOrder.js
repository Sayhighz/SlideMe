import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
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
import axios from "axios";
import { IP_ADDRESS } from "../../config";

export default function ViewOrder({ navigation }) {
  const route = useRoute();

  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});

  const [driverInformation, setDriverInformation] = useState({});

  const [confirmFromDriver, setConfirmFromDriver] = useState(false);

  const [myLocation, setMyLocation] = useState({});

  const [request, setRequest] = useState("");

  const [time, setTime] = useState("");

  const driverProfile = route.params?.driverProfile.chooseDriver || "ไม่ระบุ";
  const originLocation = route.params?.originLocation || "ไม่ระบุ";
  const destinationLocation = route.params?.destinationLocation || "ไม่ระบุ";

  const driver_id = route.params?.driverProfile.chooseDriver.id || "ไม่ระบุ";
  const customer_id_request =
    route.params?.driverProfile.chooseDriver.customer_id_request || "ไม่ระบุ";

  const formatDateToThaiTimezone = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Intl.DateTimeFormat("th-TH", options).format(date);
  };

  const padNumber = (number, length) => {
    return number.toString().padStart(length, "0");
  };

  useEffect(() => {
    console.log("driver_id:", driver_id);
    console.log("customer_id_request:", customer_id_request);
  }, [driver_id, customer_id_request]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/auth/fetch_driver_info/${customer_id_request}/${driver_id}`
      );

      if (response.data.Status && response.data.Result.length > 0) {
        const data = response.data.Result[0]; // Assuming you want the first result

        // Set the state with fetched data
        setOrigin({
          name: data.location_from,
          latitude: parseFloat(data.pickup_lat),
          longitude: parseFloat(data.pickup_long),
        });

        setDestination({
          name: data.location_to,
          latitude: parseFloat(data.dropoff_lat),
          longitude: parseFloat(data.dropoff_long),
        });

        setDriverInformation({
          name: data.driver_first_name + " " + data.driver_last_name,
          latitude: data.driver_latitude,
          longitude: data.driver_longitude,
          phone: data.driver_phone,
          rating: data.average_rating.toFixed(1),
        });

        setTime(formatDateToThaiTimezone(data.booking_time));
        setRequest(padNumber(data.request_id, 10));
      } else {
        console.error("No matching data found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrderDetails();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 relative `}>
      <View style={tw`flex-2`}>
        <View style={tw`flex-2`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-1 flex-row justify-between px-4 items-end`}>
              <Text style={styles.globalText}>{time}</Text>
              <Text style={styles.globalText}>{request}</Text>
            </View>
            <View style={tw`flex-4 justify-around mx-4 bg-gray-200 rounded-lg`}>
              <View style={tw`flex-1 flex-row items-center w-full`}>
                <MaterialIcons name="place" size={24} color="blue" />
                <Text style={[styles.globalText, tw`items-center`]}>
                  คนขับ : {driverInformation.name}
                </Text>
              </View>
              <View
                style={tw`flex-1 flex-row items-center w-full`}
                onTouchEnd={() => {
                  console.log("ต้นทาง :", origin.name);
                }}
              >
                <MaterialIcons name="place" size={24} color="red" />
                <Text
                  style={[styles.globalText, tw`items-center flex-1`]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  ต้นทาง : {origin.name}
                </Text>
              </View>
              <View
                style={tw`flex-1 flex-row items-center w-full`}
                onTouchEnd={() => {
                  console.log("ปลายทาง :", destination.name);
                }}
              >
                <MaterialIcons name="place" size={24} color="green" />
                <Text
                  style={[styles.globalText, tw`items-center flex-1`]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
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
                  latitudeDelta: 0.0522,
                  longitudeDelta: 0.0521,
                }}
              >
                <Marker 
                  coordinate={origin} 
                  title="origin" 
                  description="origin"
                >
                  <MaterialIcons
                    name="location-pin"
                    size={35}
                    color="red"
                    style={tw`ml-2`}
                  />
                </Marker>

                <Marker
                  coordinate={destination}
                  title="destination"
                  description="destination"
                >
                  <MaterialIcons
                    name="location-pin"
                    size={35}
                    color="green"
                    style={tw`ml-2`}
                  />
                </Marker>

                <Marker
                  coordinate={driverInformation}
                  title="driverLocation"
                  description="driverLocation"
                >
                  <MaterialIcons
                    name="location-pin"
                    size={35}
                    color="blue"
                    style={tw`ml-2`}
                  />
                </Marker>

                {/* <Marker
                  coordinate={myLocation}
                  title="myLocation"
                  description="myLocation"
                  pinColor="red"
                /> */}

                {origin.latitude &&
                  origin.longitude &&
                  destination.latitude &&
                  destination.longitude &&
                  driverInformation.latitude &&
                  driverInformation.longitude && (
                    <MapViewDirections
                      strokeColor="blue"
                      strokeWidth={2}
                      apikey={GOOGLE_MAPS_API_KEY}
                      origin={{
                        latitude: driverInformation.latitude,
                        longitude: driverInformation.longitude,
                      }}
                      destination={
                        confirmFromDriver
                          ? {
                              latitude: destination.latitude,
                              longitude: destination.longitude,
                            }
                          : {
                              latitude: origin.latitude,
                              longitude: origin.longitude,
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
            <View style={tw`flex-8`}>
              <Text style={[styles.globalText, tw`text-xl`]}>
                {driverInformation.name}
              </Text>
            </View>
            <View style={tw`flex-1 flex-row items-center justify-end`}>
              <MaterialIcons name="star" size={24} color="yellow" />
              <Text style={[styles.globalText, tw`text-xl text-center`]}>
                {driverInformation.rating}
              </Text>
            </View>
          </Pressable>
          <View style={tw`flex-2`}>
            <View style={tw`flex-1 flex-row justify-around mb-4`}>
              <Pressable
                style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3 mx-4`}
                onPress={() => {
                  openURL(`tel:${driverInformation.phone}`);
                  console.log(driverInformation.phone);
                }}
              >
                <MaterialIcons name="call" size={24} color="green" />
                <Text styles={styles.globalText}>โทร</Text>
              </Pressable>
              <Pressable
                style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3 mx-4`}
              >
                <MaterialIcons name="chat" size={24} color="black" />
                <Text styles={[styles.globalText, tw`text-xl`]}>ข้อความ</Text>
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
                <Text styles={[styles.globalText, tw`text-xl`]}>ยกเลิก</Text>
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
    fontFamily: "Mitr-Regular",
  },
});
