import React, { useState , useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { Card } from "react-native-paper";
import Swiper from "react-native-swiper";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { UserContext } from "../../UserContext";

function Home({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;
  const responsiveHeight = height * 0.2;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {  userData } = useContext(UserContext);
 

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const Card = ({ title, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={tw`w-4/5 mx-2 bg-gray-200 rounded-lg p-5 shadow`}
    >
      <Text style={tw`text-lg font-semibold text-center`}>{title}</Text>
    </TouchableOpacity>
  );

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
    <>
      <View style={tw`flex-1 items-center justify-between `}>
        {/* Main Content */}
        <View style={tw`relative w-full items-center`}>

        <Text style={tw`text-xl font-bold mt-4`}>
        Welcome {userData?.username || "User"} !
      </Text>
          <TouchableOpacity
            style={tw`mt-3`}
            onPress={() => navigation.navigate("Order")}
          >
            <LinearGradient
              colors={["#3DE183", "#60B876", "#6CA97C"]}
              style={[
                tw`rounded-lg items-center justify-center`,
                { width: responsiveWidth, height: height * 0.19, padding: 10 },
              ]}
            >
              <Text
                style={[styles.globalText, tw`text-white text-4xl font-bold`]}
              >
                SLIDE ME
              </Text>
              <Text style={[styles.globalText, tw`text-white text-xl`]}>
                Service
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* <View
            style={[
              tw`flex-row justify-between mt-4`,
              { width: responsiveWidth },
            ]}
          >
          <TouchableOpacity
              style={[
                { flex: 0.48 , height : height * 0.09},
                tw`rounded-lg  flex items-center justify-center bg-green-100 border border-[#60B876]`,
              ]}
              onPress={() =>
                selectedLabel !== "ไม่ระบุ" && selectedLabel
                  ? navigation.navigate("Order", {
                      
                      origin,
                      destination,
                      confirmOrigin,
                      confirmDestination,
                    })
                  : navigation.navigate("Bookmark")
              }
            >
              <Text
                style={[styles.globalText, tw`text-[#5A8DEE] text-lg font-bold`]}
              >
                {selectedLabel !== "ไม่ระบุ" ? selectedLabel : "ตำแหน่ง 1"}
              </Text>
            </TouchableOpacity>

          <TouchableOpacity
              style={[
                { flex: 0.48 , height : height * 0.09},
                tw`rounded-lg  flex items-center justify-center bg-green-100 border-[#60B876] border`,
              ]}
              onPress={handleOpenModal}
            >
              <Text
                style={[styles.globalText, tw`text-[#5A8DEE] text-lg font-bold`]}
              >
                ตำแหน่ง 2
              </Text>
            </TouchableOpacity>
          
          </View> */}

          <View>
            <TouchableOpacity
              style={[
                { width: responsiveWidth, height: height * 0.16, padding: 10 },
                tw`rounded-lg items-center justify-center mt-3 `,
              ]}
              onPress={() => navigation.navigate("Rating")}
            >
              <LinearGradient
                colors={["#3DE183", "#60B876", "#6CA97C"]}
                style={[
                  { width: responsiveWidth, height: height * 0.16 },
                  tw`rounded-lg items-center justify-center `,
                ]}
              >
                <Text
                  style={[styles.globalText, tw`text-3xl font-bold text-white`]}
                >
                  Order Status
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={[
                { width: responsiveWidth, height: height * 0.12, padding: 10 },
                tw`rounded-lg items-center justify-center mt-3 `,
              ]}
            >
              <LinearGradient
                colors={["#60B876", "#53A567"]}
                style={[
                  {
                    width: responsiveWidth,
                    height: height * 0.12,
                    padding: 10,
                  },
                  tw`rounded-lg items-center justify-center`,
                ]}
              >
                <Text
                  style={[styles.globalText, tw`text-3xl font-bold text-white`]}
                >
                  ติดต่อเรา
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Swiper for Ads Banner (placed above bottom navbar) */}
        <View
          style={[
            tw``,
            { width: responsiveWidth, height: responsiveHeight },
          ]}
        >
          <Swiper
            autoplay
            showsPagination
            loop
            style={tw`rounded-lg`}
            activeDotColor="#60B876"
          >
            {(ads || []).map((ad) => (
              <View
                key={ad.id}
                style={[
                  { height: height * 0.17 },
                  tw`flex items-center justify-center w-full`,
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
    </>
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
