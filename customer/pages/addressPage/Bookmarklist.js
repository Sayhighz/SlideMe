import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import tw from "twrnc"; // Import twrnc
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import { ActivityIndicator } from "react-native-paper";

const BookmarkList = ({ navigation }) => {
  //   const bookmarkData = [
  //     {
  //       id: '1',
  //       title: '1279/889',
  //       subtitle: 'Soi Bang Pu Mai Nakhon Khrongkan 3, Tambon T...',
  //       phone: '089 773 5638',
  //       note: 'No note to rider',
  //     },
  //   ];
  const { width, height } = Dimensions.get("window");
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { userData } = useContext(UserContext);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/customer/getuserbookmarks?user_id=${userData.user_id}`
      );

      const data = await response.json();
      if (data.Status) {
        setBookmarks(data.Result);
      } else {
        console.error("Error:", data.Error);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);


  const handleDelete = async (addressId) => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/customer/disable_bookmark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address_id: addressId }),
        }
      );

      const data = await response.json();
      if (data.Status) {
        Alert.alert("Success", "Bookmark deleted successfully!");
        fetchBookmarks();
      } else {
        Alert.alert("Error", data.Error || "Failed to delete bookmark.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred.");
    } finally {
      setModalVisible(false); // Close modal
    }
  };

  const truncateText = (text, maxLength = 40) => {
    if (!text) return "N/A"; // Return default if text is null/undefined
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };



  const renderBookmark = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("addressPage", {
          origin_lat: item.pickup_lat,
          origin_long: item.pickup_long,
          destination_lat: item.dropoff_lat,
          destination_long: item.dropoff_long,
          confirmOrigin: item.location_from,
          confirmDestination: item.location_to,
          category: item.vahicle_type,
          nameBookMark: item.save_name,
          address_id: item.address_id,
        });
      }}
    >
      <View
        style={tw`flex-1 bg-white p-4 mb-4 rounded-lg border border-gray-300 shadow-sm`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <Text
            style={tw`text-xl font-semibold ml-2`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            ชื่อ : {item.save_name}
          </Text>
          <TouchableOpacity
    onPress={() => {
      setItemToDelete(item.address_id);
      setModalVisible(true);
    }}
    style={tw`p-2 border border-red-300 bg-red-200 rounded-lg`}
  >
    <MaterialIcons name="delete" size={24} color="red" />
  </TouchableOpacity>
        </View>
        <View style={tw`flex-row flex-1 items-center mb-2`}>
          <MaterialIcons name="location-pin" size={25} color="red" />
          <Text
            style={tw`text-sm font-semibold p-1`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.location_from}
          </Text>
        </View>
        <View style={tw`flex-row flex-1 items-center mb-3`}>
          <MaterialIcons name="location-pin" size={24} color="green" />
          <Text
            style={tw`text-sm font-semibold p-1`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.location_to}
          </Text>
        </View>
        <View style={tw`flex-row flex-1 items-center mb-2 `}>
          <MaterialIcons name="directions-car" size={24} color="black" />
          <Text style={tw`text-sm font-semibold p-1`}>{item.vahicle_type}</Text>
        </View>
        
        
        
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row items-center justify-end mr-4 `}>
        <TouchableOpacity onPress={fetchBookmarks}>
          <MaterialIcons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* Header */}
      {loading && <Text> Loading </Text>}
      {/* Bookmark List */}
      <FlatList
        data={bookmarks}
        extraData={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item) => item.address_id.toString()}
        contentContainerStyle={
            bookmarks.length === 0
              ? tw`flex-1 items-center justify-center`
              : tw`px-4 pt-2`
          }
        ListEmptyComponent={
          <View style={tw`flex-1 items-center justify-center mt-4`}>
            <Text style={tw`text-lg font-semibold text-gray-600`}>
              No Bookmarks
            </Text>
          </View>
        }
      />

      {/* Add New Address Button */}
      <TouchableOpacity
        style={tw`flex-row items-center justify-center p-4 bg-white border-t border-gray-300`}
        onPress={() => navigation.navigate("addressPage")}
      >
        <Ionicons name="add-circle-outline" size={24} color="black" />
        <Text style={tw`text-lg ml-2 text-gray-800`}>เพิ่มรายการโปรด</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-gray-800 bg-opacity-75`}
        >
          <View style={tw`bg-white w-4/5 p-4 rounded-lg`}>
            <Text style={tw`text-lg font-semibold text-center mb-4`}>
              Are you sure you want to delete this bookmark?
            </Text>
            <View style={tw`flex-row justify-around`}>
              <TouchableOpacity
                title="Cancel"
                color="gray"
                onPress={() => setModalVisible(false)}
              >
                <Text style={tw`text-lg font-semibold text-gray-500`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                title="Delete"
                color="red"
                onPress={() => {
                  if (itemToDelete) {
                    handleDelete(itemToDelete); // Call delete function
                  }
                }}
              >
                <Text style={tw`text-lg font-semibold text-red-500`}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookmarkList;