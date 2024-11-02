import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import dayjs from "dayjs";

import tw, { style } from "twrnc";
import { useRoute } from "@react-navigation/native";
import DatePicker from "@react-native-community/datetimepicker";

export default function Order({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const openDatePicker = () => {
    Platform.OS === "android" ? setShowPicker(true) : setModalVisible(true);
  }
  const closeCalendar = () => {
    setModalVisible(false); // Hide the modal
  };

  const onDateChange = (event , date) => {
    setShowPicker(Platform.OS === "ios");
    if (date) {
        setSelectedDate(date);
    }
    setShowPicker(false);
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

  return (
    <View style={tw`flex-1 p-5 `}>
      {/* <Image /> */}
      {/* Header Section */}
      <View style={tw`flex-row items-center `}>
        <Text style={styles.headerTitle}></Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Where do you want to take the Slide Car
      </Text>

      {/* Location Search */}
      <TouchableOpacity onPress={() => navigation.navigate("Mapdetail")}>
        <View style={styles.searchBar}>
          <MaterialIcons name="place" size={24} color="red" />
          <Text style={styles.nowText}>Now</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="black" />
        </View>
      </TouchableOpacity>

      <View style={tw`flex-1 items-center`}>
        <View style={[styles.optionsContainer]}>
          <Text>ต้นทาง : {confirmOrigin}</Text>
          <Text>ปลายทาง : {confirmDestination}</Text>
        </View>

        <View style={[styles.optionsContainer]}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              tw`items-center justify-center mt-4 w-70 h-20 bg-[white]`,
            ]}
            onPress={openDatePicker}
          >
            {selectedDate ? (
              <Text style={tw`text-lg font-bold`}>
                {dayjs(selectedDate).format("DD/MM/YYYY")}
              </Text>
            ) : (
              <View style={tw` items-center`}>
                <FontAwesome5 name="calendar" size={24} color="black" />
                <Text style={tw`text-lg font-bold`}>Booking</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {showPicker && Platform.OS === "android" && (
            <DatePicker
            value={selectedDate ? new Date(selectedDate) : new Date()}
            locale="th"
            mode="date"
            minimumDate={dayjs().toDate()}
            display="calendar"
            onDateChange={onDateChange} // Set selected date
        />)}

        {/* iOS */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeCalendar} // Close modal on back press
        >
          <View style={tw`flex-1 justify-center items-center bg-black/50`}>
            <View style={tw`w-80 p-5 bg-white rounded-lg items-center`}>
              <DatePicker
                value={selectedDate ? new Date(selectedDate) : new Date()}
                locale="th"
                mode="date"
                minimumDate={dayjs().toDate()}
                display="default"
                onDateChange={(event , date) => {onDateChange(event , date);closeCalendar();}} // Set selected date
              />
              <TouchableOpacity
                onPress={closeCalendar}
                style={tw`mt-5 p-3 bg-blue-500 rounded`}
              >
                <Text style={tw`text-white font-bold`}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeCalendar}
                style={tw`mt-5 p-3 bg-blue-500 rounded`}
              >
                <Text style={tw`text-white font-bold`}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={[styles.optionsContainer]}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              tw`items-center justify-center mt-4 w-70 h-20 bg-[white]`,
            ]}
          >
            <FontAwesome5 name={"car"} size={24} color="black" />
            <Text>Category</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.optionsContainer]}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              tw`items-center justify-center mt-4 w-70 h-30 bg-[white]`,
            ]}
          >
            {/* <FontAwesome5 name={''} size={24} color="black"/> */}
            <Text>More Detail ... </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.optionsContainer]}>
            <TouchableOpacity
                        style={[
                          styles.optionCard,
                          tw`items-center justify-center mt-4 w-70 h-20 bg-[white] rounded-lg bg-[#60B876]`,
                        ]}
                        onPress={()=>{navigation.navigate("payment")}}
                      >
              <Text>Go To Payment</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2FFF3" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: "bold", marginLeft: 10 },
  subtitle: { fontSize: 14, color: "gray", marginBottom: 10 },
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

  optionText: { marginLeft: 10, fontSize: 16 },
});
