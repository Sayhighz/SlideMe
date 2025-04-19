import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { UserContext } from "../../UserContext";

// Import components
import Header from "../../components/home/Header";
import MainButton from "../../components/home/MainButton";
import ActionButtons from "../../components/home/ActionButtons";
import AdsSwiper from "../../components/home/AdsSwiper";
import BookmarksModal from "../../components/home/BookmarksModal";

// Import utilities
import { 
  fetchBookmarks, 
  handleRequestFromBookmark, 
  checkOrderStatus, 
  truncateText 
} from "../../utils/homeUtils";

function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);
  const route = useRoute();

  // Open modal and fetch bookmarks
  const openModal = () => {
    setModalVisible(true);
    fetchBookmarks(userData, setBookmarks, setLoading);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Handle order status check
  const handleOrderStatus = () => {
    checkOrderStatus(userData, navigation);
  };

  // Handle request from bookmark
  const handleBookmarkRequest = (selectedBookmark) => {
    handleRequestFromBookmark(selectedBookmark, userData, navigation, setModalVisible);
  };

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  return (
    <SafeAreaView style={[tw`flex-1`]} edges={["top", "left", "right"]}>
      <StatusBar backgroundColor="#f9fafb" barStyle="dark-content" />
      <LinearGradient
        colors={["#f8fcfa", "#f2f9f5", "#edf7f1"]}
        style={tw`flex-1`}
      >
        <View style={[tw`flex-1 items-center justify-start pt-2 px-4`]}>
          {/* Header - ส่วนแสดงคำทักทาย */}
          <Header userData={userData} styles={styles} />

          {/* Ads Swiper - สไลด์โฆษณา */}
          <View style={tw`my-4 w-full`}>
            <AdsSwiper />
          </View>

          {/* Main Button - ปุ่มเรียกรถสไลด์ */}
          <View style={tw`my-5 w-full`}>
            <MainButton navigation={navigation} styles={styles} />
          </View>

          {/* Action Buttons - ปุ่มติดตามสถานะ, ติดต่อเรา, รายการโปรด */}
          <View style={tw`mt-5 w-full`}>
            <ActionButtons
              styles={styles}
              handleOrderStatus={handleOrderStatus}
              openModal={openModal}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Bookmarks Modal - Modal แสดงรายการโปรด */}
      <BookmarksModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        bookmarks={bookmarks}
        loading={loading}
        handleRequestFromBookmark={handleBookmarkRequest}
        styles={styles}
        truncateText={truncateText}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    shadowColor: "#60B876",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default Home;