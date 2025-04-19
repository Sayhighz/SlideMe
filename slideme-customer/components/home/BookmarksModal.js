import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import BookmarkItem from "./BookmarkItem";

const BookmarksModal = ({
  modalVisible,
  closeModal,
  bookmarks,
  loading,
  handleRequestFromBookmark,
  styles,
  truncateText,
}) => {
  const { width, height } = Dimensions.get("window");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            tw`rounded-3xl`,
            { height: height * 0.75 },
          ]}
        >
          <LinearGradient 
            colors={["#60B876", "#55A76B"]}
            style={tw`w-8/12 py-3 px-4 rounded-xl mb-5 shadow-sm self-center`}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <MaterialIcons name="star" size={22} color="white" style={tw`mr-1`} />
              <Text
                style={[
                  styles.globalText,
                  tw`text-xl text-center text-white font-medium`,
                ]}
              >
                รายการโปรด
              </Text>
            </View>
          </LinearGradient>

          {loading ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <MaterialIcons name="hourglass-top" size={40} color="#60B876" style={tw`mb-2`} />
              <Text style={[styles.globalText, tw`text-gray-500 text-base`]}>
                กำลังโหลดข้อมูล...
              </Text>
            </View>
          ) : bookmarks.length === 0 ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <MaterialIcons name="info-outline" size={40} color="#60B876" style={tw`mb-2`} />
              <Text style={[styles.globalText, tw`text-gray-500 text-base`]}>
                ไม่พบรายการโปรด
              </Text>
            </View>
          ) : (
            <FlatList
              data={bookmarks}
              keyExtractor={(item) => item.address_id.toString()}
              renderItem={({ item }) => (
                <BookmarkItem
                  item={item}
                  handleRequestFromBookmark={handleRequestFromBookmark}
                  styles={styles}
                  truncateText={truncateText}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-4`}
              style={tw`w-full`}
            />
          )}

          <TouchableOpacity
            onPress={closeModal}
            style={tw`mt-4 w-6/12 overflow-hidden rounded-xl self-center shadow-sm`}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#FF6B6B", "#FF5252"]}
              style={tw`py-3 px-6 flex-row items-center justify-center`}
            >
              <MaterialIcons name="close" size={20} color="white" style={tw`mr-1`} />
              <Text style={[styles.globalText, tw`text-white text-center font-medium`]}>
                ปิดหน้าต่าง
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BookmarksModal;