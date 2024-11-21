import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import tw, { style } from "twrnc"; // Assuming you have installed tailwind-rn using `npm install tailwind-rn` or equivalent
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Menu, TextInput , Provider} from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import bookmap from "./bookmap/Bookmap";
import { IP_ADDRESS } from "../../config";

const AddressPage = ({ navigation }) => {
  // const [houseNumber, setHouseNumber] = useState('')
  // const [street, setStreet] = useState('')
  // const [subdistrict, setSubdistrict] = useState('')
  // const [district, setDistrict] = useState('')
  // const [province, setProvince] = useState('')
  // const [postalCode, setPostalCode] = useState('')
  const [nameBookMark, setNameBookMark] = useState("");
  const [category, setCategory] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;
  const responsiveHeight = height * 0.2;

  const route = useRoute();
  const origin = route.params?.origin || "ไม่ระบุ";
  const destination = route.params?.destination || "ไม่ระบุ";
  const confirmOrigin = route.params?.confirmOrigin || "ไม่ระบุ";
  const confirmDestination = route.params?.confirmDestination || "ไม่ระบุ";

  const handleSave = async () => {
    if (!nameBookMark || !confirmOrigin || !confirmDestination || !category) {
      Alert.alert("Error", "Please fill all the required fields.");
      return;
    }
  
    const payload = {
      user_id: 1, // Replace with the actual user ID
      save_name: nameBookMark,
      location_from: confirmOrigin,
      pickup_lat: origin.latitude , // Replace with actual lat/lng
      pickup_long: origin.longitude,
      location_to: confirmDestination,
      dropoff_lat: destination.latitude,
      dropoff_long: destination.longitude,
      vahicle_type: category,
    };
  
    try {
      const response = await fetch(`http://${IP_ADDRESS}:3000/auth/customer/add_bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok && data.Status) {
        Alert.alert("Success", "Bookmark added successfully!");
        navigation.navigate("UserProfile");
      } else {
        Alert.alert("Error", data.Error || "Failed to add bookmark.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred.");
    }
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
    <>
      <SafeAreaView style={[tw`flex-1 bg-white items-center justify-between `, {height: height}]}>
        <PaperProvider>
          <View style={tw` bg-white `}>
            <Text style={[styles.globalText, tw`mt-2 mb-1 font-semibold`]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.globalText,
                tw`w-full h-12 border border-gray-300 bg-white rounded-lg px-3 mb-3`,
              ]}
              placeholder="Name of Bookmark"
              mode="outlined"
              value={nameBookMark}
              onChangeText={setNameBookMark}
              maxLength={20}
            />

            <Text style={[styles.globalText, tw`mt-2 mb-1 font-semibold`]}>
              Route info
            </Text>
            <TouchableOpacity
              style={[
                { width: responsiveWidth, height: height * 0.12 },
                tw`p-2 mb-4 mt-1 justify-around bg-white rounded-lg border border-[#60B876] shadow-xl shadow-[#60B876]`,
              ]}
              onPress={() => navigation.navigate("addMapFav")}
              // onPress={() => navigation.navigate("Mapdetail")}
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
            
            <View style={[tw`w-full items-center mt-2`]}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                mode="elevated"
                anchor={
                  <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    style={[
                      { width: responsiveWidth, height: height * 0.12 },
                      tw`flex-col items-center justify-center bg-white p-4 rounded-lg border border-[#60B876] shadow-xl shadow-[#60B876] mb-4`,
                    ]}
                  >
                    <FontAwesome5
                      name="car"
                      size={25}
                      color="black"
                      style={tw`mb-2`}
                    />
                    <Text style={[styles.globalText, tw`text-lg`]}>
                      {category ? category : "ประเภทของรถสไลด์"}
                    </Text>
                  </TouchableOpacity>
                }
                style={[
                  tw`flex-1 items-center justify-center left-30 right-15`,
                  ,
                ]}
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

            <View style={[tw`flex items-center justify-end  `,{height: height * 0.331}]}>
                <View style={tw`flex-row items-center justify-center gap-4`}>
                  
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.globalText,tw` items-center justify-center bg-red-400 p-4 rounded-lg `, {width:width * 0.4 , height: height * 0.09 , marginBottom: height * 0.02}]}
            >
              <Text style={[ styles.globalText,tw`text-white font-bold text-lg`]}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.globalText,tw` items-center justify-center bg-[#60B876] p-4 rounded-lg `, {width:width * 0.4 , height: height * 0.09 , marginBottom: height * 0.02}]}
            >
              <Text style={[styles.globalText,tw`text-white font-bold text-lg`]}>บันทึก</Text>
            </TouchableOpacity>
                </View>
            </View>
          </View>
        </PaperProvider>
      </SafeAreaView>

    </>
  );
};
const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});
export default AddressPage;
