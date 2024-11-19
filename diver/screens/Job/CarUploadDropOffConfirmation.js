import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import { IP_ADDRESS } from "../../config";

const CarUploadDropOffConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { request_id } = route.params || {};
  const [images, setImages] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const handleImageSelection = async (label) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera roll permissions are required to select an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImages((prevImages) => ({
        ...prevImages,
        [label]: uri,
      }));
    }
  };

  const renderUploadBox = (label, displayName) => (
    <TouchableOpacity
      style={tw`flex-1 bg-gray-100 rounded-lg p-4 m-2 shadow`}
      onPress={() => handleImageSelection(label)}
    >
      <View style={tw`items-center m-auto`}>
        {images[label] ? (
          <Image
            source={{ uri: images[label] }}
            style={tw`w-32 h-32 mb-2 rounded-lg`}
            resizeMode="cover"
          />
        ) : (
          <Icon
            name="cloud-upload-outline"
            size={32}
            color="gray"
            style={tw`mb-2`}
          />
        )}
        <Text style={tw`text-gray-400`}>อัพโหลด</Text>
        <Text style={tw`text-base text-center text-black font-bold`}>
          {displayName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleConfirmation = async () => {
    const imageUris = Object.values(images).filter((uri) => uri !== null);

    if (imageUris.length < 4) {
      Alert.alert("Error", "โปรดอัพโหลดรูปภาพทั้งหมด");
      return;
    }

    const driver_id = 2; // Use a hardcoded value or obtain from route.params
    if (!request_id || !driver_id) {
      Alert.alert("Error", "Missing request_id or driver_id");
      return;
    }

    const formData = new FormData();
    formData.append("request_id", request_id);
    formData.append("driver_id", driver_id);

    imageUris.forEach((uri, index) => {
      const fileName = uri.split("/").pop();
      const fileType = fileName.split(".").pop();

      formData.append("photos", {
        uri,
        name: `photo-${index}.${fileType}`,
        type: `image/${fileType}`,
      });
    });

    console.log("Form Data:", formData);

    try {
      // First API call: Upload images
      const uploadResponse = await fetch(
        `http://${IP_ADDRESS}:3000/auth/upload_after_service`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResponseText = await uploadResponse.text();
      console.log("Upload Response Text:", uploadResponseText);

      const uploadResult = JSON.parse(uploadResponseText);
      if (uploadResult.Status) {
        Alert.alert("Success", "Images uploaded successfully");

        // Second API call: Complete request only if upload succeeded
        try {
          const completeResponse = await fetch(
            `http://${IP_ADDRESS}:3000/auth/complete_request`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ request_id }),
            }
          );

          const completeResponseText = await completeResponse.text();
          console.log("Complete Response Text:", completeResponseText);
          const completeData = JSON.parse(completeResponseText);
          if (completeData.Status) {
            Alert.alert("Success", "Request completed successfully.");
            navigation.navigate("HomeMain");
          } else {
            Alert.alert("Error", "Failed to complete request.");
          }
        } catch (error) {
          console.error("Complete request failed:", error);
          Alert.alert("Error", `An error occurred: ${error.message}`);
        }
      } else {
        Alert.alert("Error", uploadResult.Error || "Failed to upload images");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      Alert.alert("Error", "An error occurred while uploading images");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 flex-1`}>
        <View style={tw`p-4 pt-8 flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold ml-4`}>ยืนยันการส่งรถ</Text>
        </View>
        <View style={tw`flex-1 justify-center`}>
          {renderUploadBox("front", "ด้านหน้ารถ")}
          {renderUploadBox("back", "ด้านหลังรถ")}
          <View style={tw`flex-row justify-between mt-4`}>
            {renderUploadBox("left", "ด้านข้างรถ (ซ้าย)")}
            {renderUploadBox("right", "ด้านข้างรถ (ขวา)")}
          </View>
        </View>
        <TouchableOpacity
          onPress={handleConfirmation}
          style={tw`bg-green-500 p-4 rounded-lg mt-4 items-center`}
        >
          <Text style={tw`text-white text-base font-bold`}>ยืนยันการส่งรถ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CarUploadDropOffConfirmation;
