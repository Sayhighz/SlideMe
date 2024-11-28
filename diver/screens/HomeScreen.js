import React, { useState, useEffect } from "react";
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
import { IP_ADDRESS } from "../config";
import NotificationRequest from "./NotificationRequest";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [offersData, setOffersData] = useState([]); // List of offers
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedOffer, setSelectedOffer] = useState(null); // Selected offer for modal
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const { userData = {} } = route.params || {}; // User data passed via route params
  const [notificationKey, setNotificationKey] = useState(0); // Key for NotificationRequest
  const [profitToday, setProfitToday] = useState(0); // Profit today
  const [driverScore, setDriverScore] = useState(0); // Driver score

  // Sample notices for Swiper
  const notice = [
    {
      id: 1,
      image: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=ads1.png`,
    },
    {
      id: 2,
      image: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=ads2.png`,
    },
    {
      id: 3,
      image: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=ads3.png`,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfitToday = async () => {
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/auth/driver/profitToday?driver_id=${userData?.driver_id}`
          );
          const data = await response.json();
          if (data.Status && Array.isArray(data.Result) && data.Result.length > 0) {
            setProfitToday(data.Result[0].profit_today); // Update profit today
          } else {
            setProfitToday(0); // Default to 0 if no data
          }
        } catch (error) {
          console.error("Error fetching profit_today:", error);
          setProfitToday(0);
        }
      };
  
      fetchProfitToday();
    }, [userData?.driver_id])
  );

  useFocusEffect(
    React.useCallback(() => {
      const driverScore = async () => {
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/auth/driver/score?driver_id=${userData?.driver_id}`
          );
          const data = await response.json();
          if (data.Status && Array.isArray(data.Result) && data.Result.length > 0) {
            setDriverScore(data.Result[0].Score);
          } else {
            setDriverScore(0);
          }
        } catch (error) {
          console.error("Error fetching profit_today:", error);
          setDriverScore(0);
        }
      };
  
      driverScore();
    }, [userData?.driver_id])
  );

  // Fetch offers when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchOffers = async () => {
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/auth/getOffersFromDriver?driver_id=${userData?.driver_id}`
          );
          const data = await response.json();
          if (data.Status && Array.isArray(data.Result)) {
            setOffersData(data.Result);
          } else {
            console.warn("รูปแบบข้อมูลที่ได้จาก API ไม่ถูกต้อง:", data);
            setOffersData([]);
          }
        } catch (error) {
          Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลข้อเสนอได้");
          console.error(error);
          setOffersData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchOffers();
      setNotificationKey((prevKey) => prevKey + 1); // Update the key to reload NotificationRequest
    }, [userData?.driver_id])
  );


  // Handle offer press
  const handleOfferPress = (offer) => {
    if (offer.offer_status === "accepted") {
      navigation.navigate("JobWorking_Pickup", {
        request_id: offer.request_id,
      });
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
        Alert.alert("สำเร็จ", "การยกเลิกข้อเสนอสำเร็จ");
        setOffersData((prevData) =>
          prevData.filter((offer) => offer.offer_id !== offerId)
        );
        setModalVisible(false);
      } else {
        Alert.alert(
          "ข้อผิดพลาด",
          result.message || "ไม่สามารถยกเลิกข้อเสนอได้"
        );
      }
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดขณะยกเลิกข้อเสนอ");
      console.error(error);
    }
  };

  const formatCurrency = (number) => {
    // Default to 0 if the number is null, undefined, or not a valid number
    if (number == null || isNaN(number)) return "฿0.00";
    return `฿${Number(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Utility to truncate long text
  const truncateText = (text, maxLength = 8) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Utility to format numbers with commas
  const formatNumberWithCommas = (number) => {
    if (isNaN(number)) return number;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Utility to format offer status
  const getFormattedStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <Text style={[styles.globalText, tw`text-yellow-500 text-xs`]}>
            รออนุมัติ
          </Text>
        );
      case "accepted":
        return (
          <Text style={[styles.globalText, tw`text-green-500 text-xs`]}>
            อยู่ระหว่างการทำงาน
          </Text>
        );
      default:
        return <Text style={styles.globalText}>{status}</Text>;
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
                source={{
                  uri: `http://${IP_ADDRESS}:3000/auth/fetch_image?filename=${userData?.profile_picture}`,
                }}
                style={tw`w-24 h-24 rounded-full border-2 border-green-400`}
              />
              <View style={tw`ml-4`}>
                <Text style={[styles.globalText, tw`text-sm text-gray-400`]}>
                  สวัสดี!
                </Text>
                <Text
                  style={[
                    styles.globalText,
                    tw`text-2xl font-bold text-[#60B876]`,
                  ]}
                >
                  {`${userData?.first_name || "ไม่พบข้อมูล"} ${
                    userData?.last_name || ""
                  }`}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <MaterialIcons name="star" size={24} color="orange" style={tw`mr-1`}/>
                <Text style={[styles.globalText, tw`text-lg text-gray-700`]}>
                  {driverScore ? driverScore.toFixed(1) : "0.0"}
                </Text>
                </View>
              </View>
            </View>
            <View
              style={tw`flex-row justify-around w-19/20 mx-auto mt-4 p-4 bg-white shadow-md rounded-lg border border-gray-300`}
            >
              <View style={tw`items-center`}>
                <Text
                  style={[
                    styles.globalText,
                    tw`text-2xl font-bold text-[#60B876]`,
                  ]}
                >
                  {formatCurrency(profitToday)}
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
              style={tw`p-2 bg-white rounded-lg mb-2 shadow-md border border-gray-300 mx-3 flex-row justify-between`}
            >
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center mb-1`}>
                  <Icon name="map-marker" size={13} color="gray" />
                  <Text style={[styles.globalText, tw`text-xs ml-1`]}>
                    {truncateText(item.location_from)}
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Icon name="map-marker" size={13} color="gray" />
                  <Text style={[styles.globalText, tw`text-xs ml-1`]}>
                    {truncateText(item.location_to)}
                  </Text>
                </View>
              </View>
              <View style={tw`flex-1 justify-center items-center`}>
                {getFormattedStatus(item.offer_status)}
                <Text style={[styles.globalText, tw`text-xs mt-1`]}>
                  {truncateText(item.vehicle_type)}
                </Text>
              </View>
              <View style={tw`flex-1 justify-center items-end`}>
                <Text style={[styles.globalText, tw`text-blue-500 text-xs`]}>
                  ราคาที่เสนอ
                </Text>
                <Text style={[styles.globalText, tw`text-xs mt-1`]}>
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
            <Text style={[styles.globalText, tw`text-center text-gray-500`]}>
              กำลังโหลด...
            </Text>
          ) : (
            <Text style={[styles.globalText, tw`text-center text-gray-500`]}>
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
          activeDotStyle={tw`w-3 h-3 bg-[#60B876] rounded-full`}
        >
          {notice.map((ad) => (
            <View
              key={ad.id}
              style={tw`flex items-center justify-center w-full h-full`}
            >
              <Image
                source={{ uri: ad.image }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
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
                <Text style={[styles.globalText, tw`text-lg mb-2 text-center`]}>
                  รายละเอียดข้อเสนอ
                </Text>
                <Text style={[styles.globalText]}>
                  <Icon name="map-marker" size={20} color="green" />
                  ต้นทาง:
                </Text>
                <Text style={[styles.globalText, tw`text-gray-400 mb-3`]}>
                  {selectedOffer.location_from}
                </Text>
                <Text style={[styles.globalText]}>
                  <Icon name="map-marker" size={20} color="red" />
                  ปลายทาง:
                </Text>
                <Text style={[styles.globalText, tw`text-gray-400 `]}>
                  {selectedOffer.location_to}
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
                  <Text style={[styles.globalText, tw`text-white font-bold`]}>
                    ยกเลิกข้อเสนอ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`mt-4 bg-gray-300 p-3 rounded-lg items-center`}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.globalText, tw`text-black font-bold`]}>
                    ปิด
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <View style={tw`absolute bottom-4 w-full items-center`}>
        <TouchableOpacity
          style={[
            tw`w-11/12 bg-[#60B876] rounded p-2 items-center`,
            offersData.length >= 2 && tw`bg-gray-400`,
          ]}
          disabled={offersData.length >= 2}
          onPress={() =>
            navigation.navigate("JobsScreen", {
              driver_id: userData?.driver_id,
            })
          }
        >
          <Text style={[styles.globalText, tw`text-white font-bold text-lg`]}>
            ค้นหางาน
          </Text>
        </TouchableOpacity>
        <NotificationRequest
          key={notificationKey}
          driver_id={userData?.driver_id}
          status={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});
