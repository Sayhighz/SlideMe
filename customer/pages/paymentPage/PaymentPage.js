import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";

export default function PaymentPage({ navigation }) {
  const [paymentMethods, setPaymentMethods] = useState();

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
      <View style={tw`z-10`}>
        <View style={tw`flex-1 left-4 top-4 absolute`}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`flex-9`}>
        <View style={tw`flex-1 items-center justify-center mt-4`}>
          <Text style={tw`text-2xl font-bold`}>ช่องทางการชำระเงิน</Text>
        </View>
        <View style={tw`flex-1 flex-row justify-around my-4`}>
          <Pressable
            style={tw`w-1/3 bg-[#60B876] border-[#60B876] border-2 rounded-lg items-center h-full justify-center`}
          >
            <Text>บัตรเครดิต/บัตรเดบิต</Text>
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
            <View style={tw`flex-row items-center p-4 bg-white mb-2 rounded`}>
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
            </View>
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
          <Text>เพิ่มช่องทางการชำระเงิน</Text>
        </Pressable>
      </View>
      <View style={tw`flex-9 mx-4 mt-4`}>
        <Text>ORDER SUMMARY</Text>
        <View style={tw`flex-2 bg-gray-200 p-4 mt-4 rounded-lg`}>
          <View style={tw`flex-1 justify-between`}>
            <View style={tw`flex-row justify-between`}>
              <Text>DELIVERY CHARGE</Text>
              <Text>xxx.xx THB</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text>FEE</Text>
              <Text>xxx.xx THB</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text>DISCOUNT</Text>
              <Text>xxx.xx THB</Text>
            </View>
          </View>
          <View style={tw`flex-1 justify-center`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-xl font-bold`}>TOTAL</Text>
              <Text style={tw`text-xl font-bold`}>xxx.xx THB</Text>
            </View>
          </View>
        </View>
        <View style={tw`flex-1 justify-center items-center`}>
          <Pressable
            style={tw`justify-center w-1/2 h-1/2 items-center border-2 rounded-lg bg-[#60B876] border-[#60B876]`}
            onPress={() => navigation.navigate("viewOrder")}
          >
            <Text>PAY NOW</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
