import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Card } from "react-native-paper";
import Swiper from "react-native-swiper";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";

function Home({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;
  const responsiveHeight = height * 0.2;

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
          <TouchableOpacity
            style={tw`mt-5`}
            onPress={() => navigation.navigate("Order")}
          >
            <LinearGradient
              colors={["#3DE183", "#60B876", "#6CA97C"]}
              style={[
                tw`rounded-lg items-center justify-center`,
                { width: responsiveWidth, height: height * 0.18, padding: 10 },
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

          <View
            style={[
              tw`flex-row justify-between mt-4`,
              { width: responsiveWidth },
            ]}
          >
            <TouchableOpacity
              style={[
                { flex: 0.48 },
                tw`rounded-lg h-20 flex items-center justify-center bg-[#5A8DEE]`,
              ]}
            >
              <Text
                style={[styles.globalText, tw`text-white text-lg font-bold`]}
              >
                ตำแหน่ง 1
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                { flex: 0.48 },
                tw`rounded-lg h-20 flex items-center justify-center bg-[#5A8DEE]`,
              ]}
            >
              <Text
                style={[styles.globalText, tw`text-white text-lg font-bold`]}
              >
                ตำแหน่ง 2
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <LinearGradient
              colors={["#60B876", "#53A567"]}
              style={[
                { width: responsiveWidth, height: height * 0.18, padding: 10 },
                tw`rounded-lg items-center justify-center mt-5`,
              ]}
            >
              <TouchableOpacity>
                <Text
                  style={[styles.globalText, tw`text-3xl font-bold text-white`]}
                >
                  Order Status
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Swiper for Ads Banner (placed above bottom navbar) */}
        <View
          style={[
            tw`mb-4`,
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
                style={tw`flex items-center justify-center w-full h-full`}
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
});

export default Home;
