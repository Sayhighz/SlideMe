import React, { useContext, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
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

export default function Mapdetail({ navigation }) {
  const route = useRoute();
  const { userData } = useContext(UserContext);
  
  // Extract location data from route params or set default
  const origin = route.params?.confirmOrigin || "";
  const destination = route.params?.confirmDestination || "";
  
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

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar
        barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"}
        backgroundColor={Platform.OS === 'ios' ? "white" : "#0066CC"}
      />
      
      <HeaderWithBackButton
        showBackButton={true}
        title="เลือกสถานที่รับ-ส่งรถ"
        onPress={() => navigation.goBack()}
      />
      
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View style={tw`p-4 flex-1`}>
          {/* Search Bar Component */}
          <LocationSearchBar onPress={navigateToMap} />
          
          {/* Location Display Component */}
          <LocationDisplay origin={origin} destination={destination} />
          
          {/* Location List Component */}
          <LocationList
            locations={locationsData}
            onSelectLocation={handleSelectLocation}
          />
        </View>
        
        {/* Submit Button */}
        <View style={tw`px-4 pb-6 ${Platform.OS === 'ios' ? 'pb-8' : ''}`}>
          <SubmitButton
            onPress={handleSubmit}
            title="ยืนยัน"
            disabled={!origin || !destination}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});