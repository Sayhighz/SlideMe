import React, { useState, useEffect } from "react";
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
  const { userData = {} } = route.params || {};

  const [images, setImages] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [buttonEnabled, setButtonEnabled] = useState(false); // State for button enable/disable

  // Function to handle image selection
  const handleImageSelection = async (label) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("ขอสิทธิ์ใช้งาน", "โปรดอนุญาตการเข้าถึงรูปภาพในคลัง");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });

      if (!result.canceled) {
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setImages((prevImages) => ({
          ...prevImages,
          [label]: uri,
        }));
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  // Update button enabled state when images change
  useEffect(() => {
    const allImagesUploaded = Object.values(images).every((uri) => uri !== null);

    if (allImagesUploaded) {
      const timer = setTimeout(() => setButtonEnabled(true), 3000); // Enable after 2000ms
      return () => clearTimeout(timer);
    } else {
      setButtonEnabled(false);
    }
  }, [images]);

  // Render upload box
  const renderUploadBox = (label, displayName) => (
    <TouchableOpacity
      style={tw`flex-1 bg-gray-100 rounded-lg p-4 m-2 shadow`}
      onPress={() => handleImageSelection(label)}
    >
      <View style={tw`items-center m-auto`}>
        {images[label] ? (
          <Image
            source={{ uri: images[label] }}
            style={tw`w-15 h-15 mb-2 rounded-lg`}
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
        <Text style={[styles.globalText, tw`text-gray-400`]}>อัพโหลด</Text>
        <Text
          style={[styles.globalText, tw`text-base text-center text-black font-bold`]}
        >
          {displayName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Handle confirmation process
  const handleConfirmation = async () => {
    const imageUris = Object.values(images).filter((uri) => uri !== null);

    if (imageUris.length < 4) {
      Alert.alert("ข้อผิดพลาด", "โปรดอัพโหลดรูปภาพทั้งหมด");
      return;
    }

    if (!request_id || !userData?.driver_id) {
      Alert.alert("ข้อผิดพลาด", "ข้อมูลคำขอหรือผู้ขับไม่สมบูรณ์");
      return;
    }

    const formData = new FormData();
    formData.append("request_id", request_id);
    formData.append("driver_id", userData?.driver_id);

    imageUris.forEach((uri, index) => {
      const fileName = uri.split("/").pop();
      const fileType = fileName.split(".").pop();

      formData.append("photos", {
        uri,
        name: `photo-${index}.${fileType}`,
        type: `image/${fileType}`,
      });
    });

    try {
      // Upload images
      const uploadResponse = await fetch(
        `http://${IP_ADDRESS}:3000/auth/upload_after_service`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();
      if (uploadResult.Status) {
        Alert.alert("สำเร็จ", "อัพโหลดรูปภาพสำเร็จ");

        // Complete request
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

        const completeData = await completeResponse.json();
        if (completeData.Status) {
          Alert.alert("สำเร็จ", "ดำเนินการเสร็จสิ้น");
          navigation.navigate("HomeMain");
        } else {
          Alert.alert("ข้อผิดพลาด", "การดำเนินการล้มเหลว");
        }
      } else {
        Alert.alert("ข้อผิดพลาด", uploadResult.Error || "การอัพโหลดรูปภาพล้มเหลว");
      }
    } catch (error) {
      console.error("Error during upload or completion:", error);
      Alert.alert("ข้อผิดพลาด", "เกิดปัญหาระหว่างการอัพโหลดหรือดำเนินการ");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`p-4 pt-10 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.globalText, tw`text-2xl font-bold ml-4`]}>ยืนยันการส่งรถ</Text>
      </View>

      {/* Content */}
      <View style={tw`p-4 flex-1`}>
        {/* Upload Boxes */}
        {renderUploadBox("front", "ด้านหน้ารถ")}
        {renderUploadBox("back", "ด้านหลังรถ")}
        <View style={tw`flex-row justify-between mt-4`}>
          {renderUploadBox("left", "ด้านข้างรถ (ซ้าย)")}
          {renderUploadBox("right", "ด้านข้างรถ (ขวา)")}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleConfirmation}
          style={[
            tw`p-4 rounded-lg mt-4 items-center`,
            buttonEnabled ? tw`bg-[#60B876]` : tw`bg-gray-400`,
          ]}
          disabled={!buttonEnabled}
        >
          <Text style={[styles.globalText, tw`text-white text-base font-bold`]}>ยืนยันการส่งรถ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Global styles
const styles = {
  globalText: {
    fontFamily: "Mitr-Regular",
  },
};

export default CarUploadDropOffConfirmation;
