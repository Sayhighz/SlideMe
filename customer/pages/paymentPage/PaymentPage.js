import { FlatList, SafeAreaView, ScrollView, Text, View , StyleSheet} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

export default function PaymentPage({ navigation }) {

  const feePrice = 200

  const [paymentMethods, setPaymentMethods] = useState();

  const [choosePaymentMethod, setChoosePaymentMethod] = useState();

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
      <View style={tw`flex-9`}>
        <View style={tw`flex-1 flex-row justify-around my-4`}>
          <Pressable
            style={tw`w-1/3 bg-[#60B876] border-[#60B876] border-2 rounded-lg items-center h-full justify-center`}
          >
            <Text style={styles.globalText}>บัตรเครดิต/บัตรเดบิต</Text>
          </Pressable>
          <Pressable
            style={tw`w-1/3 bg-gray-300 border-gray-300 border-2 rounded-lg items-center h-full justify-center`}
          >
            <Text>Mobile Banking</Text>
          </Pressable>
        </View>
        <FlatList
          style={tw`flex-3 mx-4`}
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable 
              style={[
                tw`flex-row items-center p-4 mb-2 rounded`, 
                choosePaymentMethod &&
                choosePaymentMethod.id === item.id ? tw`bg-[#60B876]` : tw`bg-white`
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
                <Text style={[styles.globalText , tw`text-lg font-bold`]}>{item.accountName}</Text>
                <Text style={[styles.globalText , tw`text-sm mt-2`]}>{item.accountNumber}</Text>
              </View>
            </Pressable>
          )}
        />
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
          <Text style={styles.globalText}>เพิ่มช่องทางการชำระเงิน</Text>
        </Pressable>
      </View>
      <View style={tw`flex-9 mx-4 mt-4`}>
        <Text>ORDER SUMMARY</Text>
        <View style={tw`flex-2 bg-gray-200 p-4 mt-4 rounded-lg`}>
          <View style={tw`flex-4 justify-between`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={[styles.globalText , tw`flex-1 text-lg font-bold`]}>{driverName}</Text>
              <View style={tw`flex-1 flex-row justify-end items-center`}>
                <MaterialIcons name="star" size={24} color="yellow" />
                <Text style={[styles.globalText , tw` font-bold text-center`]}>
                  {driverRating}
                </Text>
              </View>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text>DELIVERY CHARGE</Text>
              <Text><Text style={tw`font-bold text-[#E33F3F]`}>{driverPrice}</Text> THB</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={styles.globalText}>FEE</Text>
              <Text style={styles.globalText}><Text style={tw`font-bold text-[#E33F3F]`}>{feePrice}</Text> THB</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={styles.globalText}>DISCOUNT</Text>
              <Text style={styles.globalText}><Text style={tw`font-bold text-[#60B876]`}>XXX.XX</Text> THB</Text>
            </View>
          </View>
          <View style={tw`flex-2 justify-center`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={[styles.globalText , tw`text-xl font-bold`]}>TOTAL</Text>
              <Text style={[styles.globalText , tw`text-xl font-bold`]}><Text style={tw`font-bold text-[#E33F3F]`}>XXX.XX</Text> THB</Text>
            </View>
          </View>
        </View>
        <View style={tw`flex-1 justify-center items-center`}>
          <Pressable
            style={tw`justify-center w-1/2 h-1/2 items-center border-2 rounded-lg bg-[#60B876] border-[#60B876]`}
            onPress={() => navigation.navigate("viewOrder",
              {
                driverProfile: route.params,
                originLocation: route.params.originLocation,
                destinationLocation: route.params.destinationLocation
              })}
          >
            <Text>PAY NOW</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular'
  },
});