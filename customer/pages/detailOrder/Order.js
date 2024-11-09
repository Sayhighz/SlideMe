import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/th";

import tw, { style } from "twrnc";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, Menu, Provider } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

dayjs.locale("th");
export default function Order({ navigation }) {
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
  const [category, setCategory] = useState("Category");
  const [menuVisible, setMenuVisible] = useState(false); // แสดงตัวเลือกรถ
  const [prepareData, setPrepareData] = useState([]);

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
    setMoreDetail(moreDetail);
    setShowModal2(false);
    console.log(moreDetail);
  };

  const confirmDate = () => {
    setShowPicker(false);
    setFormattedDate(dayjs(date).format("DD/MM/YYYY HH:mm"));
  };

  const renderIOSDatePicker = () => {
    return (
      <View>
        {showPicker && (
          <DateTimePicker
            mode="datetime"
            display="calendar"
            value={date}
            onChange={onChange}
            locale="th"
            style={tw`flex-1 text-center text-lg`}
            minimumDate={new Date()}
            maximumDate={new Date("2024-12-31")}
          />
        )}

        {showPicker && Platform.OS === "ios" && (
          <View style={[tw`flex-1 relative items-center`]}>
            <View style={[tw`flex-row gap-4`]}>
              <TouchableOpacity
                onPress={() => setDate(new Date())}
                style={[
                  tw` border border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus:ring focus:ring-blue-300 `,
                ]}
              >
                <Text style={tw`text-blue-500 text-lg font-medium text-center`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDate}
                style={[
                  tw`bg-blue-500 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300  `,
                ]}
              >
                <Text style={tw`text-white text-lg font-semibold text-center`}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
    return dayjs(rawDate).format("HH:mm"); // Format with 24 hour o-clock :>> 21.30
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

  return (
    <PaperProvider>
      <View style={tw`flex-1`}>
        <View style={tw`flex-1 items-center mt-2`}>
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Where do you want to take the Slide Car
          </Text>
          <TouchableOpacity
            style={tw` mb-4 mt-1 justify-around bg-white rounded-lg border border-gray-300 shadow-md w-80 h-25`}
            onPress={() => navigation.navigate("Mapdetail")}
          >
            <View style={tw`flex-row px-4`}>
              <MaterialIcons name="place" size={24} color="red" />
              <Text>
                ต้นทาง :{" "}
                {confirmOrigin.length > 25
                  ? confirmOrigin.slice(0, 25) + "..."
                  : confirmOrigin}
              </Text>
            </View>
            <View style={tw`flex-row px-4`}>
              <MaterialIcons name="place" size={24} color="green" />
              <Text>
                ปลายทาง :{" "}
                {confirmDestination.length > 25
                  ? confirmDestination.slice(0, 25) + "..."
                  : confirmDestination}
              </Text>
            </View>
          </TouchableOpacity>

          <View>
            <TouchableOpacity
              onPress={() =>
                Platform.OS === "ios" ? setShowPicker(true) : setShowModal(true)
              }
              style={tw`flex-col items-center justify-center bg-white p-4 rounded-lg border border-gray-300 w-11/12 shadow-md w-80 h-25`}
            >
              <MaterialIcons name="date-range" size={30} color="red" />
              <TextInput
                style={tw`flex-col items-center justify-center bg-white rounded-lg border border-gray-300 w-79  border-transparent text-xl`}
                placeholder="Booking"
                value={
                  formattedDate === ""
                    ? "Select Date"
                    : `${formattedDate} ${formattedTime}`
                }
                onPressIn={
                  Platform.OS === "ios" ? toggleDatePicker : handleDateChange
                }
                editable={false}
                underlineColor="transparent"
              />
            </TouchableOpacity>
          </View>
          {Platform.OS === "ios" && showPicker && renderIOSDatePicker()}
          {Platform.OS === "android" && renderAndroidDatePicker()}

          <View style={tw`w-full items-center mt-4`}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              mode="elevated"
              anchor={
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={tw`flex-col items-center justify-center bg-white p-4 rounded-lg border border-gray-300 w-11/12 shadow-md w-80 h-25 mb-4`}
                >
                  <FontAwesome5
                    name="car"
                    size={25}
                    color="black"
                    style={tw`mb-2`}
                  />
                  <Text style={tw`text-xl`}>{category}</Text>
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
              style={tw` justify-around bg-white rounded-lg border border-gray-300 shadow-md w-80 h-25`}
              onPress={handlePress}
            >
              <TextInput
                style={tw`flex-col items-center justify-center bg-white rounded-lg border border-gray-300 w-79  border-transparent text-xl`}
                placeholder="More Details"
                underlineColor="transparent"
                value={moreDetail}
                editable={false}
              ></TextInput>
            </TouchableOpacity>

            <Modal
              transparent={true}
              visible={showModal2}
              animationType="slide"
              onRequestClose={() => setShowModal2(false)}
            >
              <View
                style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
              >
                <View style={tw`w-80 p-4 bg-white rounded-lg `}>
                  <TextInput
                    style={tw`border p-2 mb-4 bg-white rounded-lg`}
                    placeholder="Enter details about the request..."
                    mode="outlined"
                    value={moreDetail}
                    onChangeText={setMoreDetail}
                    underlineColor="transparent"
                    multiline={true}
                    textAlignVertical="top"
                    maxLength={100}
                  />
                  <View style={tw`flex-row justify-center gap-5`}>
                    <TouchableOpacity
                      title="Close"
                      onPress={() =>
                        moreDetail ? setMoreDetail("") : setShowModal2(false)
                      }
                      style={tw`bg-red-500 rounded-lg px-4 py-2`}
                    >
                      <Text>Close</Text>
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
          <View>
            <View>
              <TouchableOpacity
                style={tw`items-center justify-center mt-4 w-70 h-12 bg-[#60B876] rounded-lg`}
                onPress={() => {
                  setPrepareData({
                    originAddress: confirmOrigin,
                    originLocation: origin,
                    destinationAddress: confirmDestination,
                    destinationLocation: destination,
                    category: category,
                    date: `${formattedDate}`,
                  });
                  navigation.navigate("ChooseOffer", prepareData);
                  console.log(prepareData);
                }}
              >
                <Text style={tw`text-white text-lg font-semibold`}>Next</Text>
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

  optionText: { marginLeft: 10, fontSize: 16 },
});
