import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

export default function PaymentPage({ navigation }) {
  const feePrice = 200;

  const [discount, setDiscount] = useState(0);

  const [paymentMethods, setPaymentMethods] = useState();

  const [choosePaymentMethod, setChoosePaymentMethod] = useState("");

  const [tabIndex, setTabIndex] = useState(0);

  const route = useRoute();

  const driverId = route.params?.chooseDriver.id || "ไม่ระบุ";
  const driverName = route.params?.chooseDriver.name || "ไม่ระบุ";
  const driverRating = route.params?.chooseDriver.rating || "ไม่ระบุ";
  const driverPrice = route.params?.chooseDriver.price || "ไม่ระบุ";

  const mockupPaymentMethods = [
    {
      id: "1",
      type: "บัตรเครดิต",
      accountName: "Kunatip",
      accountNumber: "**** 1234",
    },
    {
      id: "2",
      type: "บัตรเดบิต",
      accountName: "Night",
      accountNumber: "**** 4567",
    },
    {
      id: "3",
      type: "บัตรเครดิต",
      accountName: "few",
      accountNumber: "**** 4949",
    },
  ];

  useEffect(() => {
    setPaymentMethods(mockupPaymentMethods);
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 relative`}>
      <View style={tw`flex-1`}>
        <View style={tw`flex-1 flex-row justify-around my-4`}>
          <Pressable
            style={[
              tw`w-1/3 border-2 rounded-lg items-center h-full justify-center`,
              tabIndex === 0
                ? tw`bg-[#60B876] border-[#60B876]`
                : tw`bg-gray-300 border-gray-300`,
            ]}
            onPress={() => {
              setTabIndex(0);
            }}
          >
            <Text>Credit / Debit</Text>
          </Pressable>
          <Pressable
            style={[
              tw`w-1/3 border-2 rounded-lg items-center h-full justify-center`,
              tabIndex === 1
                ? tw`bg-[#60B876] border-[#60B876]`
                : tw`bg-gray-300 border-gray-300`,
            ]}
            onPress={() => {
              setTabIndex(1);
            }}
          >
            <Text>Mobile Banking</Text>
          </Pressable>
        </View>
        {tabIndex === 0 && (
          <FlatList
            style={tw`flex-3 mx-4`}
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  tw`flex-row items-center p-4 mb-2 rounded`,
                  choosePaymentMethod && choosePaymentMethod.id === item.id
                    ? tw`bg-[#60B876]`
                    : tw`bg-white`,
                ]}
                onPress={() => {
                  setChoosePaymentMethod(item);
                }}
              >
                <View style={tw`flex-1 items-center`}>
                  {item.type === "บัตรเครดิต" ? (
                    <Icon
                      source="credit-card"
                      size={30}
                      color="#f59e0b"
                      style={tw`mr-3`}
                    />
                  ) : (
                    <Icon
                      source="credit-card"
                      size={30}
                      color="#3b82f6"
                      style={tw`mr-3`}
                    />
                  )}
                </View>
                <View style={tw`flex-5`}>
                  <Text style={tw`text-lg font-bold`}>{item.accountName}</Text>
                  <Text style={tw`text-sm mt-2`}>{item.accountNumber}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
        {tabIndex === 0 && (
          <Pressable
            style={tw`flex-1 items-center h-full justify-center border-2 mx-4 border-dashed rounded-lg mt-4`}
            onPress={() => {
              setPaymentMethods([
                ...paymentMethods,
                {
                  id: paymentMethods.length + 1,
                  type: "บัตรเครดิต",
                  accountName: "Kunatip",
                  accountNumber: "**** 1234",
                },
              ]);
            }}
          >
            <Text>Add Payment Method</Text>
          </Pressable>
        )}
        {tabIndex === 1 && 
          <View style={tw`flex-4 mx-4 border-2 mb-4`}>
            <View style={tw`flex-1 items-center justify-center`}>
              <Pressable
                // onPress={() => {
                //   setInterval(() => {
                //     navigation.navigate("viewOrder", {
                //       driverProfile: route.params,
                //       originLocation: route.params.originLocation,
                //       destinationLocation: route.params.destinationLocation,
                //     })
                //   }, 10000);
                // }}
              >
                <Text style={tw`text-lg font-bold border-2`}>Qrcode</Text>
              </Pressable>
            </View>
          </View>
        }
      </View>
        <View style={tw`flex-1 mx-4 mt-4`}>
          <Text>ORDER SUMMARY</Text>
          <View style={tw`flex-3 bg-gray-200 p-2 mt-4 rounded-lg`}>
            <View style={tw`flex-4 justify-between`}>
              <View style={tw`flex-row justify-between`}>
                <Text style={tw`flex-9 text-lg font-bold`}>{driverName}</Text>
                <View style={tw`flex-1 flex-row justify-end items-center`}>
                  <MaterialIcons name="star" size={24} color="yellow" />
                  <Text style={tw` font-bold text-center`}>{driverRating}</Text>
                </View>
              </View>
              <View style={tw`flex-row justify-between`}>
                <Text>DELIVERY CHARGE</Text>
                <Text>
                  <Text style={tw`font-bold text-[#E33F3F]`}>
                    {driverPrice}
                  </Text>{" "}
                  THB
                </Text>
              </View>
              <View style={tw`flex-row justify-between`}>
                <Text>FEE</Text>
                <Text>
                  <Text style={tw`font-bold text-[#E33F3F]`}>{feePrice}</Text>{" "}
                  THB
                </Text>
              </View>
              <View style={tw`flex-row justify-between`}>
                <Text>DISCOUNT</Text>
                <Text>
                  <Text style={tw`font-bold text-[#60B876]`}>
                    {discount === 0 ? "XXX.XX" : discount}
                  </Text>{" "}
                  THB
                </Text>
              </View>
            </View>
            <View style={tw`flex-2 justify-center`}>
              <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-xl font-bold`}>TOTAL</Text>
                <Text style={tw`text-xl font-bold`}>
                  <Text style={tw`font-bold text-[#E33F3F]`}>
                    {driverPrice + feePrice - discount}
                  </Text>{" "}
                  THB
                </Text>
              </View>
            </View>
          </View>
      {tabIndex === 0 ?   <View style={tw`flex-1 justify-center items-center`}>
            <Pressable
              style={tw`justify-center w-1/2 h-2/3 items-center border-2 rounded-lg bg-[#60B876] border-[#60B876]`}
              onPress={() =>
                {if(choosePaymentMethod !== ""){ 
                navigation.navigate("viewOrder", {
                  driverProfile: route.params,
                  originLocation: route.params.originLocation,
                  destinationLocation: route.params.destinationLocation,
                })
              }}
            }
            >
              <Text>PAY NOW</Text>
            </Pressable>
          </View> 
          :
          <View style={tw`flex-1`}></View>  
        }
        </View>
    </SafeAreaView>
  );
}
