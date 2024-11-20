import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";

export default function PaymentPage({ navigation }) {
  const feePrice = 200;

  const [discount, setDiscount] = useState(0);

  const [paymentMethods, setPaymentMethods] = useState();

  const [choosePaymentMethod, setChoosePaymentMethod] = useState("");

  const [tabIndex, setTabIndex] = useState(0);

  const route = useRoute();

  const driverId = route.params?.chooseDriver.id || "ไม่ระบุ";
  const driverName = route.params?.chooseDriver.name || "ไม่ระบุ";
  const driverRating = route.params?.chooseDriver.rating || "0";
  const driverPrice = route.params?.chooseDriver.price || "0";

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(
          `http://${IP_ADDRESS}:3000/auth/get_payments_method`
        );
        setPaymentMethods(response.data.Result); // Assuming the response data is in the expected format
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
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
                key={item.id}
                style={[
                  tw`flex-row items-center p-4 mb-2 rounded`,
                  choosePaymentMethod &&
                  choosePaymentMethod.card_number === item.card_number &&
                  choosePaymentMethod.payment_type === item.payment_type &&
                  choosePaymentMethod.account_name === item.account_name
                    ? tw`bg-[#60B876]`
                    : tw`bg-white`,
                ]}
                onPress={() => {
                  setChoosePaymentMethod(item);
                }}
              >
                <View style={tw`flex-1 items-center`}>
                  {(() => {
                    if (item.payment_type === "credit_card") {
                      return (
                        <Icon
                          source="credit-card"
                          size={30}
                          color="#f59e0b"
                          style={tw`mr-3`}
                        />
                      );
                    } else if (item.payment_type === "debit_card") {
                      return (
                        <Icon
                          source="credit-card"
                          size={30}
                          color="#3b82f6"
                          style={tw`mr-3`}
                        />
                      );
                    } else if (item.payment_type === "paypal") {
                      return (
                        <Icon
                          source="alpha-p"
                          size={30}
                          color="blue"
                          style={tw`mr-3`}
                        />
                      );
                    } else if (item.payment_type === "bank_transfer") {
                      return (
                        <Icon
                          source="bank"
                          size={30}
                          color="green"
                          style={tw`mr-3`}
                        />
                      );
                    } else if (item.payment_type === "other") {
                      return (
                        <Icon
                          source="dots-horizontal"
                          size={30}
                          color="black"
                          style={tw`mr-3`}
                        />
                      );
                    }
                  })()}
                </View>

                <View style={tw`flex-5`}>
                  <Text style={tw`text-lg font-bold`}>{item.account_name}</Text>
                  <Text style={tw`text-sm mt-2`}>{item.card_number}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
        {tabIndex === 0 && (
          <Pressable
            style={tw`flex-1 items-center h-full justify-center border-2 mx-4 border-dashed rounded-lg mt-4`}
          >
            <Text>Add Payment Method</Text>
          </Pressable>
        )}
        {tabIndex === 1 && (
          <View style={tw`flex-4 mx-4 mb-4`}>
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
                <QRCode size={200} value="http://awesome.link.qr" />
              </Pressable>
            </View>
          </View>
        )}
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
                <Text style={tw`font-bold text-[#E33F3F]`}>{driverPrice}</Text>{" "}
                THB
              </Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text>FEE</Text>
              <Text>
                <Text style={tw`font-bold text-[#E33F3F]`}>{feePrice}</Text> THB
              </Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text>DISCOUNT</Text>
              <Text>
                <Text style={tw`font-bold text-[#60B876]`}>
                  {discount === 0 ? "0" : discount}
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
        {tabIndex === 0 ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <Pressable
              style={tw`justify-center w-1/2 h-2/3 items-center border-2 rounded-lg bg-[#60B876] border-[#60B876]`}
              onPress={() => {
                if (choosePaymentMethod !== "") {
                  navigation.navigate("viewOrder", {
                    driverProfile: route.params,
                    originLocation: route.params.originLocation,
                    destinationLocation: route.params.destinationLocation,
                  });
                }
              }}
            >
              <Text>PAY NOW</Text>
            </Pressable>
          </View>
        ) : (
          <View style={tw`flex-1`}></View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});
