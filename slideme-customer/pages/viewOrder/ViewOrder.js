import {
  SafeAreaView,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import tw from "twrnc";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { IP_ADDRESS } from "../../config";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { UserContext } from "../../UserContext";

// Import components
import OrderHeader from "../../components/viewOrder/OrderHeader";
import OrderDetailsCard from "../../components/viewOrder/OrderDetailsCard";
import OrderMap from "../../components/viewOrder/OrderMap";
import RideProgressBar from "../../components/viewOrder/RideProgressBar";
import ActionButtons from "../../components/viewOrder/ActionButtons";

export default function ViewOrder({ navigation }) {
  const styles = StyleSheet.create({
    globalText: {
      fontFamily: Platform.OS === "android" ? "Roboto" : "Mitr-Regular",
    },
    container: {
      flex: 1,
      backgroundColor: "#f9fafb",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    contentContainer: {
      flexGrow: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    shadow: {
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
  });

  const route = useRoute();
  const { userData } = useContext(UserContext);

  // States
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [driverInformation, setDriverInformation] = useState({});
  const [driverLocation, setDriverLocation] = useState({});
  const [confirmFromDriver, setConfirmFromDriver] = useState(false);
  const [time, setTime] = useState("");
  const [request, setRequest] = useState("");
  const [status, setStatus] = useState(null);
  const [alertComfirm, setAlertConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get params from route
  const driver_id = route.params?.driverProfile.chooseDriver?.id || "ไม่ระบุ";
  const customer_id_request =
    route.params?.driverProfile.chooseDriver?.customer_id_request || "ไม่ระบุ";
  const request_id =
    route.params?.driverProfile.chooseDriver?.request_id || "ไม่ระบุ";

  // Helper functions
  const formatDateToThaiTimezone = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("th-TH", options).format(date);
  };

  const padNumber = (number, length) => {
    return number.toString().padStart(length, "0");
  };

  // API functions
  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:4000/api/v1/customer/request/details?request_id=${request_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.data.Status) {
        const data = response.data;
        setOrigin({
          name: data.location_from,
          latitude: parseFloat(data.pickup_lat),
          longitude: parseFloat(data.pickup_long),
        });

        setDestination({
          name: data.location_to,
          latitude: parseFloat(data.dropoff_lat),
          longitude: parseFloat(data.dropoff_long),
        });

        setDriverInformation({
          name: data.driver_first_name + " " + data.driver_last_name,
          latitude: data.driver_current_lat,
          longitude: data.driver_current_lng,
          phone: data.driver_phone,
          rating: Number(data.average_rating).toFixed(1),
        });

        setTime(formatDateToThaiTimezone(data.booking_time));
        setRequest(padNumber(data.request_id, 10));
        
        // Get driver location after fetching details
        await getDriverLocation();
        setIsLoading(false);
      } else {
        console.error("No matching data found");
        setError("ไม่พบข้อมูลคำขอ");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียดคำขอ");
      setIsLoading(false);
    }
  };

  const checkOrderStatus = async () => {
    console.log(request_id);
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:4000/api/v1/customer/address/check-status/${request_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      console.log(response)
      if (response.data.Status) {
        setStatus(response.data.StatusOrder);

        if (response.data.StatusOrder === "delivery_in_progress" || response.data.StatusOrder === "pickup_in_progress") {
          setConfirmFromDriver(true);
        }

        if (response.data.StatusOrder === "completed" && !alertComfirm) {
          setAlertConfirm(true);
          Alert.alert(
            "รถของคุณได้ถึงปลายทางแล้ว",
            "ขอบคุณที่ใช้บริการ",
            [
              {
                text: "ให้คะแนน",
                onPress: () => {
                  navigation.navigate("Rating", {
                    requestId: request_id,
                    driver_id: driver_id,
                    customer_id_request: customer_id_request,
                  });
                },
              },
            ],
            { cancelable: false }
          );
        }
      } else {
        console.error("No status found for the given request_id.");
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  const getDriverLocation = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:4000/api/v1/driver/location/${driver_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      
      if (response.data.Status) {
        setDriverLocation({
          latitude: response.data.latitude,
          longitude: response.data.longitude,
        });
      } else {
        console.error("Failed to fetch driver location");
      }
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

  // Effect hooks for data fetching and intervals
  useEffect(() => {
    fetchOrderDetails();
    checkOrderStatus();

    // Hide tab bar when this screen is focused
    // navigation.getParent()?.setOptions({
    //   tabBarStyle: { display: 'none' }
    // });

    // // Restore tab bar when leaving this screen
    // return () => {
    //   navigation.getParent()?.setOptions({
    //     tabBarStyle: undefined
    //   });
    // };
  }, []);

  useEffect(() => {
    let statusInterval = setInterval(() => {
      checkOrderStatus();
    }, 10000);

    if (status === "completed") {
      clearInterval(statusInterval);
    }

    return () => clearInterval(statusInterval);
  }, [status]);

  useEffect(() => {
    let locationInterval;
    
    if (status === "accepted" || status === "delivery_in_progress") {
      locationInterval = setInterval(() => {
        getDriverLocation();
      }, 10000);
    }
    
    if (status === "completed") {
      clearInterval(locationInterval);
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval);
    };
  }, [status]);

  // Event handlers
  const handleChat = () => {
    navigation.navigate("ChatScreen", {
      room_id: request_id,
      user_name: driverInformation.name,
      phoneNumber: driverInformation.phone,
    });
  };

  const handleBackNavigation = () => {
    navigation.navigate("HomePage");
  };

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton
          showBackButton={true}
          title="รายละเอียดการเดินทาง"
          onPress={handleBackNavigation}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton
          showBackButton={true}
          title="รายละเอียดการเดินทาง"
          onPress={handleBackNavigation}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.globalText, tw`text-red-500 text-lg`]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton
        showBackButton={true}
        title="รายละเอียดการเดินทาง"
        onPress={handleBackNavigation}
      />
      
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={styles.contentContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <OrderHeader time={time} requestId={request} styles={styles} />
        
        <OrderDetailsCard
          driverInformation={driverInformation}
          origin={origin}
          destination={destination}
          styles={styles}
        />
        
        <View style={[tw`mx-4 rounded-xl overflow-hidden h-64`, styles.shadow]}>
          <OrderMap
            origin={origin}
            destination={destination}
            driverLocation={driverLocation}
            driverInformation={driverInformation}
            confirmFromDriver={confirmFromDriver}
          />
        </View>
        
        <RideProgressBar status={status} styles={styles} />
      </ScrollView>
      
      <ActionButtons
        driverInformation={driverInformation}
        handleChat={handleChat}
        styles={styles}
      />
    </SafeAreaView>
  );
}