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
import { Dropdown } from 'react-native-element-dropdown';

const ChooseOffer = ({ navigation }) => {
  const [offer, setOffer] = useState([]);

  const [chooseDriver, setChooseDriver] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const [filteredOffer, setFilteredOffer] = useState([]);

  const [radiusInMeters, setRadiusInMeters] = useState(5000);

  const originLocation = {
    name: "Origin",
    latitude: 13.855879586027092, 
    longitude: 100.58552751063581
  }

  const destinationLocation = {
    name: "Destination",
    latitude: 13.875879586027092, 
    longitude: 100.58552751063581
  }

  useEffect(() => {
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
      },      {
        id: 6,
        name: "นายน๋าย น๋ายนาย",
        rating: 4.2,
        location: {
          latitude: 13.895879586027092,
          longitude: 100.68945240878745,
        },
        price: 900,
      },      {
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
      }
    ];
    setOffer(offerData);
    filterOffers(offerData , radiusInMeters);

  }, []);

  useEffect(() => {
    filterOffers(offer, radiusInMeters);
  }, [offer,radiusInMeters]);

  const dataDropdown = [
    { label: '1 km', value: '1000' },
    { label: '5 km', value: '5000' },
    { label: '10 km', value: '10000' },
    { label: '20 km', value: '20000' },
  ];

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
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

  const filterOffers = (offers , radius) => {
    const filtered = offers.filter((item) => {
      const distance = calculateDistance(
        originLocation.latitude,
        originLocation.longitude,
        item.location.latitude,
        item.location.longitude
      );
      return distance <= radius;
    });
    setFilteredOffer(filtered);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Modal transparent={true} visible={openModal}>
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`bg-[#FDFFFD] w-4/5 h-1/3 flex rounded-lg p-3`}>
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
                  Alert.alert("เลือกคนนี้"),
                  navigation.navigate("payment",
                    {
                      chooseDriver : chooseDriver,
                      originLocation : originLocation,
                      destinationLocation : destinationLocation
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

      <View style={tw`flex-2`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <MapView
            style={tw`w-full h-full`}
            initialRegion={{
              latitude: 13.855879586027092,
              longitude: 100.58545240878745,
              latitudeDelta: 0.1922,
              longitudeDelta: 0.0421,
            }}
          >
            {filteredOffer.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}
                title={item.name}
                pinColor={chooseDriver.id === item.id ? "green" : "red"}
                description={`ราคา : ${item.price} บาท`}
              />
            ))}

            <Marker
              coordinate={originLocation}
              title="ต้นทาง"
              pinColor="blue"
            />

            <Marker
              coordinate={destinationLocation}
              title="ปลายทาง"
              pinColor="blue"
            />

            <Circle 
              center={originLocation}
              radius={radiusInMeters}
              strokeColor="rgba(0, 0, 0, 0.2)"
              fillColor="rgba(0, 0, 0, 0.2)"
            />
          </MapView>
        </View>
      </View>
      <View style={tw`flex-1 p-4`}>
        <View style={tw`flex-2 flex-row items-center justify-between`}>
          <TouchableOpacity
            style={tw`flex-1`}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`flex-9 text-2xl font-bold text-center`}>Choose Offer</Text>
          <View style={tw`flex-4`}>
            <Dropdown
                   style={tw`h-10 w-full border-gray-300 rounded-lg px-3 bg-white`}
                   data={dataDropdown}
                   maxHeight={300}
                   labelField="label"   //ตามdata
                   valueField="value"   //ตามdata
                   placeholder="Radius"
                   value={radiusInMeters.toString()}
                   onChange={(item) => {
                     setRadiusInMeters(parseInt(item.value , 10));
                   }}
            />
          </View>
        </View>
        <View style={tw`flex-8 items-center `}>
          <FlatList
            data={filteredOffer}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={[
                  tw`flex-row items-center p-2 my-2 rounded shadow w-full justify-between`,
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
                <Text style={tw` font-bold flex-2`}>{item.name}</Text>
                <Text style={tw` font-bold flex-2 text-center`}><Text style={tw`text-red-700`}>{item.price}</Text> บาท</Text>
                <View style={tw`flex-1 flex-row justify-center items-center` }>

                  <MaterialIcons name="star" size={24} color="yellow" />
                <Text style={tw` font-bold flex-1 text-center`}>
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
