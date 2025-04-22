import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import tw from "twrnc";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { UserContext } from "../../UserContext";
import SubmitButton from "../../components/SubmitButton";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

// Import custom components
import LocationPicker from "../../components/order/LocationPicker";
import DateTimePickerComponent from "../../components/order/DateTimePicker";
import VehicleTypeSelector from "../../components/order/VehicleTypeSelector";
import MessageInput from "../../components/order/MessageInput";

// Import utils and API functions
import {
  formatDate,
  formatTime,
  formatDateToMySQL,
} from "../../components/order/utils";
import {
  fetchVehicleTypes,
  fetchBookmarks,
  submitRequest,
  submitRequestFromBookmark,
} from "../../components/order/api";

dayjs.locale("th");

export default function Order({ navigation }) {
  // State variables
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [moreDetail, setMoreDetail] = useState("");
  const [preMoreDetail, setPreMoreDetail] = useState("");
  const [category, setCategory] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get user context data
  const { userData } = useContext(UserContext);
  const userId = userData?.customer_id || null;
  const token = userData?.token || null;

  // Get route params
  const route = useRoute();
  const origin = route.params?.origin || null;
  const destination = route.params?.destination || null;
  const confirmOrigin = route.params?.confirmOrigin || "";
  const confirmDestination = route.params?.confirmDestination || "";

  // Fetch vehicle types on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const types = await fetchVehicleTypes();
        setVehicleTypes(types);
      } catch (error) {
        console.error("Error loading initial data:", error);
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลประเภทรถได้");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handler functions
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(formatDate(selectedDate));
      setFormattedTime(formatTime(selectedDate));
    }
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const confirmDate = () => {
    setShowPicker(false);
    const formattedDate = dayjs(date)
      .add(543, "year")
      .format(`DD/MM/YYYY HH:mm`);
    setFormattedDate(formattedDate);
  };

  const selectCategory = (categoryId, categoryName) => {
    const categoryInfo = `${categoryId} - ${categoryName}`;
    setCategory(categoryInfo);
    setMenuVisible(false);
  };

  const handleRequestSubmit = () => {
    setMoreDetail(preMoreDetail);
    setShowModal2(false);
  };

  const handleSubmitRequest = async () => {
    // Validation
    if (!origin || !destination || !category) {
      Alert.alert(
        "กรุณากรอกข้อมูลให้ครบถ้วน",
        "โปรดระบุต้นทาง ปลายทาง และประเภทรถ"
      );
      return;
    }

    setIsLoading(true);

    // Construct the request data object
    const requestData = {
      customer_id: userId,
      request_time: formatDateToMySQL(new Date()),
      pickup_lat: origin.latitude,
      pickup_long: origin.longitude,
      location_from: confirmOrigin,
      dropoff_lat: destination.latitude,
      dropoff_long: destination.longitude,
      location_to: confirmDestination,
      vehicletype_id: category.split(" - ")[0],
      booking_time: formattedDate
        ? formatDateToMySQL(date)
        : formatDateToMySQL(new Date()),
      customer_message: moreDetail || null,
    };

    try {
      const responseData = await submitRequest(requestData, token);

      if (responseData && responseData.request_id) {
        Alert.alert(
          "คุณได้ส่งคําร้องเรียบร้อยแล้ว",
          "",
          [
            {
              text: "ตกลง",
              onPress: () => {
                navigation.navigate("ChooseOffer", {
                  request_id: responseData.request_id,
                  customer_id_request: responseData.customer_id,
                });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("คำร้องส่งไม่สําเร็จ", "กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถส่งคำขอได้ โปรดลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider>
      <ScrollView>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            backgroundColor="#FFFFFF"
            barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
          />
          <View style={[styles.container, tw`flex-1`]}>
            <HeaderWithBackButton
              showBackButton={true}
              title="กรอกข้อมูลการให้บริการ"
              onPress={() => navigation.goBack()}
            />

            <View style={tw`flex-1 w-full items-center px-4 pt-2`}>
              <Text style={[styles.labelText, tw`self-start ml-2 mb-1`]}>
                คุณต้องการให้ไปส่งที่ไหน?
              </Text>

              {/* Location Picker Component */}
              <LocationPicker
                confirmOrigin={confirmOrigin}
                confirmDestination={confirmDestination}
                onPress={() => navigation.navigate("Mapdetail")}
              />

              {/* Vehicle Type Selector Component */}
              <VehicleTypeSelector
                category={category}
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                vehicleTypes={vehicleTypes}
                selectCategory={selectCategory}
                isLoading={isLoading}
              />

              {/* Date/Time Picker Component */}
              <DateTimePickerComponent
                formattedDate={formattedDate}
                date={date}
                setDate={setDate}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                showModal={showModal}
                setShowModal={setShowModal}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                showTimePicker={showTimePicker}
                setShowTimePicker={setShowTimePicker}
                formattedTime={formattedTime}
                handleDateChange={handleDateChange}
                confirmDate={confirmDate}
              />

              {/* Message Input Component */}
              <MessageInput
                moreDetail={moreDetail}
                showModal2={showModal2}
                setShowModal2={setShowModal2}
                preMoreDetail={preMoreDetail}
                setPreMoreDetail={setPreMoreDetail}
                handleRequestSubmit={handleRequestSubmit}
              />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <SubmitButton
        onPress={handleSubmitRequest}
        title="ยืนยัน"
        disabled={isLoading}
        isLoading={isLoading}
      />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  labelText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: "#6B7280",
  },
});
