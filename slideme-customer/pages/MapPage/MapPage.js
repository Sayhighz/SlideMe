import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import * as Location from "expo-location";
import tw from "twrnc";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

// Context
import { UserContext } from "../../UserContext";

// API
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

// Components
import Map from "../../components/maps/Map";
import SearchBar from "../../components/maps/SearchBar";
import AddressDisplay from "../../components/maps/AddressDisplay";
import ConfirmationModal from "../../components/maps/ConfirmationModal";
import SubmitButton from "../../components/SubmitButton";

const MapPage = ({ navigation }) => {
  const route = useRoute();
  const { userData } = useContext(UserContext);

  // Location states
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [confirmOrigin, setConfirmOrigin] = useState([]);
  const [confirmDestination, setConfirmDestination] = useState([]);
  
  // UI states
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get address from coordinates using Google Maps Geocoding API
  const getAddressFromCoords = async (latitude, longitude) => {
    if (!latitude || !longitude) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=th&key=${GOOGLE_MAPS_API_KEY}`
      );
  
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;

        if (!confirmOrigin.length) {
          setOriginAddress(address);
        } else if (!confirmDestination.length) {
          setDestinationAddress(address);
        }
      }
    } catch (error) {
      console.error("Failed to get address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation of locations and navigation to next screen
  const handleConfirm = () => {
    navigation.navigate("Mapdetail", {
      origin,
      destination,
      confirmOrigin,
      confirmDestination,
    });
    setOpenModal(false);
  };

  // Modal confirmation handler
  const handleModalConfirm = () => {
    if (confirmOrigin.length) {
      setConfirmDestination(destinationAddress);
    } else {
      setConfirmOrigin(originAddress);
      setOpenModal(false);
    }
  };

  // Handle location selection
  const handleSelectLocation = (coords) => {
    if (confirmOrigin.length) {
      setDestination(coords);
    } else {
      setOrigin(coords);
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    if (confirmOrigin.length) {
      setConfirmOrigin([]);
      setConfirmDestination([]);
      setDestination({});
    } else {
      navigation.goBack();
    }
  };

  // Update address when coordinates change
  useEffect(() => {
    if (origin.latitude && origin.longitude) {
      getAddressFromCoords(origin.latitude, origin.longitude);
    }
  }, [origin]);

  useEffect(() => {
    if (destination.latitude && destination.longitude) {
      getAddressFromCoords(destination.latitude, destination.longitude);
    }
  }, [destination]);

  // Navigate to next screen when destination is confirmed
  useEffect(() => {
    if (confirmDestination.length > 0) {
      handleConfirm();
    }
  }, [confirmDestination]);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Confirmation Modal */}
        <ConfirmationModal
          visible={openModal}
          onCancel={() => setOpenModal(false)}
          onConfirm={handleModalConfirm}
          address={confirmOrigin.length ? destinationAddress : originAddress}
          isOrigin={!confirmOrigin.length}
        />

        {/* Map Section */}
        <View style={tw`flex-3 relative`}>
          <Map
            setDestination={setDestination}
            setOrigin={setOrigin}
            origin={origin}
            destination={destination}
            confirmOrigin={confirmOrigin}
            confirmDestination={confirmDestination}
          />

          {/* Search Bar */}
          <View style={tw`w-full absolute top-2 flex items-center z-20`}>
            <SearchBar
              placeholder={confirmOrigin.length ? "ปลายทาง" : "ต้นทาง"}
              onBackPress={handleBackPress}
              onLocationSelect={handleSelectLocation}
              apiKey={GOOGLE_MAPS_API_KEY}
              hasConfirmedOrigin={confirmOrigin.length > 0}
            />
          </View>
        </View>

        {/* Address Information Section */}
        <View style={tw`absolute bottom-25 left-0 right-0`}>
        <View style={tw`flex-1 bg-white p-5 rounded-t-3xl shadow-lg flex items-baseline`}>
          <AddressDisplay
            title={confirmOrigin.length ? "จุดส่งรถ" : "จุดรับรถ"}
            address={confirmOrigin.length ? destinationAddress : originAddress}
          />
        </View>
          
        </View>
          <View style={tw`flex-1 justify-end items-center`}>
            <SubmitButton
              onPress={() => setOpenModal(true)}
              title={`ยืนยัน${confirmOrigin.length ? "จุดส่งรถ" : "จุดรับรถ"}`}
              disabled={confirmOrigin.length ? !destination.latitude : !origin.latitude}
              loading={isLoading}
              style={tw`${(confirmOrigin.length ? !destination.latitude : !origin.latitude) ? 'bg-gray-400' : ''}`}
            />
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});

export default MapPage;