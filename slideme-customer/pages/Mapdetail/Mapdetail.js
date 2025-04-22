import React, { useContext, useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import tw from "twrnc";
import { UserContext } from "../../UserContext";

// Components
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import SubmitButton from "../../components/SubmitButton";
import LocationSearchBar from "../../components/Mapdetail/LocationSearchBar";
import LocationDisplay from "../../components/Mapdetail/LocationDisplay";
import LocationList from "../../components/Mapdetail/LocationList";
import { locationsData } from "../../components/Mapdetail/mockData";

const { width } = Dimensions.get('window');

export default function Mapdetail({ navigation }) {
  const route = useRoute();
  const { userData } = useContext(UserContext);
  const [animatedValue] = useState(new Animated.Value(0));
  
  // Extract location data from route params or set default
  const origin = route.params?.confirmOrigin || "";
  const destination = route.params?.confirmDestination || "";
  
  // Animation effect on component mount
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Select location handler
  const handleSelectLocation = (location) => {
    // You can implement logic here to decide if this is for origin or destination
    console.log("Selected location:", location);
  };

  // Navigate to map
  const navigateToMap = () => {
    navigation.navigate("MapPage");
  };

  // Submit locations and continue to order
  const handleSubmit = () => {
    navigation.navigate("Order", {
      origin: route.params?.origin || "",
      destination: route.params?.destination || "",
      confirmOrigin: origin,
      confirmDestination: destination,
    });
  };

  const isButtonDisabled = !origin || !destination;

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 40}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <HeaderWithBackButton
        showBackButton={true}
        title="เลือกสถานที่รับ-ส่งรถ"
        onPress={() => navigation.goBack()}
      />

      <SafeAreaView style={tw`flex-1 bg-white`}>
        <Animated.View
          style={[
            tw`p-4 flex-1`,
            {
              opacity: animatedValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Search Bar Component */}
          <LocationSearchBar onPress={navigateToMap} />

          {/* Location Display Component */}
          <LocationDisplay origin={origin} destination={destination} />

          {/* Location List Component */}
          <LocationList
            locations={locationsData}
            onSelectLocation={handleSelectLocation}
          />
        </Animated.View>

        {/* Submit Button with animation */}
        <Animated.View
          style={[
            tw`px-4 pb-6 ${Platform.OS === "ios" ? "pb-8" : ""}`,
            {
              opacity: animatedValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <SubmitButton
            onPress={handleSubmit}
            title="ยืนยัน"
            disabled={isButtonDisabled}
            style={
              isButtonDisabled ? tw`bg-gray-300` : tw`bg-blue-600 shadow-md`
            }
          />
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});