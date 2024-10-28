import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Pressable } from "react-native";

import * as Location from "expo-location";
import tw from "twrnc"; // import twrnc
import Map from "../../components/maps/Map";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

const MapPage = ({ navigation }) => {
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);

  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const [confirmDestination,setConfirmDestination] = useState([])

  const [tab, setTab] = useState(0);
  const [address, setAddress] = useState(null);
  const [storeAddress, setStoreAddress] = useState([]); // State สำหรับที่อยู่ของร้านค้า

// 13.855827502824274, 100.58551678180032

  //ร้านค้า
  const [store, setStore] = useState([
    {
      name: "store 1",
      latitude: 13.827187145167997,
      longitude: 100.5548010679114,
      price: "1,000",
    },
    {
      name: "store 2",
      latitude: 13.817187145167997,
      longitude: 100.654801069114,
      price: "1,000",
    },
    {
      name: "store 3",
      latitude: 13.827187145167997,
      longitude: 100.4548010679114,
      price: "1,000",
    },
    {
      name: "store 4",
      latitude: 13.727187145167997,
      longitude: 100.6548010679114,
      price: "1,000",
    },
    {
      name: "store 5",
      latitude: 13.927187145167997,
      longitude: 100.6548010679114,
      price: "1,000",
    },
  ]);

  //ระบุสถานที่
  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (response.length > 0) {
        const place = response[0];
        const address = `${place.name !== null ? place.name + "," : ""}${
          place.street !== null ? place.street + "," : ""
        }${place.city !== null ? place.city + "," : ""}${
          place.region !== null ? place.region + "," : ""
        }${place.country !== null ? place.country : ""}`;

        setDestinationAddress(address)
      }
    } catch (error) {
      console.error("Failed to get address:", error);
    }
  };
  //คำนวณระยะทาง
  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // รัศมีของโลกเป็นกิโลเมตร
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // ระยะทางเป็นกิโลเมตร
  };

  // useEffect(() => {
  //   store.forEach((item, index) => {
  //     getAddressFromCoords(item.latitude, item.longitude, index);
  //   });
  // }, [store]);

  useEffect(()=>{
    console.log(destination)
    getAddressFromCoords(destination.latitude,destination.longitude)
  },[destination])

  return (
    <SafeAreaView style={tw`flex-1 relative`}>
      <View
        style={{
          flexDirection: "row",
          zIndex: 10,
          position: "absolute",
          top: 20,
          backgroundColor:"white"
        }}
      >
        {/* <View style={{ flex: 0.5, marginRight: 5 }}>
          <GooglePlacesAutocomplete
            //ต้องขอ api
            fetchDetails={true}
            placeholder="Origin"
            minLength={2}
            debounce={400}
            onPress={(data, details = null) => {
              let originCordinates = {
                latitude: details?.geometry?.location.lat,
                longitude: details?.geometry?.location.lng,
              };
              setOrigin(originCordinates);
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "th",
            }}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log("ไม่พบสถานที่")}
          />
        </View> */}
          <View style={tw`flex-1 justify-center items-center`}>
            <Pressable> 
              <Text>ย้อน</Text>
            </Pressable>
          </View>
        <View style={tw`flex-9`}>
          <GooglePlacesAutocomplete
            //ต้องขอ api
            fetchDetails={true}
            placeholder="Destination"
            minLength={2}
            debounce={400}
            onPress={(data, details = null) => {
              let destinationCordinates = {
                latitude: details?.geometry?.location.lat,
                longitude: details?.geometry?.location.lng,
              };
              setDestination(destinationCordinates);
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "th",
            }}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log("ไม่พบสถานที่")}
          />
        </View>
      </View>

      <View style={tw`flex-3`}>
        <Map
          setDestination={setDestination}
          setOrigin={setOrigin}
          origin={origin}
          destination={destination}
          store={store}
        />
      </View>

      <View style={tw`flex-1 bg-white p-3 border border-white rounded-t-3xl`}>
        <View style={tw`flex-1 justify-center`}>
          <Text style={tw`text-xl font-bold mb-1`}>Destination</Text>
          <Text>{destinationAddress}</Text>
        </View>
        <View style={tw`flex-1 justify-end items-center `}>
        <Pressable 
          style={tw`border border-green-500 rounded-lg w-9/10 h-3/5 justify-center items-center bg-green-500`}
          onPress={()=>{console.log("ค่อยทำ")}}
        >
          <Text style={tw`text-white text-xl font-bold`}>Confirm destination</Text>
        </Pressable>
        </View>
      </View>

      {/* <View style={tw`flex-1 border-2 pt-2`}>
        <View style={tw`flex flex-row justify-around`}>
          {tabs.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setTab(index)}
              style={tw`rounded-full w-1/4 h-10 items-center justify-center ${
                tab === index ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={tw`my-5`}>
          <View style={tw`flex w-4/5 self-center `}>
            {tab === 0 && (
              <View style={tw`gap-y-10`}>
                <View style={tw`bg-white p-3`}>
                  <Text style={tw`mb-3`}>
                    <Text style={tw`font-bold text-red-500`}>ต้นทาง</Text>
                    {tabs[tab].address === "No location selected"
                      ? ""
                      : ` ${tabs[tab].originAddress}`}
                  </Text>
                  <Text>
                    <Text style={tw`font-bold text-green-500`}>ปลายทาง</Text>
                    {tabs[tab].address === "No location selected"
                      ? ""
                      : ` ${tabs[tab].destinationAddress}`}
                  </Text>
                </View>
                <View style={tw`bg-slate-300 p-3`}>
                  <Text>ประเภทของรถ : รถประเภทที่ x</Text>
                  <Text>ประเภทการเรียก : เรียกทันที</Text>
                </View>
              </View>
            )}
            {tab === 1 && (
              <View>
                {store.map((item, index) => {
                  const distance =
                    currentLocation &&
                    haversineDistance(currentLocation, item).toFixed(2);

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setDestination({
                          latitude: item.latitude,
                          longitude: item.longitude,
                        });
                      }}
                    >
                      <View
                        style={tw`bg-slate-300 p-3 flex flex-row my-2 rounded-lg justify-center items-center`}
                      >
                        <Text style={tw`flex-1 text-center`}>{item.name}</Text>
                        <Text
                          style={tw`flex-1 text-rose-800 text-center rounded-lg`}
                        >
                          {item.price}
                        </Text>
                        <Text style={tw`flex-1 text-center`}>
                          ระยะทาง{" "}
                          {distance ? `${distance} กม.` : "กำลังคำนวณ..."}
                        </Text>
                        <Text style={tw`flex-1 text-center`}>
                          {storeAddress[index] || "กำลังโหลดที่อยู่..."}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View> */}
    </SafeAreaView>
  );
};

export default MapPage;
