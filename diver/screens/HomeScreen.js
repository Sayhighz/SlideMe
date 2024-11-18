import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { IP_ADDRESS } from "../config"; // Ensure IP_ADDRESS is correctly imported

export default function HomeScreen() {
  const navigation = useNavigation();
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const notice = [
    { id: 1, title: "แจ้งเตือนที่ 1", description: "โปรดอ่าน" },
    { id: 2, title: "แจ้งเตือนที่ 2", description: "ข่าวสาร" },
    { id: 3, title: "แจ้งเตือนที่ 3", description: "แจ้งเตือน" },
  ];
  

  // Fetch offers data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchOffers = async () => {
        try {
          const driver_id = 2; // Replace with the actual driver_id as needed
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/auth/getOffersFromDriver?driver_id=${driver_id}`
          );
          const data = await response.json();
          if (data.Status && Array.isArray(data.Result)) {
            setOffersData(data.Result);
          } else {
            console.warn("Unexpected API response format:", data);
            setOffersData([]);
          }
        } catch (error) {
          Alert.alert("Error", "Unable to fetch offers.");
          console.error(error);
          setOffersData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchOffers();
      return () => {};
    }, [])
  );

  // Handle offer press to navigate to JobWorking screen with request_id
  const handleOfferPress = (offer) => {
    if (offer.offer_status === 'accepted') {
      navigation.navigate('JobWorking', { request_id: offer.request_id });
    } else {
      setSelectedOffer(offer);
      setModalVisible(true);
    }
  };

  // Handle offer cancellation
  const handleCancelOffer = async (offerId) => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/auth/cancle_offer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ offer_id: offerId }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        Alert.alert("สำเร็จ", "ส่งคําขอยกเลิกสําเร็จ");
        setOffersData((prevData) =>
          prevData.filter((offer) => offer.offer_id !== offerId)
        );
        setModalVisible(false);
      } else {
        Alert.alert("Error", result.message || "Failed to cancel the offer.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while cancelling the offer.");
      console.error(error);
    }
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 8) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Function to format number with commas
  const formatNumberWithCommas = (number) => {
    if (isNaN(number)) return number;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to format status
  const getFormattedStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <Text
            style={[
              styles.globalText,
              styles.textSize,
              tw`text-yellow-500 text-xs`,
            ]}
          >
            รออนุมัติ
          </Text>
        );
      case "accepted":
        return (
          <Text
            style={[
              styles.globalText,
              styles.textSize,
              tw`text-green-500 text-xs`,
            ]}
          >
            อยู่ระหว่างการทำงาน
          </Text>
        );
      default:
        return (
          <Text style={[styles.globalText, styles.textSize]}>{status}</Text>
        );
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <FlatList
        data={offersData}
        ListHeaderComponent={
          <>
            <View style={tw`flex-row items-center mt-10 p-2 w-19/20 mx-auto`}>
              <Image
                source={{ uri: "https://example.com/profile.jpg" }}
                style={tw`w-24 h-24 rounded-full border-4 border-gray-400`}
              />
              <View style={tw`ml-4`}>
                <Text style={[styles.globalText, tw`text-2xl`]}>สวัสดี!</Text>
                <Text
                  style={[
                    styles.globalText,
                    tw`text-2xl font-bold text-green-600`,
                  ]}
                >
                  คุณ คุณาธิป อู่ทอง
                </Text>
              </View>
            </View>
            <View
              style={tw`flex-row justify-around w-19/20 mx-auto mt-4 p-4 bg-gray-100 rounded-lg`}
            >
              <View style={tw`items-center`}>
                <Text
                  style={[
                    styles.globalText,
                    tw`text-2xl font-bold text-green-600`,
                  ]}
                >
                  ฿50.00
                </Text>
                <Text style={[styles.globalText, tw`text-gray-600`]}>
                  รายได้วันนี้
                </Text>
              </View>
            </View>
            <View style={tw`w-19/20 mx-auto mt-4 p-4`}>
              <Text
                style={[
                  styles.globalText,
                  tw`text-gray-600 text-xl mb-2 text-center`,
                ]}
              >
                รายการเสนอราคา
              </Text>
            </View>
          </>
        }
        keyExtractor={(item) => item.offer_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOfferPress(item)}>
            <View
              style={tw`flex-row justify-between p-2 bg-white rounded-lg mb-2 shadow-md border border-gray-300 mx-3`}
            >
              <View>
                <Text style={[styles.globalText, tw`text-xs`]}>
                  <Icon name="map-marker" size={13} color="gray" />
                  {truncateText(item.location_from)}
                </Text>
                <Text style={[styles.globalText, tw`text-xs`]}>
                  <Icon name="map-marker" size={13} color="gray" />
                  {truncateText(item.location_to)}
                </Text>
              </View>
              <View>
                {getFormattedStatus(item.offer_status)}
                <Text style={[styles.globalText, tw`text-xs`]}>
                  {truncateText(item.vehicle_type)}
                </Text>
              </View>
              <View>
                <Text style={[styles.globalText, tw`text-blue-500 text-xs`]}>
                  ราคาที่เสนอ
                </Text>
                <Text style={[styles.globalText, tw`text-xs`]}>
                  {item.offered_price
                    ? `฿${formatNumberWithCommas(item.offered_price)}`
                    : "N/A"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          loading ? (
            <Text style={tw`text-center text-gray-500`}>กำลังโหลด...</Text>
          ) : (
            <Text style={tw`text-center text-gray-500`}>
              ไม่มีข้อมูลเสนอราคา
            </Text>
          )
        }
      />
      <View style={tw`w-19/20 mx-auto h-40 bg-gray-200 mt-4 rounded-lg`}>
        <Swiper
          autoplay
          autoplayTimeout={3}
          showsPagination
          loop
          activeDotColor="green"
          dotColor="gray"
          dotStyle={tw`w-2 h-2 bg-gray-600 rounded-full`}
          activeDotStyle={tw`w-3 h-3 bg-green-500 rounded-full`}
        >
          {notice.map((ad) => (
            <View
              key={ad.id}
              style={tw`flex items-center justify-center w-full h-full`}
            >
              <Text style={[styles.globalText, tw`text-gray-600 text-xl`]}>
                {ad.description}
              </Text>
            </View>
          ))}
        </Swiper>
      </View>
      <View style={tw`h-20`}></View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`w-4/5 bg-white p-6 rounded-lg shadow-lg`}>
            {selectedOffer && (
              <>
                <Text style={[styles.globalText, tw`text-lg mb-2`]}>
                  รายละเอียดข้อเสนอ
                </Text>
                <Text style={[styles.globalText, tw`mb-1`]}>
                  <Icon name="map-marker" size={20} color="gray" />
                  ต้นทาง: {selectedOffer.location_from}
                </Text>
                <Text style={[styles.globalText, tw`mb-1`]}>
                  <Icon name="map-marker" size={20} color="gray" />
                  ปลายทาง: {selectedOffer.location_to}
                </Text>
                <Text style={[styles.globalText, tw`mb-1`]}>
                  ประเภท: {selectedOffer.vehicle_type}
                </Text>
                <Text style={[styles.globalText, tw`mb-1`]}>
                  ราคาที่เสนอ:{" "}
                  {selectedOffer.offered_price
                    ? `฿${formatNumberWithCommas(selectedOffer.offered_price)}`
                    : "N/A"}
                </Text>
                <Text style={[styles.globalText, tw`mb-4`]}>
                  สถานะ: {getFormattedStatus(selectedOffer.offer_status)}
                </Text>
                <TouchableOpacity
                  style={tw`bg-red-500 p-3 rounded-lg items-center`}
                  onPress={() => handleCancelOffer(selectedOffer.offer_id)}
                >
                  <Text style={tw`text-white font-bold`}>ยกเลิกข้อเสนอ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`mt-4 bg-gray-300 p-3 rounded-lg items-center`}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={tw`text-black font-bold`}>ปิด</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <View style={tw`absolute bottom-4 w-full items-center`}>
        <TouchableOpacity
          style={[
            tw`w-11/12 bg-green-500 rounded-full p-4 items-center`,
            offersData.length >= 2 && tw`bg-gray-400`,
          ]}
          disabled={offersData.length >= 2}
          onPress={() => navigation.navigate("JobsScreen")}
        >
          <Text style={[styles.globalText, tw`text-white font-bold text-lg`]}>
            ค้นหางาน
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});
