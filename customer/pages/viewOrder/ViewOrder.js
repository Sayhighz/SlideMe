import { Pressable, SafeAreaView, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";

export default function ViewOrder({navigation}) {
  return (
    <SafeAreaView style={tw`flex-1 relative `}>
      <View style={tw`flex-3`}>
        <View style={tw`z-10 flex-1 left-4 top-4 absolute`}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-2`}>
            <View style={tw`flex-1`}>
                <View style={tw`flex-1 flex-row justify-between px-4 items-end`}>
                    <Text style={tw``}>10:12 AM 15 ม.ค. 2567</Text>
                    <Text style={tw``}>xxxxxxxxxxxxxx</Text>
                </View>
                <View style={tw`flex-1 justify-around px-4`}>
                    <Text style={tw``}>ต้นทาง : xxx</Text>
                    <Text style={tw``}>ปลายทาง : xxx</Text>
                </View>
            </View>
            <View style={tw`flex-2`}>
                <View style={tw`flex-1 bg-black justify-center`}>
                    <Text style={tw`text-2xl font-bold text-center text-white`}>MAP</Text>
                </View>
            </View>
        </View>
        <View style={tw`flex-1`}>
            <Pressable style={tw`flex-1 bg-gray-300 justify-center m-4 rounded-lg`}>
                <Text style={tw`text-2xl text-center`}>PROFILE DRIVER</Text>
            </Pressable>
            <View style={tw`flex-2`}>
                <View style={tw`flex-1 flex-row justify-around mb-4`}>
                    <Pressable style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3 mx-4`}>
                        <MaterialIcons name="call" size={24} color="green" />
                        <Text>โทร</Text>
                    </Pressable>
                    <Pressable style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3 mx-4`}>
                        <MaterialIcons name="chat" size={24} color="black" />
                        <Text>ข้อความ</Text>
                    </Pressable>
                </View>
                <View style={tw`flex-1 justify-center items-center`}>
                    <Pressable style={tw`flex-1 bg-gray-300 justify-center rounded-lg items-center w-1/3`}>
                        <MaterialIcons name="close" size={24} color="red" />
                        <Text>ยกเลิก</Text>
                    </Pressable>
                </View>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
