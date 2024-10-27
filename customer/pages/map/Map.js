import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

import tw from "twrnc"; // import twrnc
import Map from "../../components/maps/Map";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

const MapPage = ({ navigation }) => {
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);
  const [tab, setTab] = useState(0);
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
  
  //แต่ละ tab มีหัวข้ออะไรบ้าง
  const tabs = [
    {
      title: "Tab 1",
      origin: `${
        origin.latitude
          ? ` Latitude: ${origin.latitude}, 
            Longitude: ${origin.longitude}`
          : "No location selected"
      }`,
      destination: `${
        destination.latitude
          ? ` Latitude: ${destination.latitude},
            Longitude: ${destination.longitude}`
          : "No location selected"
      }`,
    },
    { 
      title: "Tab 2" 
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 relative`}>
      <View style={{flex:0.5,flexDirection:"row",zIndex:10,position:"absolute"}}>
        <View style={{ flex: 0.5 ,marginRight:5}}>
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
          </View>
          <View style={{ flex: 0.5,marginLeft:5}}>
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
      
      <View style={tw`flex-2 z-0`}>
        <Map setDestination={setDestination} setOrigin={setOrigin} origin={origin} destination={destination} store={store} /> 
      </View>

      <View style={tw`flex-1 border-2 pt-2`}>
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
                  <Text>
                    <Text style={tw`font-bold text-green-500`}>ต้นทาง</Text>
                    {tabs[tab].origin === "No location selected"
                      ? ""
                      : ` ${tabs[tab].origin}`}
                  </Text>
                  <Text>
                    <Text style={tw`font-bold text-red-500`}>ปลายทาง</Text>
                    {tabs[tab].destination === "No location selected"
                      ? ""
                      : ` ${tabs[tab].destination}`}
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
                {store.map((item, index) => (
                  <TouchableOpacity 
                    key={index}
                    onPress={()=>{
                      setDestination({
                        latitude:item.latitude,
                        longitude:item.longitude
                      })
                    }}
                  >  
                  <View
                    style={tw`bg-slate-300 p-3 flex flex-row my-2 rounded-lg justify-center items-center`}
                  >
                    <Text style={tw`flex-1 text-center`}>{item.name}</Text>
                    <Text style={tw`flex-1 text-center`}></Text>
                    <Text style={tw`flex-1 text-rose-800 text-center rounded-lg`}>{item.price}</Text>
                    <Text style={tw`flex-1 text-center`}>
                      ระยะทาง xx.xx กม.
                    </Text>
                  </View>
                </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MapPage;
