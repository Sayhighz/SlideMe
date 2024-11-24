import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  
} from "react-native";
import { Card } from "react-native-paper";
import Swiper from "react-native-swiper";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { UserContext } from "../../UserContext";
import { IP_ADDRESS } from "../../config";


function Home({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;
  const responsiveHeight = height * 0.2;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData } = useContext(UserContext); // Access userData from UserContext

  const order_status = async () => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/order_status/${userData.user_id}`
      );
      const data = await response.json();
      console.log("order_status:", data);
      if (data.Status) {
        navigation.navigate("viewOrder", {
          driverProfile: {
            chooseDriver: {
              request_id: data.Result.request_id,
              id: data.Result.accepted_driver_id,
              customer_id_request: userData.user_id,
            },
          },
        })
      }
      else if(data.Message === "No accepted records found for customer_id") {
        Alert.alert("ไม่มี Order ที่กำลังทำงานอยู่");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const route = useRoute();
  const selectedLabel = route.params?.selectedLabel || "ไม่ระบุ";
  const origin = route.params?.origin || "ไม่ระบุ";
  const destination = route.params?.destination || "ไม่ระบุ";
  const confirmOrigin = route.params?.confirmOrigin || "ไม่ระบุ";
  const confirmDestination = route.params?.confirmDestination || "ไม่ระบุ";

  // Sample ads data (URLs for images or placeholders)
  const ads = [
    { id: 1, image: "https://via.placeholder.com/300x150.png?text=Ad+1" },
    { id: 2, image: "https://via.placeholder.com/300x150.png?text=Ad+2" },
    { id: 3, image: "https://via.placeholder.com/300x150.png?text=Ad+3" },
  ];

  return (
    <SafeAreaView style={tw`flex-1`} edges={["top", "left", "right"]}>
      <View style={[tw`flex-1 items-center justify-center `]}>
        {/* Main Content */}
        <View style={tw`flex-1 w-full items-center mt-7`}>
          <Text style={tw`flex-1 text-xl font-bold mb-4`}>
            Welcome, {userData?.first_name || userData?.phone_number}!
          </Text>
          <View style={tw`flex-5 justify-center shadow-xl`}>
            <TouchableOpacity
              style={tw``}
              onPress={() => navigation.navigate("Order")}
            >
              <LinearGradient
                colors={["#3DE183", "#60B876", "#6CA97C"]}
                style={[
                  tw`flex-1 rounded-lg items-center justify-center border border-gray-300`,
                  {
                    width: responsiveWidth,
                    height: height * 0.23,
                    padding: 10,
                  },
                ]}
              >
                <View style={[tw`flex-1 items-center justify-center `] }>
                
                <Text
                  style={[styles.globalText, tw`text-white text-4xl font-bold p-1 `] }
                >
                 เรียกบริการ
                </Text>
                <Text style={[styles.globalText, tw`text-white text-4xl p-1`]}>
                  รถสไลด์
                </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={[tw`flex-row flex-6 justify-between mt-4` , {width : responsiveWidth}]}> 
            
              <TouchableOpacity
                style={[
                  { height: height * 0.16 },
                  { flex: 0.48 },

                  tw`rounded-lg items-center justify-center bg-[#60B876]`,
                ]}
                onPress={() => order_status()}
              >
                <Text
                  style={[styles.globalText, tw`text-2xl font-bold text-white`]}
                >
                  ติดตามสถานะ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  { height: height * 0.16 },
                  { flex: 0.48 },
                  tw`rounded-lg items-center justify-center bg-[#60B876]`,
                ]}
              >
                <Text
                  style={[styles.globalText, tw`text-2xl font-bold text-white`]}
                >
                  ติดต่อเรา
                </Text>
              </TouchableOpacity>
            
          </View>
        </View>

        {/* Swiper for Ads Banner (placed above bottom navbar) */}
        <View
          style={[tw`mb-5`, { width: responsiveWidth, height: responsiveHeight }]}
        >
          <Swiper
            autoplay
            showsPagination
            loop
            style={tw`rounded-lg `}
            activeDotColor="#60B876"
          >
            {(ads || []).map((ad) => (
              <View
                key={ad.id}
                style={[
                  { height: height * 0.17 },
                  tw`flex-1 items-center justify-center w-full `,
                ]}
              >
                <Image
                  source={{ uri: ad.image }}
                  style={{
                    width: responsiveWidth,
                    height: responsiveHeight,
                    resizeMode: "cover",
                  }}
                />
              </View>
            ))}
          </Swiper>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Home;
