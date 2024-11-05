import React, { useState , useEffect } from "react";
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
import { TextInput , Menu, Provider} from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";

dayjs.locale("th");
export default function Order({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false); // แสดงหน้าตัวเลือกวันที่
  const [category, setCategory] = useState("Category");
  const [menuVisible, setMenuVisible] = useState(false); // แสดงตัวเลือกรถ

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
  

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDate(currentDate);
      }
    } else {
      toggleDatePicker();
    }
    // setShowPicker(Platform.OS === "ios");
    // if (date) {
    //     setSelectedDate(date);
    // }
    // setShowPicker(false);
    // if (Platform.OS === "ios") {
    //     closeCalendar();
    // }
  };
  const confirmDate = () => {
      setDate(date);
      toggleDatePicker();
  }

  
  
  // const currentDate = date || selectedDate;
  // if (Platform.OS === "android");
  // setShowPicker(false);
  // setSelectedDate(currentDate);
  // closeCalendar();

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
    return date.format(`D MMMM ${thaiYear}`)}

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

    <Provider>

    <View style={tw`flex-1 `}>
{/*       
      <View style={tw`flex-row items-center `}>
        <Text style={styles.headerTitle}></Text>
      </View> */}

      {/* Location Search */}
      {/* <TouchableOpacity onPress={() => navigation.navigate("Mapdetail")}>
        <View style={styles.searchBar}>
          <MaterialIcons name="place" size={24} color="red" />
          <Text style={styles.nowText}>Now</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="black" />
        </View>
      </TouchableOpacity> */}

      <View style={tw`flex-1 items-center`}>
              {/* Subtitle */}
        <Text style={styles.subtitle}>
          Where do you want to take the Slide Car
        </Text>
        <TouchableOpacity 
          style={tw` mb-4 mt-1 justify-around bg-white rounded-lg border border-gray-300 shadow-md w-70 h-25`}
          onPress={() => navigation.navigate("Mapdetail")}
        >
          <View style={tw`flex-row px-4`}>
            <MaterialIcons name="place" size={24} color="red" />
            <Text>ต้นทาง : {confirmOrigin.length > 25 ? confirmOrigin.slice(0, 25) + "..." : confirmOrigin}</Text>
          </View>
          <View style={tw`flex-row px-4`}>
            <MaterialIcons name="place" size={24} color="green" />
            <Text>ปลายทาง : {confirmDestination.length > 25 ? confirmDestination.slice(0, 25) + "..." : confirmDestination}</Text>
          </View>
        </TouchableOpacity>

        <View>
         
          {showPicker && (
              <DateTimePicker
              mode="datetime"
            //   display={Platform.OS === "ios" ? "spinner" : "calendar"}
            
              display="calendar"
              value={date}
              onChange={onChange}
              locale="th"
              style={styles.datePicker}
              minimumDate={new Date()}
              maximumDate={new Date('2024-12-31')}
              />
            )}
          {showPicker && Platform.OS === "ios" && (
              <View
              style={[styles.datePicker , tw`flex-row items-start justify-center gap-4`] }
              >
              <TouchableOpacity onPress={toggleDatePicker} style={[tw`border border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus:ring focus:ring-blue-300 `]}>
                <Text style={tw`text-blue-500 text-lg font-medium text-center`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDate} style={[tw`bg-blue-500 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300  `]}>
                <Text style={tw`text-white text-lg font-semibold text-center`}>OK</Text>
              </TouchableOpacity>
              
            </View>
          )}

          {!showPicker && (
              <TouchableOpacity
              onPress={toggleDatePicker}
              style={tw`flex-col items-center justify-center bg-white  rounded-lg border border-gray-300 w-11/12 shadow-md w-70`}
              >
            <MaterialIcons name="date-range" size={25} color="black" style={tw`mt-2`}/>
              <TextInput
                style={tw`flex-col items-center justify-center bg-white rounded-lg border border-gray-300 w-11/12  w-65 border-transparent text-xl`}
                placeholder="BOOKING  Date"
                value={formatDate(date)}
                onChangeText={setDate}
                editable={false}
                onPressIn={toggleDatePicker}
                underlineColor="transparent"
                >
                
              </TextInput>
                
               
            </TouchableOpacity>
          )}
        </View>
        <View style={tw`w-full items-center mt-4`}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            mode="elevated"
            anchor={
                <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={tw`flex-col items-center justify-center bg-white p-4 rounded-lg border border-gray-300 w-11/12 shadow-md w-70 h-25`}
                >
                <FontAwesome5 name="car" size={25} color="black" style={tw`mb-2`} />
                <Text style={tw`text-xl`}>{category}</Text>
              </TouchableOpacity>
            }
            style={tw`w-70 rounded items-center`}>
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
            style={tw`items-center justify-center mt-4 w-70 h-20 bg-[white]`}
          >
            <Text>More Detail ... </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={tw`items-center justify-center mt-4 w-70 h-12 bg-[#60B876] rounded-lg`}
            onPress={() => {
              Alert.alert(
                "Confirm Order", // Title ของ alert
                `Origin: ${confirmOrigin}
                \n${origin.latitude}
                \n${origin.longitude}
                \nDestination: ${confirmDestination}
                \n${destination.latitude}
                \n${destination.longitude}
                \nCategory: ${category}
                \nDate: ${date}
                \nMore Detail: ...`,
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
            }}
          >
            <Text>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
</Provider>
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
