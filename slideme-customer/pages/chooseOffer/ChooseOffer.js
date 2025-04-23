import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { GOOGLE_MAPS_API_KEY } from "../../assets/api/api";

// Import individual components directly
import DriverMap from "../../components/ChooseOffer/DriverMap";
import DriverList from "../../components/ChooseOffer/DriverList";
import CancelModal from "../../components/ChooseOffer/CancelModal";
import DriverDetailModal from "../../components/ChooseOffer/DriverDetailModal";
import RadioSelector from "../../components/ChooseOffer/RadioSelector";

const ChooseOffer = ({ navigation, route }) => {
  const FEE = 200;
  
  // State management
  const [offers, setOffers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [radiusInMeters, setRadiusInMeters] = useState(5000);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Location state
  const [originLocation, setOriginLocation] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
  });
  
  const [destinationLocation, setDestinationLocation] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
  });

  const { userData } = useContext(UserContext);
  const { request_id } = route.params;

  // Handle request cancellation
  const handleCancelRequest = async () => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:4000/api/v1/customer/request/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({
            request_id: request_id,
            customer_id: userData.customer_id,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        navigation.navigate("HomePage");
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
        setShowCancelModal(false);
      } else {
        Alert.alert("ข้อผิดพลาด", result.message || "ยกเลิกรายการไม่สำเร็จ");
      }
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการยกเลิกรายการ");
      console.error(error);
    }
  };

  // Fetch data and start polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (!isPolling) {
        fetchData();
      }
    }, 8000); // Changed to 8 seconds for better performance
    
    return () => clearInterval(interval);
  }, [isPolling]);

  // Update filtered offers when radius or offers change
  useEffect(() => {
    if (offers.length > 0) {
      filterAndSortOffers();
    }
  }, [offers, radiusInMeters]);

  // Manual refresh function
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsPolling(false);
    fetchData().then(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 5000);
    });
  };

  // Fetch data from API
  const fetchData = async () => {
    if (isPolling) return;
    
    try {
      setIsPolling(true);
      
      // First fetch request details
      const requestResponse = await fetch(
        `http://${IP_ADDRESS}:4000/api/v1/customer/request/details?request_id=${request_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!requestResponse.ok) {
        console.error(`Server responded with status: ${requestResponse.status}`);
        setIsPolling(false);
        return;
      }

      const contentType = requestResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Server returned non-JSON response");
        setIsPolling(false);
        return;
      }

      const requestData = await requestResponse.json();
      
      if (requestData.Status) {
        // Update location data
        setOriginLocation({
          name: requestData.location_from,
          latitude: parseFloat(requestData.pickup_lat),
          longitude: parseFloat(requestData.pickup_long),
        });
        
        setDestinationLocation({
          name: requestData.location_to,
          latitude: parseFloat(requestData.dropoff_lat),
          longitude: parseFloat(requestData.dropoff_long),
        });

        // Then fetch driver offers
        try {
          const offersResponse = await axios.get(
            `http://${IP_ADDRESS}:4000/api/v1/customer/request/offers?request_id=${request_id}&customer_id=${userData.customer_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );

          const driversData = offersResponse.data.offers;
          console.log("Driver data:", driversData);
          
          // Format driver data
          const formattedDrivers = driversData.map((driver) => ({
            id: driver.driver_id,
            name: `${driver.first_name} ${driver.last_name}`,
            rating: driver.average_rating || 0,
            location: {
              latitude: driver.current_latitude,
              longitude: driver.current_longitude,
            },
            price: Number(driver.offered_price),
            customer_id_request: driver.customer_id,
            request_id: request_id,
            offer_id: driver.offer_id,
          }));
          
          if (formattedDrivers.length > 0) {
            setOffers(formattedDrivers);
            setIsLoading(false);
          }
          
        } catch (error) {
          console.error("Error fetching driver data:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsPolling(false);
    }
  };

  // Filter and sort drivers by distance
  const filterAndSortOffers = async () => {
    const filtered = offers.filter(item => {
      const distance = calculateDistance(
        originLocation.latitude,
        originLocation.longitude,
        item.location.latitude,
        item.location.longitude
      );
      return distance <= radiusInMeters;
    });
    
    // Get route distances and sort
    try {
      const driversWithRoutes = await Promise.all(
        filtered.map(async (item) => {
          try {
            const routeInfo = await getRouteDistance(item.location, originLocation);
            return {
              ...item,
              distance: routeInfo.distance || calculateDistance(
                originLocation.latitude,
                originLocation.longitude,
                item.location.latitude,
                item.location.longitude
              ),
              duration: routeInfo.duration,
              durationText: routeInfo.durationText,
            };
          } catch (error) {
            return { 
              ...item, 
              distance: calculateDistance(
                originLocation.latitude,
                originLocation.longitude,
                item.location.latitude,
                item.location.longitude
              ), 
              duration: null, 
              durationText: null 
            };
          }
        })
      );
      
      const sorted = driversWithRoutes.sort(
        (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
      );
      
      setFilteredOffers(sorted);
    } catch (error) {
      console.error("Error calculating routes:", error);
    }
  };

  // Calculate straight-line distance between coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  // Get route distance using Google Maps API
  const getRouteDistance = async (driverLocation, originLocation) => {
    const API_KEY = GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverLocation.latitude},${driverLocation.longitude}&destination=${originLocation.latitude},${originLocation.longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching route data: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.routes.length > 0) {
        const leg = data.routes[0].legs[0];
        const distance = leg.distance.value; // Distance in meters
        const duration = leg.duration.value; // Duration in seconds
        const durationText = leg.duration.text.replace(/[^\d]/g, "");

        return { distance, duration, durationText };
      } else {
        console.error("No routes found");
        // Fall back to direct distance calculation
        const distance = calculateDistance(
          driverLocation.latitude,
          driverLocation.longitude,
          originLocation.latitude,
          originLocation.longitude
        );
        const durationInSeconds = distance / 10; // Assuming 10 m/s average speed
        const durationInMinutes = Math.round(durationInSeconds / 60);
        
        return { 
          distance: distance, 
          duration: durationInSeconds,
          durationText: durationInMinutes.toString()
        };
      }
    } catch (error) {
      console.error("Error calling Directions API:", error.message);
      // Fall back to direct distance calculation
      const distance = calculateDistance(
        driverLocation.latitude,
        driverLocation.longitude,
        originLocation.latitude,
        originLocation.longitude
      );
      const durationInSeconds = distance / 10; // Assuming 10 m/s average speed
      const durationInMinutes = Math.round(durationInSeconds / 60);
      
      return { 
        distance: distance, 
        duration: durationInSeconds,
        durationText: durationInMinutes.toString()
      };
    }
  };

  // Handle driver selection
  const handleDriverSelect = (driver) => {
    if (selectedDriver && selectedDriver.id === driver.id) {
      setShowDriverModal(true);
    } else {
      setSelectedDriver(driver);
    }
  };

  // Handle driver confirmation
  const handleDriverConfirm = () => {
    navigation.navigate("payment", {
      chooseDriver: selectedDriver,
      request_id: request_id,
      offer_id: selectedDriver.offer_id,
    });
    setShowDriverModal(false);
  };

  return (
    <SafeAreaView style={[
      tw`flex-1 bg-gray-50`,
      { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
    ]}>
      <HeaderWithBackButton
        showBackButton={true}
        title="เลือกคนขับ"
        onPress={() => setShowCancelModal(true)}
      />
      
      {/* Main Container */}
      <View style={tw`flex-1`}>
        {/* Map Component - Take 55% of the screen */}
        <View style={tw`flex-1 h-3/5`}>
          <DriverMap
            originLocation={originLocation}
            destinationLocation={destinationLocation}
            drivers={filteredOffers}
            selectedDriver={selectedDriver}
            radiusInMeters={radiusInMeters}
          />
          
          {/* Floating Filter */}
          <View style={[
            tw`absolute top-3 left-3 right-3 z-10`,
            styles.floatingCard
          ]}>
            <RadioSelector
              value={radiusInMeters.toString()}
              onValueChange={(value) => setRadiusInMeters(parseInt(value, 10))}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </View>
        </View>
        
        {/* Driver List - Take remaining 45% of the screen */}
        <View style={[
          tw`bg-white rounded-t-3xl z-10 flex-1`, 
          styles.driverListContainer
        ]}>
          {/* Handle bar for drag indication */}
          <View style={tw`items-center pt-2 pb-1`}>
            <View style={tw`w-16 h-1 bg-gray-300 rounded-full`}></View>
          </View>
          
          <View style={tw`px-4 pb-2 flex-1`}>
            <DriverList
              drivers={filteredOffers}
              selectedDriver={selectedDriver}
              onDriverSelect={handleDriverSelect}
              fee={FEE}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
      
      {/* Modals */}
      <CancelModal
        visible={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleCancelRequest}
      />
      
      <DriverDetailModal
        visible={showDriverModal}
        driver={selectedDriver}
        fee={FEE}
        onCancel={() => setShowDriverModal(false)}
        onConfirm={handleDriverConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  floatingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverListContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  }
});

export default ChooseOffer;