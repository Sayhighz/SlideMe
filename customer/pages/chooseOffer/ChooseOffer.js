import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";
import { IP_ADDRESS } from "../../config";
import MapViewDirections from "react-native-maps-directions";

const ChooseOffer = ({ navigation, route }) => {
  const [offer, setOffer] = useState([]);

  const [chooseDriver, setChooseDriver] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const [filteredOffer, setFilteredOffer] = useState([]);

  const [radiusInMeters, setRadiusInMeters] = useState(5000);

  const [offerLoading, setOfferLoading] = useState(true);

  const [originLocation, setOriginLocation] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
  });

  const [destinationLocation, setDestinationLocation] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
  });

  const dataDropdown = [
    { label: "1 km", value: "1000" },
    { label: "5 km", value: "5000" },
    { label: "10 km", value: "10000" },
  ];

  const { request_id } = route.params;

  // const originLocation = {
  //   name: "Origin",
  //   latitude: 13.855879586027092,
  //   longitude: 100.58552751063581,
  // };

  // const destinationLocation = {
  //   name: "Destination",
  //   latitude: 13.875879586027092,
  //   longitude: 100.58552751063581,
  // };

  useEffect(() => {
    refreshPage(); // โหลดข้อมูลเมื่อคอมโพเนนต์ถูกสร้างครั้งแรก
  }, []);

  useEffect(() => {
    // กรองข้อมูลด้วยรัศมีเมื่อเปลี่ยน `radiusInMeters`
    const filtered = filterOffersByRadius(offer, radiusInMeters);
    setFilteredOffer(filtered);

    // คำนวณระยะทางเส้นทางจริงและอัพเดทข้อมูลใน `FlatList`
    calculateAccurateRouteDistance(filtered).then((results) => {
      setFilteredOffer(results);
    });
  }, [offer, radiusInMeters]);

  useEffect(() => {
    filterOffers(offer, radiusInMeters);
  }, [offer, radiusInMeters]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const filterOffers = async (offers, radius) => {
    // กรองข้อเสนอโดยใช้การคำนวณระยะทางแบบ haversine
    const haversineFiltered = offers.filter((item) => {
      const distance = calculateDistance(
        originLocation.latitude,
        originLocation.longitude,
        item.location.latitude,
        item.location.longitude
      );
      return distance <= radius; // กรองตามรัศมีที่กำหนด
    });

    // ใช้ Google Maps API เพื่อดึงข้อมูลเส้นทางสำหรับการแสดงผล
    const promises = haversineFiltered.map(async (item) => {
      try {
        const result = await getRouteDistance(item.location, originLocation);
        return {
          ...item,
          distance:
            result.distance !== null
              ? result.distance
              : calculateDistance(
                  originLocation.latitude,
                  originLocation.longitude,
                  item.location.latitude,
                  item.location.longitude
                ), // ใช้ระยะทางแบบ haversine หาก API ไม่สามารถคืนค่าระยะทางได้
          duration: result.duration,
          durationText: result.durationText,
        };
      } catch (error) {
        console.error(`Error fetching route distance for ${item.name}:`, error);
        return { ...item, distance: null, duration: null, durationText: null };
      }
    });

    const results = await Promise.all(promises);
    setFilteredOffer(results);
  };

  const getRouteDistance = async (driverLocation, originLocation) => {
    const API_KEY = GOOGLE_MAPS_API_KEY; // Use your API key
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverLocation.latitude},${driverLocation.longitude}&destination=${originLocation.latitude},${originLocation.longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching route data: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.routes.length > 0) {
        const leg = data.routes[0].legs[0];
        const distance = leg.distance.value; // Distance in meters
        const duration = leg.duration.value; // Duration in seconds
        const durationText = leg.duration.text.replace(/[^\d]/g, "");

        return { distance, duration, durationText };
      } else {
        console.error("No routes found");
        return { distance: null, duration: null, durationText: null };
      }
    } catch (error) {
      console.error("Error calling Directions API:", error.message);
      return { distance: null, duration: null, durationText: null };
    }
  };

  const refreshPage = async () => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/drivers/chooseoffer?request_id=${request_id}`
      );
      const data = await response.json();
      if (data.Status) {
        if (data.PickupDropoffInfo) {
          setOriginLocation({
            name: data.PickupDropoffInfo.location_from,
            latitude: parseFloat(data.PickupDropoffInfo.pickup_lat),
            longitude: parseFloat(data.PickupDropoffInfo.pickup_long),
          });
          setDestinationLocation({
            name: data.PickupDropoffInfo.location_to,
            latitude: parseFloat(data.PickupDropoffInfo.dropoff_lat),
            longitude: parseFloat(data.PickupDropoffInfo.dropoff_long),
          });
        }

        if (data.Result == "") {
          setOfferLoading(true);
        }

        if (data.Result && data.Result.length > 0) {
          // Handle driver data if available
          const drivers = data.Result.map((driver) => ({
            id: driver.driver_id,
            name: `${driver.first_name} ${driver.last_name}`,
            rating: driver.average_rating.toFixed(1),
            location: {
              latitude: driver.current_latitude,
              longitude: driver.current_longitude,
            },
            price: driver.offered_price,
            customer_id_request: driver.customer_id,
            request_id: driver.request_id,
          }));
          setOffer(drivers);
          setOfferLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    refreshPage();
  }, []);

  const filterOffersByRadius = (offers, radius) => {
    const filteredOffers = offers.filter((item) => {
      const distance = calculateDistance(
        originLocation.latitude,
        originLocation.longitude,
        item.location.latitude,
        item.location.longitude
      );
      return distance <= radius;
    });
    return filteredOffers;
  };

  const calculateAccurateRouteDistance = async (offers) => {
    const promises = offers.map(async (item) => {
      try {
        const result = await getRouteDistance(item.location, originLocation);
        return {
          ...item,
          distance: result.distance, // ระยะทางที่ได้จากเส้นทางจริง
          duration: result.duration,
          durationText: result.durationText,
        };
      } catch (error) {
        console.error(`Error fetching route distance for ${item.name}:`, error);
        return { ...item, distance: null, duration: null, durationText: null };
      }
    });

    return await Promise.all(promises);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Modal transparent={true} visible={openModal}>
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`bg-gray-200 w-4/5 h-1/3 flex rounded-lg p-3`}>
            <View style={tw`flex-2`}>
              <View style={tw`flex-1 justify-between`}>
                <Text style={[styles.globalText, tw`text-lg font-bold`]}>
                  ข้อมูลคนขับ :
                </Text>
                <Text style={[styles.globalText, tw`text-lg font-bold`]}>
                  {"ชื่อ : "}
                  <Text style={tw`text-lg text-green-700`}>
                    {chooseDriver.name}
                  </Text>
                </Text>
                <Text style={[styles.globalText, tw`text-lg font-bold`]}>
                  {"ราคา : "}
                  <Text style={tw`text-lg text-red-700`}>
                    {chooseDriver.price || "-"}
                    {" บาท"}
                  </Text>
                </Text>
                <Text style={[styles.globalText, tw`text-lg font-bold`]}>
                  {"คะแนน : "}
                  <Text style={tw`text-lg text-green-700`}>
                    {chooseDriver.rating || "-"}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={tw`flex-1 flex-row justify-around items-center`}>
              <Pressable
                style={tw`bg-red-500 p-3 rounded-lg`}
                onPress={() => {
                  setOpenModal(false);
                }}
              >
                <Text style={tw`text-lg font-bold text-[#FDFFFD]`}>ยกเลิก</Text>
              </Pressable>
              <Pressable
                style={tw`bg-[#60B876] p-3 rounded-lg`}
                onPress={() => {
                  navigation.navigate("payment", {
                    chooseDriver: chooseDriver,

                    // originLocation: originLocation,
                    // destinationLocation: destinationLocation,
                  }),
                    setOpenModal(false);
                }}
              >
                <Text style={tw`text-lg font-bold text-[#FDFFFD]`}>ยืนยัน</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={tw`flex-1`}>
        {originLocation.latitude && destinationLocation.latitude ? (
          <MapView
            style={tw`flex-1`} // ปรับขนาดตามที่ต้องการ
            initialRegion={{
              latitude: originLocation.latitude,
              longitude: originLocation.longitude,
              latitudeDelta: 0.08, // ค่า zoom level สามารถปรับได้ตามต้องการ
              longitudeDelta: 0.08,
            }}
          >
            <Marker
              coordinate={{
                latitude: originLocation.latitude,
                longitude: originLocation.longitude,
              }}
              title="Origin"
              description={originLocation.name}
              pinColor="blue"
            />

            <Marker
              coordinate={{
                latitude: destinationLocation.latitude,
                longitude: destinationLocation.longitude,
              }}
              title="Destination"
              description={destinationLocation.name}
              pinColor="blue"
            />

            {filteredOffer.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}
                pinColor={chooseDriver.id === item.id ? "green" : "red"}
                title={item.name}
                description={`ราคา: ${item.price} บาท`}
              />
            ))}

            <Circle
              center={originLocation}
              radius={radiusInMeters}
              fillColor="rgba(255, 0, 0, 0.1)"
              strokeColor="transparent"
            />

            {/* <MapViewDirections
              origin={destinationLocation}
              destination={originLocation}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor="blue"
              onReady={(result) => {
                console.log("Distance:", result.distance); // Distance in km
                console.log("Duration:", result.duration); // Duration in minutes
              }}
            /> */}
          </MapView>
        ) : (
          <View style={tw`flex-1 justify-center items-center`}>
            <Text>Loading...</Text>
          </View>
        )}
      </View>
      <View style={tw`flex-1 p-4`}>
        <View style={tw`flex-1 flex-row`}>
          <View style={tw`flex-1 justify-center`}>
            <Pressable onPress={refreshPage}>
              <MaterialIcons name="refresh" size={24} color="gray" />
            </Pressable>
          </View>
          <View style={tw`flex-1 justify-center items-end`}>
            {!offerLoading ? (
              <Dropdown
                style={tw`h-3/4 w-2/4 border-gray-300 rounded-lg px-3 bg-white `}
                data={dataDropdown}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Radius"
                value={radiusInMeters.toString()}
                onChange={(item) => {
                  const newRadius = parseInt(item.value, 10);
                  setRadiusInMeters(newRadius);
                  const filtered = filterOffersByRadius(offer, newRadius);
                  setFilteredOffer(filtered); // กรองข้อเสนอรอบตัว
                  calculateAccurateRouteDistance(filtered).then((results) => {
                    setFilteredOffer(results); // อัพเดทข้อมูลที่มีระยะทางจริง
                  });
                }}
              />
            ) : null}
          </View>
        </View>
        <View style={tw`flex-8 items-center `}>
          {!offerLoading ? (
            <FlatList
              data={filteredOffer}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => {
                if (filteredOffer.length > 0) {
                  return (
                    <TouchableOpacity
                      style={[
                        tw`flex-row items-center p-2 my-2 rounded shadow w-full justify-between h-20`,
                        chooseDriver.id === item.id
                          ? tw`bg-[#60B876]`
                          : tw`bg-white`,
                      ]}
                      onPress={() => {
                        if (chooseDriver.id !== item.id) {
                          setChooseDriver(item);
                        } else {
                          setOpenModal(true);
                        }
                      }}
                    >
                      <Text style={[styles.globalText, tw` font-bold flex-5`]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.globalText,
                          tw` font-bold flex-3 text-center`,
                        ]}
                      >
                        <Text style={tw`text-red-700`}>
                          {item.price ? item.price : "-"}
                        </Text>
                        {" บาท"}
                      </Text>
                      <View
                        style={tw`flex-3 justify-around items-center h-full`}
                      >
                        <Text style={[styles.globalText, tw`font-bold`]}>
                          <Text style={tw`text-red-700`}>
                            {(item.distance / 1000).toFixed(2)}
                            {" km"}
                          </Text>
                        </Text>
                        <Text style={tw`font-bold `}>
                          <Text style={tw`text-red-700`}>
                            {item.durationText}
                            {" นาที"}{" "}
                          </Text>
                        </Text>
                      </View>
                      <View
                        style={tw`flex-2 flex-row justify-center items-center`}
                      >
                        <MaterialIcons name="star" size={24} color="yellow" />
                        <Text
                          style={[
                            styles.globalText,
                            tw` font-bold text-center`,
                          ]}
                        >
                          {item.rating ? item.rating : "-"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
                else {
                  return (
                    <View style={tw`flex-1 justify-center items-center`}>
                      <Text style={tw`text-lg font-bold`}>ไม่พบข้อเสนอ</Text>
                    </View>
                  );
                }
              }}
            />
          ) : (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" color={"#000000"} />
              <Text style={tw`text-lg font-bold mt-5`}>กําลังรอคนขับ...</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default ChooseOffer;
