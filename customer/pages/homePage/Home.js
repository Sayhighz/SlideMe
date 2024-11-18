import React from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import Swiper from "react-native-swiper"; // Import Swiper
import tw from "twrnc";

function Home({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9; // 90% of screen width
  const responsiveHeight = height * 0.2; // 20% of screen height for the Swiper banner

  // Sample ads data (URLs for images or placeholders)
  const ads = [
    { id: 1, image: "https://via.placeholder.com/300x150.png?text=Ad+1" },
    { id: 2, image: "https://via.placeholder.com/300x150.png?text=Ad+2" },
    { id: 3, image: "https://via.placeholder.com/300x150.png?text=Ad+3" },
  ];

  return (
    <View style={tw`flex-1 items-center justify-between`}>
      {/* Main Content */}
      <View style={tw`relative w-full items-center`}>
        <TouchableOpacity
          style={tw`mt-5`}
          onPress={() => navigation.navigate("Order")}
        >
          <Card
            style={[
              tw`flex-row bg-white rounded-lg items-center justify-center border`,
              { width: responsiveWidth, height: height * 0.19 } // 15% of screen height
            ]}
          >
            <View style={tw`items-center justify-center`}>
              <Text style={[styles.globalText, tw`text-4xl font-bold`]}>SLIDE ME</Text>
              <Text style={[styles.globalText, tw`text-lg`]}>Service</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <View style={[tw`flex-row justify-between mt-4`, { width: responsiveWidth }]}>
          <TouchableOpacity style={{ flex: 0.48 }}>
            <Card
              style={tw`bg-white rounded-lg h-20 flex items-center justify-center border`}
            >
              <Text style={[styles.globalText, tw`text-lg font-bold`]}>ตำแหน่ง 1</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 0.48 }}>
            <Card
              style={tw`bg-white rounded-lg h-20 flex items-center justify-center border`}
            >
              <Text style={[styles.globalText, tw`text-lg font-bold`]}>ตำแหน่ง 2</Text>
            </Card>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ marginTop: 20 }}>
          <Card
            style={[
              tw`flex-row rounded-lg items-center justify-center border bg-white`, ,
              { width: responsiveWidth, height: height * 0.17 } // 10% of screen height
            ]}
          >
            <View style={tw`items-center justify-center`}>
              <Text style={[styles.globalText, tw`text-3xl font-bold`]}>Order Status</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Swiper for Ads Banner (placed above bottom navbar) */}
      <View style={[tw`mb-4`, { width: responsiveWidth, height: responsiveHeight }]}>
        <Swiper
          autoplay
          showsPagination
          loop
          style={tw`rounded-lg`}
          activeDotColor="blue"
        >
          {ads.map((ad) => (
            <View
              key={ad.id}
              style={tw`flex items-center justify-center w-full h-full`}
            >
              <Image source={{ uri: ad.image }} style={{ width: responsiveWidth, height: responsiveHeight, resizeMode: 'cover' }} />
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: 'Mitr-Regular'
  },
});

export default Home;
