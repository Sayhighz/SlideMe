import React from "react";
import { View, Image, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";

const AdsSwiper = () => {
  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.92;
  const swiperHeight = height * 0.22;

  const ads = [
    {
      id: 1,
      image: "https://via.placeholder.com/600x200/60B876/FFFFFF?text=SLIDEME+DRIVER+PROMO",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/600x200/4682B4/FFFFFF?text=SPECIAL+OFFER",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/600x200/ffc107/000000?text=NEW+FEATURES",
    },
  ];

  return (
    <View
      style={[
        tw`w-full shadow-lg`,
        { 
          height: swiperHeight,
          shadowColor: "#60B876",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 5,
        }
      ]}
    >
      <Swiper
        autoplay
        autoplayTimeout={5}
        showsPagination
        loop
        activeDotColor="#60B876"
        dotColor="rgba(255,255,255,0.6)"
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginLeft: 4,
          marginRight: 4,
        }}
        activeDotStyle={{
          width: 12,
          height: 8,
          borderRadius: 4,
          marginLeft: 4,
          marginRight: 4,
        }}
        paginationStyle={tw`bottom-2`}
        containerStyle={tw`rounded-2xl overflow-hidden`}
      >
        {(ads || []).map((ad) => (
          <View
            key={ad.id}
            style={tw`flex-1 items-center justify-center w-full relative`}
          >
            <Image
              source={{ uri: ad.image }}
              style={{
                width: responsiveWidth,
                height: swiperHeight,
                resizeMode: "cover",
                borderRadius: 16,
              }}
            />
            <View style={[
              tw`absolute inset-0 rounded-2xl`,
              {
                borderWidth: 2,
                borderColor: "#60B876",
                borderRadius: 16,
                opacity: 0.2,
              }
            ]} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

export default AdsSwiper;