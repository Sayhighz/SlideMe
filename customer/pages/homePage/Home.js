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
import { MaterialIcons } from "@expo/vector-icons"; // Importing MaterialIcons for icons
import Swiper from "react-native-swiper";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { UserContext } from "../../UserContext";
import { IP_ADDRESS } from "../../config";

function Home({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData } = useContext(UserContext);

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
        });
      } else if (data.Message === "No accepted records found for customer_id") {
        Alert.alert("ไม่มี Order ที่กำลังทำงานอยู่");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const route = useRoute();
  const ads = [
    { id: 1, image: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=ads1.png` },
    { id: 2, image: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=ads2.png` },
    { id: 3, image: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=ads3.png` },
  ];  

  return (
    <SafeAreaView style={tw`flex-1`} edges={["top", "left", "right"]}>
      <View style={[tw`flex-1 items-center justify-center `]}>
        {/* Main Content */}
        <View style={tw`flex-1 w-full items-center mt-5`}>
          <Text style={[styles.globalText,tw`text-left text-sm mb-[-20px] mt-5  flex-1 font-bold text-gray-500`]}>
            สวัสดี
          </Text>
    
          <Text style={[styles.globalText,tw`flex-1 text-2xl font-bold mt-2 mb-4 text-[#60B876]`]}>
            {userData?.first_name || userData?.phone_number}!
          </Text>
          <View style={tw`flex-5 justify-center shadow-xl`}>
            <TouchableOpacity
              style={tw``}
              onPress={() => navigation.navigate("Order")}
            >
              <LinearGradient
                colors={["#3DE183", "#60B876", "#6CA97C"]}
                style={[
                  tw`flex-1 rounded-lg border border-gray-300 shadow-sm flex-row items-center justify-center`,
                  {
                    width: responsiveWidth,
                    height: height * 0.23,
                    paddingHorizontal: 20,
                  },
                ]}
              >
                <MaterialIcons
                  name="car-repair"
                  size={80}
                  color="white"
                  style={tw`mr-3`}
                />
                <View>
                  <Text
                    style={[
                      styles.globalText,
                      tw`text-white text-xl font-light`,
                    ]}
                  >
                    เรียกบริการ
                  </Text>
                  <Text
                    style={[
                      styles.globalText,
                      tw`text-white text-3xl font-bold`,
                    ]}
                  >
                    รถสไลด์
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View
            style={[
              tw`flex-row flex-6 justify-between mt-4`,
              { width: responsiveWidth },
            ]}
          >
            {/* ติดตามสถานะ Button */}
            <TouchableOpacity
              style={[
                { width: width * 0.42, height: width * 0.42 },
                tw`rounded-lg items-center justify-center bg-white shadow-md`,
              ]}
              onPress={() => order_status()}
            >
              <MaterialIcons name="track-changes" size={50} color="#60B876" />
              <Text
                style={[
                  styles.globalText,
                  tw`text-base font-bold text-[#60B876] mt-2`,
                ]}
              >
                ติดตามสถานะ
              </Text>
            </TouchableOpacity>

            {/* ติดต่อเรา Button */}
            <TouchableOpacity
              style={[
                { width: width * 0.42, height: width * 0.42 },
                tw`rounded-lg items-center justify-center bg-white shadow-md`,
              ]}
            >
              <MaterialIcons name="call" size={50} color="#60B876" />
              <Text
                style={[
                  styles.globalText,
                  tw`text-base font-bold text-[#60B876] mt-2`,
                ]}
              >
                ติดต่อเรา
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swiper for Ads Banner */}
        <View
          style={[tw`mb-15`, { width: responsiveWidth, height: height * 0.2 }]}
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
                    height: height * 0.2,
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
});

export default Home;
