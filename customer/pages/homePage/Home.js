import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

import tw from "twrnc"; // import twrnc
// import Map from "../../components/maps/Map";

const HomePage = ({ navigation }) => {
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);

  const [tab, setTab] = useState(0);

  const [store, setStore] = useState([
    {
      name: "store 1",
      latitude: 13.827187145167997,
      longitude: 100.6548010679114,
      price: "1,000",
    },
    {
      name: "store 2",
      latitude: 13.827187145167997,
      longitude: 100.6548010679114,
      price: "1,000",
    },
    {
      name: "store 3",
      latitude: 13.827187145167997,
      longitude: 100.6548010679114,
      price: "1,000",
    },
    {
      name: "store 4",
      latitude: 13.827187145167997,
      longitude: 100.6548010679114,
      price: "1,000",
    },
    {
      name: "store 5",
      latitude: 13.827187145167997,
      longitude: 100.6548010679114,
      price: "1,000",
    },
  ]);
  
  const tabs = [
    {
      title: "Tab 1",
      origin: `${
        origin.latitude
          ? `Latitude: ${origin.latitude}, 
                Longitude: ${origin.longitude}`
          : "No location selected"
      }`,
      destination: `${
        destination.latitude
          ? `Latitude: ${destination.latitude},
                Longitude: ${destination.longitude}`
          : "No location selected"
      }`,
    },
    { title: "Tab 2", content: "This is the content of Tab 2" },
  ];

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 px-10 py-5`}>
        {/* <Map setDestination={setDestination} setOrigin={setOrigin} /> */}
      </View>
      <View style={tw`flex-1 mt-5 border py-1 `}>
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
        <ScrollView style={tw`mt-1`}>
          <View style={tw`flex w-4/5 self-center `}>
            {tab === 0 && (
              <View style={tw`gap-y-10`}>
                <View style={tw`bg-white p-3`}>
                  <Text>
                    <Text style={tw`font-bold text-red-700`}>ต้นทาง</Text>
                    {tabs[tab].origin === "No location selected"
                      ? ""
                      : ` ${tabs[tab].origin}`}
                  </Text>
                  <Text>
                    <Text style={tw`font-bold text-green-500`}>ปลายทาง</Text>
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
                  <View
                    key={index}
                    style={tw`bg-slate-300 p-3 flex flex-row my-2 rounded-lg`}
                  >
                    <Text style={tw`flex-1`}>{item.name}</Text>
                    <Text style={tw`flex-1 text-right `}>{item.price}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
