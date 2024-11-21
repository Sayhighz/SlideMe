import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/th";

import tw, { style } from "twrnc";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, Menu, Provider } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import { IP_ADDRESS } from "../../config";
import { ScrollView } from "react-native-gesture-handler";

dayjs.locale("th");
export default function Order({ navigation , bookmark}) {


  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [showPicker, setShowPicker] = useState(false); // แสดงหน้าตัวเลือกวันที่
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [moreDetail, setMoreDetail] = useState("");
  const [preMoreDetail, setPreMoreDetail] = useState("");
  const [category, setCategory] = useState("");
  const [menuVisible, setMenuVisible] = useState(false); // แสดงตัวเลือกรถ
  const [modalVisible, setModalVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;
  const responsiveHeight = height * 0.2;
  const userId = 1;

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/customer/getuserbookmarks?user_id=${userId}`
      );
      const data = await response.json();
      if (data.Status) {
        setBookmarks(data.Result);
      } else {
        console.error(data.Error);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error.message);
    }
    setLoading(false);
  };


  
    const handleRequestFromBookmark = async (selectedBookmark) => {
      // Prepare the request payload using bookmark data

      if (!confirmOrigin) {
        alert("Pickup location is missing. Please select a pickup location.");
        return;
      }

      const requestData = {
        customer_id: selectedBookmark.customer_id || 1, // Use the customer ID from the bookmark
        request_time: formatDateToMySQL(new Date()), // Current time
        pickup_lat: selectedBookmark.pickup_lat, // Extract from bookmark
        pickup_long: selectedBookmark.pickup_long, // Extract from bookmark
        location_from: selectedBookmark.location_from, // Extract from bookmark
        dropoff_lat: selectedBookmark.dropoff_lat, // Extract from bookmark
        dropoff_long: selectedBookmark.dropoff_long, // Extract from bookmark
        location_to: selectedBookmark.location_to, // Extract from bookmark
        vahicle_type: selectedBookmark.vahicle_type, // Extract from bookmark
        booking_time: formatDateToMySQL(new Date()), // Assuming immediate booking
        customer_message: null, // Optional field
      };
  
      console.log("Request data:", bookmark);

      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/auth/add_request`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log("Response data:", responseData);
  
        if (responseData && responseData.request_id) {
          Alert.alert(
            "Request submitted successfully!",
            "",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("ChooseOffer", {
                    request_id: responseData.request_id,

                  } , setModalVisible(false));
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          alert("Request submitted, but no request ID was returned.");
        }
      } catch (error) {
        console.error("Error submitting request:", error);
        alert("Failed to submit the request. Please try again.");
      }
    };
  

  const openModal = () => {
    setModalVisible(true);
    fetchBookmarks();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(dayjs(selectedDate).format("DD/MM/YYYY HH:mm"));
    }
  };

  const handlePress = () => {
    setShowModal2(true);
  };

  const handleRequestSubmit = () => {
    setMoreDetail(preMoreDetail);
    setShowModal2(false);
    console.log(moreDetail);
  };

  const confirmDate = () => {
    setShowPicker(false);
    setFormattedDate(dayjs(date).format("DD/MM/YYYY HH:mm"));
  };

  const renderIOSDatePicker = () => {
    const { width } = Dimensions.get("window");
    const buttonWidth = width * 0.35;
    const responsiveHeight = height * 0.2;

    return (
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)} // Close modal when requested
      >
        <View
          style={[
            { height: height * 0.5 },
            tw`flex-1 justify-center items-center bg-[rgba(0,0,0,0.90)] `,
          ]}
        >
          <View
            style={[
              tw`flex p-4 rounded-lg `,
              { maxWidth: width * 0.9, height: height * 0.7 },
            ]}
          >
            {/* DateTimePicker */}
            <View
              style={[
                { height: responsiveHeight },
                tw`flex-row justify-center items-center`,
              ]}
            >
              <DateTimePicker
                mode="datetime"
                display="calendar"
                value={date}
                onChange={onChange}
                locale="th"
                style={[{ height: responsiveHeight }, tw`text-white`]}
                minimumDate={new Date()}
                maximumDate={new Date("2024-12-31")}
                textColor="white"
              />
            </View>

            {/* Buttons */}

            <View style={[tw`flex-row mt-4 gap-4 `]}>
              <TouchableOpacity
                onPress={() => {
                  setDate(new Date());
                }}
                style={[
                  tw`items-center top-80 border border-blue-500 py-2 rounded-full bg-white`,
                  { width: buttonWidth },
                ]}
              >
                <Text style={tw`text-blue-500 text-lg font-medium text-center`}>
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDate}
                style={[
                  tw`items-center top-80 bg-blue-500 py-2 rounded-full`,
                  { width: buttonWidth },
                ]}
              >
                <Text style={tw`text-white text-lg font-semibold text-center`}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const renderAndroidDatePicker = () => {
    return (
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View
          style={tw`flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]`}
        >
          <View style={tw`w-75 p-5 bg-white rounded-lg`}>
            <Text style={tw`text-center text-lg font-semibold mb-4`}>
              Select Date and Time
            </Text>

            {/* Button to Open Date Picker */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                onPressIn={() => setShowDatePicker(true)}
                style={tw`p-2 mb-4 bg-blue-500 rounded-lg text-center`}
                placeholder="Select Date"
                value={formattedDate}
                onChangeText={date}
                editable={false}
                underlineColor="transparent"
              />
            </TouchableOpacity>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="calendar"
                onChange={handleDateChange}
                minimumDate={new Date()} // Restricts selection to dates after this
                maximumDate={new Date("2024-12-31")} // Restricts selection to dates before this
              />
            )}

            {/* Button to Open Time Picker */}
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <TextInput
                onPressIn={() => setShowTimePicker(true)}
                style={tw`p-2 mb-4 bg-green-500 rounded-lg text-center`}
                placeholder="Select Time"
                value={formattedTime}
                onChangeText={time}
                editable={false}
                underlineColor="transparent"
              />
            </TouchableOpacity>

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="clock"
                onChange={handleDateChange}
              />
            )}

            {/* Button to Close Modal */}
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={tw`mt-4 p-2 bg-red-500 rounded-lg`}
            >
              <Text style={tw`text-white text-center`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(formatDate(selectedDate));
      setFormattedTime(formatTime(selectedDate));
      console.log(date);
    }
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const route = useRoute();
  const origin = route.params?.origin || "ไม่ระบุ";
  const destination = route.params?.destination || "ไม่ระบุ";
  const confirmOrigin = route.params?.confirmOrigin || "ไม่ระบุ";
  const confirmDestination = route.params?.confirmDestination || "ไม่ระบุ";

  const formatDate = (rawDate) => {
    //     let date = new Date(rawDate);

    //     let year = date.getFullYear();
    //     let month = date.getMonth() + 1;
    //     let day = date.getDate();

    //     month = month < 10 ? "0" + month : month;
    //     day = day < 10 ? "0" + day : day;
    //     return `${day}-${month}-${year}`;
    let date = dayjs(rawDate);
    let thaiYear = date.year() + 543;
    return date.format(`D MMMM ${thaiYear}`);
  };

  const formatTime = (rawDate) => {
    return dayjs(rawDate).format("HH:mm");
  };

  const categoryOptions = [
    { label: "Mini Slide Car", value: "mini" },
    { label: "Standard Slide Car", value: "standard" },
    { label: "Heavy Duty Slide Car", value: "heavy" },
    { label: "Special Slide Car", value: "special" },
  ];

  const selectCategory = (label) => {
    setCategory(label);
    setMenuVisible(false); // Close the menu after selecting a category
  };

  const formatDateToMySQL = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const handleSubmitRequest = async () => {
    // Validation logic
    if (!confirmOrigin || !confirmDestination || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!origin || !destination || !category) {
      alert(
        "Please fill in all mandatory fields: Pickup Location, Dropoff Location, and Vehicle Type."
      );
      return;
    }

    // Construct the request data object
    const requestData = {
      customer_id: 1, // Replace with the appropriate customer ID
      request_time: formatDateToMySQL(new Date()), // Replace with actual selection
      pickup_lat: origin.latitude, // Replace with actual latitude
      pickup_long: origin.longitude, // Replace with actual longitude
      location_from: confirmOrigin,
      dropoff_lat: destination.latitude, // Replace with actual latitude
      dropoff_long: destination.longitude, // Replace with actual longitude
      location_to: confirmDestination,
      vehicle_type: category,
      booking_time: formattedDate
        ? formatDateToMySQL(date)
        : formatDateToMySQL(new Date()), // Assuming formattedDate is used for booking time
      customer_message: moreDetail || null, // Include the optional field if provided
    };

    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/add_request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (responseData && responseData.request_id) {
        Alert.alert(
          "Request submitted successfully!",
          "",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("ChooseOffer", {
                  request_id: responseData.request_id,
                });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        alert("Request submitted, but no request ID was returned.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit the request. Please try again.");
    }
  };

  const truncateText = (text, maxLength = 22) => {
    if (!text) return "N/A"; // Return default if text is null/undefined
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <PaperProvider>
      <View style={tw`flex-1 items-center`}>

        <View style={tw`flex-1 mt-2`}>
          {/* Subtitle */}
           
          <Text style={[styles.globalText, tw`text-[grey]`]}>
            ต้องการให้รถสไลด์ไปส่งที่ไหน​ ?
          </Text>
          <TouchableOpacity
            style={[
              { width: responsiveWidth, height: height * 0.11 },
              tw`p-2 mb-4 mt-1 justify-around bg-white rounded-lg border border-[#60B876] shadow-xl shadow-[#60B876]`,
            ]}
            onPress={() => navigation.navigate("Mapdetail")}
          >
            <View style={[tw`flex-row px-4`]}>
              <MaterialIcons name="place" size={24} color="red" />
              <Text style={styles.globalText}>
                ต้นทาง :{" "}
                {confirmOrigin.length > 25
                  ? confirmOrigin.slice(0, 25) + "..."
                  : confirmOrigin}
              </Text>
            </View>
            <View style={tw`flex-row px-4`}>
              <MaterialIcons name="place" size={24} color="green" />
              <Text style={styles.globalText}>
                ปลายทาง :{" "}
                {confirmDestination.length > 25
                  ? confirmDestination.slice(0, 25) + "..."
                  : confirmDestination}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={tw`flex items-center justify-center`}>
            <TouchableOpacity
              onPress={() =>
                Platform.OS === "ios" ? setShowPicker(true) : setShowModal(true)
              }
              style={[
                { width: responsiveWidth, height: height * 0.13 },
                tw`flex items-center justify-center bg-white p-4 rounded-lg border border-[#60B876]  shadow-xl shadow-[#60B876]`,
              ]}
            >
              <MaterialIcons name="date-range" size={35} color="red" />
              <Text
                style={[
                  styles.globalText,
                  tw`flex text-center bg-white p-2 border-[#60B876] w-79  text-lg`,
                ]}
                // onPressIn={
                //   Platform.OS === "ios" ? toggleDatePicker : handleDateChange
                // }
              >
                {formattedDate === ""
                  ? "เลือกวันเวลาที่ต้องการ"
                  : `${formattedDate} ${formattedTime}`}
              </Text>
            </TouchableOpacity>
          </View>
          {Platform.OS === "ios" && showPicker && renderIOSDatePicker()}
          {Platform.OS === "android" && renderAndroidDatePicker()}

          <View style={[tw`w-full items-center mt-4`]}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              mode="elevated"
              anchor={
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={[
                    { width: responsiveWidth, height: height * 0.13 },
                    tw`flex-col items-center justify-center bg-white p-4 rounded-lg border border-[#60B876] shadow-xl shadow-[#60B876] mb-4`,
                  ]}
                >
                  <FontAwesome5
                    name="car"
                    size={30}
                    color="black"
                    style={tw`mb-2`}
                  />
                  <Text style={[styles.globalText, tw`text-lg`]}>
                    {category ?  category : "ประเภทของรถสไลด์"}
                  </Text>
                </TouchableOpacity>
              }
              style={tw`w-70 rounded items-center`}
            >
              {categoryOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => selectCategory(option.label)}
                  title={option.label}
                  style={tw`bg-white`}
                />
              ))}
            </Menu>
          </View>

          <View>
            <TouchableOpacity
              style={[
                { width: responsiveWidth, height: height * 0.14 },
                tw` justify-around bg-white rounded-lg border border-[#60B876] shadow-xl shadow-[#60B876] p-1`,
              ]}
              onPress={handlePress}
            >
              <Text
                style={[styles.globalText, tw` bg-white text-center text-lg`]}
              >
                {moreDetail ? moreDetail : "รายละเอียดเพิ่มเติม . . ."}
              </Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              visible={showModal2}
              animationType="slide"
              onRequestClose={() => setShowModal2(false)}
            >
              <View
                style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 `}
              >
                <View style={tw`w-80 p-4 bg-white rounded-lg `}>
                  <TextInput
                    style={[
                      styles.globalText,
                      tw`border p-2 mb-4 bg-white rounded-lg h-40`,
                    ]}
                    placeholder="รายละเอียดเพิ่มเติม . . ."
                    mode="outlined"
                    value={preMoreDetail}
                    onChangeText={setPreMoreDetail}
                    underlineColor="transparent"
                    multiline={true}
                    textAlignVertical="top"
                    maxLength={255}
                  />
                  <View style={tw`flex-row justify-center gap-5`}>
                    <TouchableOpacity
                      title="Close"
                      onPress={() =>
                        preMoreDetail
                          ? setPreMoreDetail("")
                          : setShowModal2(false)
                      }
                      style={tw`bg-red-500 rounded-lg px-4 py-2`}
                    >
                      <Text>{preMoreDetail ? "Clear" : "Close"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      title="Submit"
                      onPress={handleRequestSubmit}
                      style={tw`bg-[#60B876] rounded-lg px-4 py-2`}
                    >
                      <Text>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <View style={tw`flex items-center mt-3 justify-between`}>
            <TouchableOpacity
              onPress={openModal}
              style={[
                { height: height * 0.07, width: responsiveWidth },
                tw` justify-around bg-white rounded-lg border border-[#60B876] shadow-xl shadow-[#60B876] p-1 `,
              ]}
            >
              <Text
                style={[styles.globalText, tw` bg-white text-center text-lg`]}
              >
                เลือกที่อยู่ในรายการโปรด
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)} // Close modal on back press
          >
            
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContent,
                  tw`rounded-lg `,
                  { height: height * 0.7 },
                ]}
              >
                <View style={tw`flex bg-white rounded-lg border border-[#60B876] p-4 w-7/12 shadow-2xl bg-[#60B876]`}>

                <Text
                  style={[styles.modalText, styles.globalText, tw`text-xl font-bold  text-center text-white items-center`]}
                >
                  รายการโปรด
                </Text>
                </View>
                {loading ? (
                  <Text style={[styles.globalText , tw`text-center`]}>ไม่พบข้อมูล</Text>
                ) : (
                  
                  <FlatList
                    data={bookmarks}
                    keyExtractor={(item) => item.address_id.toString()}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          styles.bookmarkItem,
                          tw`flex items-center justify-between mt-3 p-2 border border-[#60B876] rounded-lg `,
                          { width: width * 0.69 },
                        ]}
                      >
                        <TouchableOpacity
                          style={tw`flex  justify-between`}
                          // onPress={() =>
                          //   console.log(
                          //     item.address_id,
                          //     item.save_name,
                          //     item.vahicle_type,
                          //     item.location_from,
                          //     item.location_to
                          //   )
                          // }
                          onPress={() => handleRequestFromBookmark(item) }
                        >
                          <View style={tw``}>
                            <Text
                              style={[tw`text-base font-semibold text-center `, styles.globalText]}
                            >
                              {item.save_name}
                            </Text>
                            <View style={tw`flex-row items-center`}>
                              <Text
                                style={[
                                  styles.globalText,
                                  tw`text-sm font-semibold`,
                                ]}
                              >
                                Category :
                              </Text>
                              <Text style={[styles.globalText, tw`text-gray-500`]}>
                                {truncateText(item.vahicle_type)}
                              </Text>
                            </View>
                            <View style={tw`flex-row items-center`}>
                              <Text
                                style={[
                                  styles.globalText,
                                  tw`text-sm font-semibold`,
                                ]}
                              >
                                ต้นทาง :
                              </Text>
                              <Text style={[styles.globalText, tw`text-gray-500`]}>
                                {truncateText(item.location_from)}
                              </Text>
                            </View>
                            <View style={tw`flex-row items-center`}>
                              <Text
                                style={[
                                  styles.globalText,
                                  tw`text-sm font-semibold`,
                                ]}
                              >
                                ปลายทาง :
                              </Text>
                              <Text style={[styles.globalText, tw`text-gray-500`]}>
                                {truncateText(item.location_to)}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    />
                    
                )}
                <TouchableOpacity
                  onPress={closeModal}
                  style={[
                    styles.closeButton,
                    tw`bg-red-400 rounded-lg p-3 mt-4`,
                  ]}
                >
                  <Text style={styles.closeButtonText}>Close Modal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={tw``}>
            <View style={tw`flex items-center justify-center`}>
              <TouchableOpacity
                style={tw`items-center justify-center mt-4 w-50 h-12 bg-[#60B876] rounded-full `}
                // onPress={handleSubmitRequest}
                onPress={handleSubmitRequest}
              >
                <Text
                  style={[
                    styles.globalText,
                    tw`text-white text-xl font-semibold `,
                  ]}
                >
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </View>
      
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 4, backgroundColor: "#F2FFF3" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: "bold", marginLeft: 10 },
  subtitle: { fontSize: 14, color: "gray" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  datePicker: {
    height: 40,
    flex: 1,
  },
  globalText: {
    fontFamily: "Mitr-Regular",
  },

  optionText: { marginLeft: 10, fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: "center",
  },
  closeButton: {
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
