// File: DeliveryInfoForm.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, SafeAreaView , Dimensions , Alert , StyleSheet} from 'react-native';
import tw, { style } from 'twrnc'; // Assuming you have installed tailwind-rn using `npm install tailwind-rn` or equivalent
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native'; 

import { Provider as PaperProvider } from "react-native-paper";



const Bookmark = ({navigation , }) => {
  const [addressName, setAddressName] = useState('');
  const [note, setNote] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  

  const { width, height } = Dimensions.get("window");
  const responsiveWidth = width * 0.9;
  const responsiveHeight = height * 0.2;

 

  const route = useRoute();
  const origin = route.params?.origin || "ไม่ระบุ";
  const destination = route.params?.destination || "ไม่ระบุ";
  const confirmOrigin = route.params?.confirmOrigin || "ไม่ระบุ";
  const confirmDestination = route.params?.confirmDestination || "ไม่ระบุ";
  

//   const selectCategory = (label) => {
//     setCategory(label);
//     setMenuVisible(false); // Close the menu after selecting a category
//   };

  const handleSave = () => {
    // Handle form save logic here

    if (!selectedLabel) {
        Alert.alert('Validation Error', 'Please select a label before saving.');
        return;
      }
      

    console.log('Address Saved:', { addressName, selectedLabel});
    navigation.navigate('HomePage' , {
        selectedLabel , 
        origin , 
        destination,
        confirmOrigin,
        confirmDestination
    })
  };

  const handleLabelSelect = (label) => {
    setSelectedLabel(label);
   
  };

  return (
    <SafeAreaView style={[tw`flex-1 bg-white items-center`]}>
        <PaperProvider>

        <View style ={ tw`p-4`}>    

      <Text style={[styles.globalText , tw`text-2xl font-bold mb-5`]}>Delivery Info</Text>
      <TouchableOpacity
            style={[
              { width: responsiveWidth, height: height * 0.12 },
              tw`p-2 mb-4 mt-1 justify-around bg-white rounded-lg border border-[#60B876] shadow-xl shadow-[#60B876]`
            ]}
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
      {/* <TextInput
        style={[{width:responsiveWidth , height: height * 0.13} ,tw`border border-gray-300 p-3 rounded mb-4` , styles.globalText]}
        placeholder="e.g. Home, Office, School"
        value={addressName}
        onChangeText={setAddressName}
        multiline
      /> */}
    
      <Text style={[styles.globalText , tw`mt-3 mb-1 font-semibold`]}>Address info *</Text>
      <TouchableOpacity style={tw`p-4 bg-green-100 rounded mb-5`}
        onPress={() => navigation.navigate('Addmap')}>
        <Text style={[styles.globalText ,tw`text-blue-600 text-center`]}>Choose from the map</Text>
      </TouchableOpacity>

      
      {/* <Text style={[styles.globalText , tw`mt-3 mb-1 font-semibold`]}>Note to rider</Text>
      <TextInput
        style={[styles.globalText ,tw`border border-gray-300 p-3 rounded h-20 mb-4`]}
        placeholder="e.g. White house with green roof"
        value={note}
        onChangeText={setNote}
        multiline
      /> */}
      <Text style={[styles.globalText , tw` mt-3 mb-1 font-semibold`]}>Label</Text>
      <View style={tw`flex-row justify-around mb-5 gap-2`}>
        {['Home', 'Work', 'Other'].map((label) => (
          <TouchableOpacity
            key={label}
            style={tw`p-2 border rounded w-1/3 items-center ${
              selectedLabel === label ? 'border-blue-500' : 'border-gray-300'
            }`}
            onPress={() => handleLabelSelect(label)}
          >
            <Text style={[styles.globalText , tw`${selectedLabel === label ? 'text-blue-500' : 'text-black'} text-lg`]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Save" onPress={handleSave} color="#28a745" />
        </View>
        </PaperProvider>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    globalText: {
      fontFamily: "Mitr-Regular",
    },
  });
export default Bookmark;
