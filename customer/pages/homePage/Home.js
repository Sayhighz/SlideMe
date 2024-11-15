import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-paper";
import Swiper from "react-native-swiper"; // Import Swiper
import tw from "twrnc";

function Home({ navigation }) {
  // Sample ads data (URLs for images or placeholders)
  const ads = [
    { id: 1, image: "https://via.placeholder.com/300x150.png?text=Ad+1" },
    { id: 2, image: "https://via.placeholder.com/300x150.png?text=Ad+2" },
    { id: 3, image: "https://via.placeholder.com/300x150.png?text=Ad+3" },
  ];

  return (
    <>
      <View style={tw`flex items-center `}>
        <View style={tw`flex relative`}>
          {/* Existing UI Elements */}
          <TouchableOpacity
            style={tw`mt-5`}
            onPress={() => navigation.navigate("Order")}
          >
            <Card
              style={tw`flex-row bg-white rounded-lg w-80 h-40 items-center justify-center border`}
            >
              <View style={tw`items-center justify-center`}>
                <Text style={tw`text-3xl font-bold`}>SLIDE ME</Text>
                <Text style={tw`text-lg`}>Service</Text>
              </View>
            </Card>
          </TouchableOpacity>

          <View style={tw`flex-row justify-between w-80`}>
            <TouchableOpacity>
              <Card
                style={tw`bg-white rounded-lg w-38 h-20 mt-4 flex items-center justify-center border`}
              >
                <Text style={tw`text-lg font-bold`}>ตำแหน่ง 1</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity>
              <Card
                style={tw`bg-white rounded-lg w-38 h-20 mt-4 flex items-center justify-center border`}
              >
                <Text style={tw`text-lg font-bold`}>ตำแหน่ง 2</Text>
              </Card>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Card
              style={tw`flex-row bg-white rounded-lg w-80 h-30  items-center justify-center border mt-5`}
            >
              <View style={tw`items-center justify-center`}>
                <Text style={tw`text-2xl font-bold`}>Order Status</Text>
              </View>
            </Card>
          </TouchableOpacity>

          {/* Swiper for Ads Banner */}
          <View style={tw`mt-4 w-80 h-40 absolute top-118`}>
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
                  <Image source={{ uri: ad.image }} style={tw`w-80 h-40`} />
                </View>
              ))}
            </Swiper>
          </View>
        </View>
      </View>
    </>
  );
}

export default Home;
