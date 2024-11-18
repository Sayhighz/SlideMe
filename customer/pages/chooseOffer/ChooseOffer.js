import {
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

const ChooseOffer = ({ navigation }) => {
  const [offer, setOffer] = useState([]);

  const [chooseDriver, setChooseDriver] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const [filteredOffer, setFilteredOffer] = useState([]);

  const [radiusInMeters, setRadiusInMeters] = useState(5000);
  
  const dataDropdown = [
    { label: "1 km", value: "1000" },
    { label: "5 km", value: "5000" },
    { label: "10 km", value: "10000" },
  ];

  const originLocation = {
    name: "Origin",
    latitude: 13.855879586027092,
    longitude: 100.58552751063581,
  };

  const destinationLocation = {
    name: "Destination",
    latitude: 13.875879586027092,
    longitude: 100.58552751063581,
  };

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
    const API_KEY = GOOGLE_MAPS_API_KEY; // ใช้ API Key ของคุณ
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverLocation.latitude},${driverLocation.longitude}&destination=${originLocation.latitude},${originLocation.longitude}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.routes.length > 0) {
        const leg = response.data.routes[0].legs[0];
        const distance = leg.distance.value; // ระยะทางในหน่วยเมตร
        const duration = leg.duration.value; // เวลาเดินทางในหน่วยวินาที
        const durationText = leg.duration.text.replace(/[^\d]/g, '');

        return { distance, duration, durationText };
      } else {
        console.error("ไม่พบเส้นทาง");
        return { distance: null, duration: null, durationText: null };
      }
    } catch (error) {
      console.error(
        "เกิดข้อผิดพลาดในการเรียกใช้ Directions API:",
        error.message
      );
      return { distance: null, duration: null, durationText: null };
    }
  };

  const refreshPage = () => {
    // ฟังก์ชันที่ใช้สำหรับดึงข้อมูลใหม่ (เหมือนกับที่ใช้ใน useEffect ตอนเริ่มต้น)
    const offerData = [
      {
        id: 1,
        name: "นายสมชาย อิอิ",
        rating: 5.0,
        location: {
          latitude: 13.855879586027092,
          longitude: 100.64545240878745,
        },
        price: 1000,
      },
      {
        id: 2,
        name: "นายสมชาติ อิอิ",
        rating: 4.1,
        location: {
          latitude: 13.855879586027092,
          longitude: 100.59545240878745,
        },
        price: 1300,
      },
      {
        id: 3,
        name: "นายสมโชติ อิอิ",
        rating: 4.5,
        location: {
          latitude: 13.835879586027092,
          longitude: 100.58545240878745,
        },
        price: 1500,
      },
      {
        id: 4,
        name: "นายสมเชิง อิอิ",
        rating: 4.7,
        location: {
          latitude: 13.895879586027092,
          longitude: 100.58545240878745,
        },
        price: 1100,
      },
      {
        id: 5,
        name: "นายหญฺิง ชายหรือหญิง",
        rating: 4.9,
        location: {
          latitude: 13.929879586027092,
          longitude: 100.68545240878745,
        },
        price: 1800,
      },
      {
        id: 6,
        name: "นายน๋าย น๋ายนาย",
        rating: 4.2,
        location: {
          latitude: 13.895879586027092,
          longitude: 100.68945240878745,
        },
        price: 900,
      },
      {
        id: 7,
        name: "นายอิอิ อิอิ",
        rating: 4.7,
        location: {
          latitude: 13.951879586027092,
          longitude: 100.58145240878745,
        },
        price: 1450,
      },
      {
        id: 8,
        name: "นายตรงข้ามมอ มอม้อ",
        rating: 4.9,
        location: {
          latitude: 13.856491621732623,
          longitude: 100.58429296991496,
        },
        price: 500,
      },
      {
        id: 9,
        name: "นายมหาลัย เกษตร",
        rating: 5.0,
        location: {
          latitude: 13.848145258391899,
          longitude: 100.57219036460991,
        },
        price: 2500,
      },
      {
        id: 10,
        name: "นายเทส เทส",
        rating: 3.0,
        location: {
          latitude: 13.860848001724419,
          longitude: 100.5883112523814,
        },
        price: 200,
      },
      {
        id: 11,
        name: "นายใกล้ มอ",
        rating: 4.0,
        location: {
          latitude: 13.856410834028642,
          longitude: 100.5858708333712,
        },
        price: 100,
      },
      {
        id: 12,
        name: "ตี๋น้อย",
        rating: 5.0,
        location: {
          latitude: 13.863755897895857,
          longitude: 100.58836677799083,
        },
        price: 600,
      },
      // เพิ่มข้อมูลอื่น ๆ ตามที่มี
    ];
    setOffer(offerData); // เซ็ตข้อมูลใหม่
    const filtered = filterOffersByRadius(offerData, radiusInMeters);
    setFilteredOffer(filtered);
    console.log("refresh");
  };

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
                <Text style={tw`text-lg font-bold`}>ข้อมูลคนขับ : </Text>
                <Text style={tw`text-lg font-bold`}>
                  ชื่อ :{" "}
                  <Text style={tw`text-lg text-green-700`}>
                    {chooseDriver.name}
                  </Text>
                </Text>
                <Text style={tw`text-lg font-bold`}>
                  ราคา :{" "}
                  <Text style={tw`text-lg text-red-700`}>
                    {chooseDriver.price}{" "}
                  </Text>
                  บาท
                </Text>
                <Text style={tw`text-lg font-bold`}>
                  คะแนน :{" "}
                  <Text style={tw`text-lg text-green-700`}>
                    {chooseDriver.rating}
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
                <Text style={tw`text-lg font-bold text-[#FDFFFD]`}>Cancel</Text>
              </Pressable>
              <Pressable
                style={tw`bg-[#60B876] p-3 rounded-lg`}
                onPress={() => {
                    navigation.navigate("payment", {
                      chooseDriver: chooseDriver,
                      originLocation: originLocation,
                      destinationLocation: destinationLocation,
                    }),
                    setOpenModal(false);
                }}
              >
                <Text style={tw`text-lg font-bold text-[#FDFFFD]`}>
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* <View style={tw`flex-1`}>
        <MapView
          style={tw`flex-1`} // ปรับขนาดตามที่ต้องการ
          initialRegion={{
            latitude: originLocation.latitude,
            longitude: originLocation.longitude,
            latitudeDelta: 0.05, // ค่า zoom level สามารถปรับได้ตามต้องการ
            longitudeDelta: 0.05,
          }}
        >

          <Marker
            coordinate={{
              latitude: originLocation.latitude,
              longitude: originLocation.longitude,
            }}
            title="Origin"
            description="Origin Location"
            pinColor="blue"
          />

          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title="Destination"
            description="Destination Location"
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
            fillColor="rgba(255, 0, 0, 0.2)"
            strokeWidth={2}
            strokeColor="blue"
          />
        </MapView>
      </View> */}
      <View style={tw`flex-1 p-4`}>
        <View style={tw`flex-1 flex-row`}>
          <View style={tw`flex-1 justify-center`}>
            <Pressable onPress={refreshPage}>
              <MaterialIcons name="refresh" size={24} color="gray" />
            </Pressable>
          </View>
          <View style={tw`flex-1 justify-center items-end`}>
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
          </View>
        </View>
        <View style={tw`flex-8 items-center `}>
          <FlatList
            data={filteredOffer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  tw`flex-row items-center p-2 my-2 rounded shadow w-full justify-between h-20`,
                  chooseDriver.id === item.id ? tw`bg-[#60B876]` : tw`bg-white`,
                ]}
                onPress={() => {
                  if (chooseDriver.id !== item.id) {
                    setChooseDriver(item);
                  } else {
                    setOpenModal(true);
                  }
                }}
              >
                <Text style={tw` font-bold flex-5`}>{item.name}</Text>
                <Text style={tw` font-bold flex-3 text-center`}>
                  <Text style={tw`text-red-700`}>{item.price}</Text> บาท
                </Text>
                <View style={tw`flex-3 justify-around items-center h-full`}>
                  <Text style={tw`font-bold`}>
                    <Text style={tw`text-red-700`}>
                      {(item.distance / 1000).toFixed(2)}{" "}
                    </Text> 
                      km
                  </Text>
                  <Text style={tw`font-bold `}>
                    <Text style={tw`text-red-700`}>
                      {item.durationText} {" "}
                    </Text>
                      นาที
                  </Text>
                </View>
                <View style={tw`flex-2 flex-row justify-center items-center`}>
                  <MaterialIcons name="star" size={24} color="yellow" />
                  <Text style={tw` font-bold text-center`}>
                    {item.rating}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChooseOffer;
