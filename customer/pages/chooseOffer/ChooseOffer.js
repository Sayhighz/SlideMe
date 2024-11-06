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
import MapView, { Marker } from "react-native-maps";

const ChooseOffer = ({ navigation }) => {
  const [offer, setOffer] = useState([]);

  const [chooseDriver, setChooseDriver] = useState({});

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setOffer([
      {
        id: 1,
        name: "นายสมชาย อิอิ",
        rating: 5.0,
        location: {
          latitude: 13.855879586027092,
          longitude: 100.54545240878745,
        },
        price: 1500,
      },
      {
        id: 2,
        name: "นายสมชาติ อิอิ",
        rating: 4.1,
        location: {
          latitude: 13.855879586027092,
          longitude: 100.59545240878745,
        },
        price: 1500,
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
        price: 1500,
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Modal transparent={true} visible={openModal}>
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`bg-[#FDFFFD] w-4/5 h-1/3 flex rounded-lg p-3`}>
            <View style={tw`flex-2`}>
              <View style={tw`flex-1 justify-between`}>
                <Text style={tw`text-lg font-bold`}>ข้อมูลคนชับ : </Text>
                <Text style={tw`text-lg font-bold`}>
                  ชื่อ :{" "}
                  <Text style={tw`text-lg text-green-700`}>
                    {chooseDriver.name}
                  </Text>
                </Text>
                <Text style={tw`text-lg font-bold`}>
                  ราคา :{" "}
                  <Text style={tw`text-lg text-red-700`}>
                    {chooseDriver.price}
                  </Text>{" "}
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
                  Alert.alert("เลือกคนนี้");
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

      <View style={tw`flex-1`}>
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
            {offer.map((item, index) => (
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
          </MapView>
        </View>
      </View>
      <View style={tw`flex-1 p-4`}>
        <View style={tw`flex-1 flex-row items-center justify-between`}>
          <TouchableOpacity
            style={tw`flex-1`}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`flex-8 text-2xl font-bold text-center`}>Choose Offer</Text>
          <View style={tw`flex-1`}></View>
        </View>
        <View style={tw`flex-9 items-center p-4`}>
          <FlatList
            data={offer}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={[
                  tw`flex-row items-center p-4 my-2 rounded shadow w-full justify-between`,
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
                <Text style={tw`text-lg font-bold`}>{item.name}</Text>
                <Text style={tw`text-lg font-bold`}>{item.price} บาท</Text>
                <Text style={tw`text-lg font-bold`}>
                  <MaterialIcons name="star" size={24} color="yellow" />
                  {item.rating}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChooseOffer;
