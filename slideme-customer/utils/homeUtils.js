import { Alert } from "react-native";
import { IP_ADDRESS } from "../config";

export const formatDateToMySQL = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const truncateText = (text, maxLength = 28) => {
  if (!text) return "";
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
};

export const fetchBookmarks = async (userData, setBookmarks, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(
      `http://${IP_ADDRESS}:4000/customer/getuserbookmarks?customer_id=${userData.customer_id}`
    );
    const data = await response.json();
    if (data.Status) {
      setBookmarks(data.Result);
    } else {
      console.error(data.Error);
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message);
  }
  setLoading(false);
};

export const handleRequestFromBookmark = async (selectedBookmark, userData, navigation, setModalVisible) => {
  if (false) {
    alert("จากตําแหน่งต้องไม่เว้นว่าง, กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const requestData = {
    customer_id: userData.customer_id,
    request_time: formatDateToMySQL(new Date()),
    pickup_lat: selectedBookmark.pickup_lat,
    pickup_long: selectedBookmark.pickup_long,
    location_from: selectedBookmark.location_from,
    dropoff_lat: selectedBookmark.dropoff_lat,
    dropoff_long: selectedBookmark.dropoff_long,
    location_to: selectedBookmark.location_to,
    vehicletype_id: 1,
    booking_time: formatDateToMySQL(new Date()),
    customer_message: null,
  };

  console.log("Request data:", requestData);

  try {
    const response = await fetch(
      `http://${IP_ADDRESS}:4000/request/add_request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (responseData && responseData.request_id) {
      Alert.alert(
        "Request submitted successfully!",
        "",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate(
                "ChooseOffer",
                {
                  request_id: responseData.request_id,
                },
                setModalVisible(false)
              );
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      alert("Request submitted, but no request ID was returned.");
    }
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Failed to submit the request. Please try again.");
  }
};

export const checkOrderStatus = async (userData, navigation) => {
  try {
    console.log(userData)
    const response = await fetch(
      `http://${IP_ADDRESS}:4000/api/v1/customer/request/active?customer_id=${userData.customer_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );
    const data = await response.json();
    console.log("order_status:", data.driver_id, data.customer_id, data.request_id);
    if (data.Status) {
      navigation.navigate("viewOrder", {
        driverProfile: {
          chooseDriver: {
            id: data?.driver_id,
          },
          customer_id_request: data?.customer_id,
          request_id: data?.request_id
        }
      });
    } else if (data.Message === "No accepted records found for customer_id") {
      Alert.alert("ไม่มี Order ที่กำลังทำงานอยู่");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};