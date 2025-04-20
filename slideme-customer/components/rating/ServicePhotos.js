// components/rating/ServicePhotos.js
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Modal 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";

const { width } = Dimensions.get("window");
const THUMBNAIL_SIZE = 83;
const IMAGE_WIDTH = width * 0.9;

const ServicePhotos = ({ beforePhotos = [], afterPhotos = [] }) => {
  const [activeTab, setActiveTab] = useState("before");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // If no photos are available, don't render the component
  if ((beforePhotos.length === 0 && afterPhotos.length === 0) || 
      (beforePhotos[0] === undefined && afterPhotos[0] === undefined)) {
    return null;
  }

  const renderPhotoGrid = (photos) => {
    if (!photos || photos.length === 0 || photos[0] === undefined) {
      return (
        <View style={tw`flex-1 justify-center items-center p-4`}>
          <Text style={styles.noPhotosText}>ไม่มีรูปภาพ</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`p-2`}
      >
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(`http://${IP_ADDRESS}:4000/api/v1${(photo.url || photo.uri)}`)}
            style={tw`mr-2`}
          >
            <Image
              source={{ uri: `http://${IP_ADDRESS}:4000/api/v1${(photo.url || photo.uri)}` }}
              style={[styles.thumbnail, tw`rounded-lg`]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={[tw`w-full bg-white rounded-lg border border-gray-300 mb-4`, styles.cardShadow]}>
      <View style={tw`flex-row border-b border-gray-200`}>
        <TouchableOpacity
          style={[
            tw`flex-1 p-3 items-center`,
            activeTab === "before" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("before")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "before" && { color: "#60B876" },
            ]}
          >
            รูปก่อนบริการ
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            tw`flex-1 p-3 items-center`,
            activeTab === "after" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("after")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "after" && { color: "#60B876" },
            ]}
          >
            รูปหลังบริการ
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`p-2`}>
        {activeTab === "before" ? renderPhotoGrid(beforePhotos) : renderPhotoGrid(afterPhotos)}
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#60B876",
  },
  tabText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  noPhotosText: {
    fontFamily: "Mitr-Regular",
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  fullImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    borderRadius: 8,
  },
});

export default ServicePhotos;