import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useRoute } from "@react-navigation/native";
import { IP_ADDRESS } from "../../config";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import { UserContext } from "../../UserContext";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { useFocusEffect } from "@react-navigation/native";

export default function PaymentPage({ navigation }) {
  const feePrice = 200;

  const [discount, setDiscount] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);

  const [paymentMethods, setPaymentMethods] = useState();

  const [choosePaymentMethod, setChoosePaymentMethod] = useState("");

  const [tabIndex, setTabIndex] = useState(0);

  const [openModal, setOpenModal] = useState(false);

  const route = useRoute();

  const { userData } = useContext(UserContext);

  const driverId = route.params?.chooseDriver.id || "ไม่ระบุ";
  const driverName = route.params?.chooseDriver.name || "ไม่ระบุ";
  const driverRating = route.params?.chooseDriver.rating || "0";
  const driverPrice = parseFloat(route.params?.chooseDriver.price) || "0";
  route.params?.chooseDriver.customer_id_request || "ไม่ระบุ";

  useEffect(() => {
    setTotalPrice(parseFloat(driverPrice) + feePrice - discount);
  }, [driverPrice, discount, paymentMethods]);

  // Fetch payment methods when the page is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchPaymentMethods = async () => {
        if (!userData || !userData.customer_id) {
          console.error("User ID is missing");
          return;
        }

        try {
          const response = await axios.get(
            `http://${IP_ADDRESS}:4000/api/v1/customer/payment/all?customer_id=${userData.customer_id}`,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );

          if (response.data.Status) {
            setPaymentMethods(response.data.Result); // ตั้งค่า state ด้วยข้อมูลที่ได้รับ
          } else if (
            response.data.Error === "ไม่พบวิธีการชำระเงินสำหรับผู้ใช้รายนี้"
          ) {
            console.log("No payment methods found for this user.");
            setPaymentMethods([]); // ถ้าไม่มีข้อมูลให้ตั้งค่าเป็นอาร์เรย์ว่าง
          } else {
            console.error(
              "Error fetching payment methods:",
              response.data.Error
            );
          }
        } catch (error) {
          console.error("Error fetching payment methods:", error.message);
        }
      };

      fetchPaymentMethods();
    }, [userData.customer_id]) // Re-fetch if customer_id changes
  );

  const updateData = async () => {
    const { request_id } = route.params;
    const chosen_driver_id = route.params.chooseDriver.id;
    const offer_id = route.params.chooseDriver.offer_id;


    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:4000/api/v1/customer/request/accept-offer`,
        {
          request_id: request_id,
          customer_id: userData.customer_id,
          offer_id: offer_id,
          price: totalPrice,
          payment_method_id: choosePaymentMethod.payment_method_id,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      navigation.navigate("viewOrder", { driverProfile: route.params });
      setOpenModal(false);
      if (response.data.Status) {
        console.log(
          "Service request updated successfully:",
          response.data.Message
        );
      } else {
        console.error("Error:", response.data.Message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <>
      <HeaderWithBackButton
        showBackButton={true}
        title="ชําระเงิน"
        onPress={() => navigation.goBack()}
      />
      <SafeAreaView style={tw`flex-1 relative`}>
        <Modal visible={openModal} transparent={true}>
          <View
            style={[
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
              tw`flex-1 justify-center items-center`,
            ]}
          >
            <View style={tw`bg-white shadow flex rounded-lg p-3 h-40 w-5/7`}>
              <View style={tw`flex-1 items-center justify-center`}>
                <Text style={[styles.globalText, tw`text-sm `]}>
                  คุณยืนยันการชำระเงินครั้งนี้ใช่หรือไม่
                </Text>
              </View>
              <View style={tw`flex-row flex-1 items-center justify-around`}>
                <TouchableOpacity
                  style={tw`p-2 bg-red-500 rounded-lg w-15 `}
                  onPress={() => setOpenModal(false)}
                >
                  <Text style={[styles.globalText, tw`text-white text-center`]}>
                    ยกเลิก
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`p-2 bg-green-500 rounded-lg w-15`}
                  onPress={() => updateData()}
                >
                  <Text style={[styles.globalText, tw`text-white text-center`]}>
                    ยืนยัน
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={tw`flex-1`}>
          <View style={tw`flex-1 flex-row justify-around my-4`}>
            <Pressable
              style={[
                tw`w-1/3 border-2 rounded-lg items-center h-full justify-center`,
                tabIndex === 0
                  ? tw`bg-[#60B876] shadow-lg border-[#60B876]`
                  : tw`bg-white border-gray-300 shadow-lg`,
              ]}
              onPress={() => {
                setTabIndex(0);
              }}
            >
              <Text
                style={[
                  styles.globalText,
                  tabIndex === 0 ? tw`text-white` : tw`text-black`, // Change text color based on tabIndex
                ]}
              >
                บัตรเครดิต /
              </Text>
              <Text
                style={[
                  styles.globalText,
                  tabIndex === 0 ? tw`text-white` : tw`text-black`, // Change text color based on tabIndex
                ]}
              >
                บัตรเดบิต
              </Text>
            </Pressable>
            <Pressable
              style={[
                tw`w-1/3 border-2 rounded-lg items-center h-full justify-center`,
                tabIndex === 1
                  ? tw`bg-[#60B876] shadow-lg text-white border-[#60B876]`
                  : tw`bg-white border-gray-300 shadow-lg`,
              ]}
              onPress={() => {
                setTabIndex(1);
              }}
            >
              <Text
                style={[
                  styles.globalText,
                  tabIndex === 1 ? tw`text-white` : tw`text-black`, // Change text color based on tabIndex
                ]}
              >
                พร้อมเพย์
              </Text>
            </Pressable>
          </View>
          {tabIndex === 0 && (
            <FlatList
              style={tw`flex-3 mx-4`}
              data={paymentMethods}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => {
                if (!item.is_active) return null; // Skip inactive items
                return (
                  <Pressable
                    key={index}
                    style={[
                      tw`flex-row items-center p-4 mb-2 rounded`,
                      choosePaymentMethod &&
                      choosePaymentMethod.card_number === item.card_number &&
                      choosePaymentMethod.method_name === item.method_name &&
                      choosePaymentMethod.cardholder_name === item.cardholder_name &&
                      choosePaymentMethod.payment_method_id === item.payment_method_id
                        ? tw`bg-[#60B876]`
                        : tw`bg-white`,
                    ]}
                    onPress={() => {
                      setChoosePaymentMethod(item);
                    }}
                  >
                    <View style={tw`flex-1 items-center`}>
                      {(() => {
                        if (item.method_name === "Visa") {
                          return (
                            <FontAwesome5
                              name="cc-visa"
                              size={20}
                              color="#1A1F71"
                            />
                          );
                        } else if (item.method_name === "Mastercard") {
                          return (
                            <FontAwesome5
                              name="cc-mastercard"
                              size={32}
                              color="#EB001B"
                            />
                          );
                        }
                      })()}
                    </View>

                    <View style={tw`flex-5`}>
                      <Text
                        style={[
                          styles.globalText,
                          tw`text-lg`,
                          choosePaymentMethod &&
                          choosePaymentMethod.card_number ===
                            item.card_number &&
                          choosePaymentMethod.payment_type ===
                            item.payment_type &&
                          choosePaymentMethod.cardholder_name ===
                            item.cardholder_name &&
                            choosePaymentMethod.payment_method_id === item.payment_method_id
                            ? tw`text-white` // Change text color to white when selected
                            : tw`text-black`, // Keep text color black when not selected
                        ]}
                      >
                        {item.cardholder_name}
                      </Text>
                      <Text
                        style={[
                          styles.globalText,
                          tw`text-sm mt-2`,
                          choosePaymentMethod &&
                          choosePaymentMethod.card_number ===
                            item.card_number &&
                          choosePaymentMethod.payment_type ===
                            item.payment_type &&
                          choosePaymentMethod.cardholder_name ===
                            item.cardholder_name &&
                            choosePaymentMethod.payment_method_id === item.payment_method_id
                            ? tw`text-white` // Change text color to white when selected
                            : tw`text-black`, // Keep text color black when not selected
                        ]}
                      >
                        {item.card_number}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
          {tabIndex === 0 && (
            <TouchableOpacity
              style={tw`flex-1 items-center h-full justify-center border-2 mx-4 border-dashed rounded-lg mt-4`}
              onPress={() => navigation.navigate("AddMethod")}
            >
              <Text style={styles.globalText}>เพิ่มวิธีการชำระเงิน</Text>
            </TouchableOpacity>
          )}
          {tabIndex === 1 && (
            <View style={tw`flex-4 mx-4 mb-4`}>
              <View style={tw`flex-1 items-center justify-center`}>
                <Pressable>
                  <QRCode size={200} value="http://awesome.link.qr" />
                </Pressable>
              </View>
            </View>
          )}
        </View>
        <View style={tw`flex-1 mx-4 mt-4`}>
          <Text style={[styles.globalText, tw`text-xl`]}>รายการออเดอร์</Text>
          <View
            style={tw`flex-3 bg-white shadow-lg border border-gray-300 p-2 mt-4 rounded-lg`}
          >
            <View style={tw`flex-4 justify-between`}>
              <View style={tw`flex-row justify-between`}>
                <Text style={[styles.globalText, tw`flex-9 text-lg `]}>
                  {driverName}
                </Text>
                <View style={tw`flex-1 flex-row justify-end items-center`}>
                  <MaterialIcons name="star" size={24} color="orange" />
                  <Text style={[styles.globalText, tw`text-center`]}>
                    {driverRating}
                  </Text>
                </View>
              </View>
              <View style={tw`flex-row justify-between`}>
                <Text style={styles.globalText}>ราคาข้อเสนอ</Text>
                <Text style={styles.globalText}>
                  <Text style={[styles.globalText, tw`text-[#E33F3F]`]}>
                    {driverPrice}
                  </Text>{" "}
                  บาท
                </Text>
              </View>
              <View style={tw`flex-row justify-between`}>
                <Text style={styles.globalText}>ค่าธรรมเนียม</Text>
                <Text style={styles.globalText}>
                  <Text style={[styles.globalText, tw`text-[#E33F3F]`]}>
                    {feePrice}
                  </Text>{" "}
                  บาท
                </Text>
              </View>
              <View style={tw`flex-row justify-between`}>
                <Text style={styles.globalText}>ส่วนลด</Text>
                <Text style={styles.globalText}>
                  <Text style={tw` text-[#60B876]`}>
                    {discount === 0 ? "0" : discount}
                  </Text>{" "}
                  บาท
                </Text>
              </View>
            </View>
            <View style={tw`flex-2 justify-center`}>
              <View style={tw`flex-row justify-between`}>
                <Text style={[styles.globalText, tw`text-xl `]}>ยอดรวม</Text>
                <Text style={[styles.globalText, tw`text-xl `]}>
                  <Text style={[styles.globalText, tw` text-[#E33F3F]`]}>
                    {totalPrice}
                  </Text>{" "}
                  บาท
                </Text>
              </View>
            </View>
          </View>
          {tabIndex === 0 ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <TouchableOpacity
                style={tw`justify-center w-1/2 h-2/3 items-center border-2 rounded-lg bg-[#60B876] border-[#60B876]`}
                onPress={() => {
                  if (choosePaymentMethod !== "") {
                    // updateData();
                    setOpenModal(true);
                  }
                }}
              >
                <Text style={[styles.globalText, tw`text-white text-xl`]}>
                  จ่ายเงิน
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={tw`flex-1`}></View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
});
