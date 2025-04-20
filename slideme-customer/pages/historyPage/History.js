import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Animated,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { IP_ADDRESS } from "../../config";
import { UserContext } from "../../UserContext";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

// Import refactored components
import FilterTabs from "../../components/history/FilterTabs";
import HistoryCard from "../../components/history/HistoryCard";
import DetailModal from "../../components/history/DetailModal";
import PhotoViewer from "../../components/history/PhotoViewer";
import EmptyState from "../../components/history/EmptyState";
import { PRIMARY_COLOR, parsePhotos } from "../../components/history/utils";

const HistoryPage = () => {
  // State variables
  const [filter, setFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState("before"); // "before" or "after"
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [serviceHistoryData, setServiceHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // Animation for filter button
  const filterButtonAnim = new Animated.Value(0);

  // Context for user data
  const { userData } = useContext(UserContext);

  // Animation for filter button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(filterButtonAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(filterButtonAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateAnim = filterButtonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Fetch history data from API
  const fetchData = async (page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;

      const response = await fetch(
        `http://${IP_ADDRESS}:4000/api/v1/customer/request/history?customer_id=${userData.customer_id}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      
      if (data.Status) {
        // Process data and parse photos
        const processedData = Array.isArray(data.requests)
          ? data.requests.map((item) => ({
              ...item,
              photos_before_service: parsePhotos(item.photos_before_service),
              photos_after_service: parsePhotos(item.photos_after_service),
            }))
          : [];

        // console.log("sasds",processedData)

        // If first page, replace data. Otherwise append
        if (page === 1) {
          setServiceHistoryData(processedData);
        } else {
          setServiceHistoryData((prev) => [...prev, ...processedData]);
        }

        // Update pagination
        if (data.pagination) {
          setPagination({
            currentPage:
              Math.floor(data.pagination.offset / data.pagination.limit) + 1,
            totalPages: data.pagination.total_pages || 1,
            limit: data.pagination.limit || 10,
          });
        }
      } else {
        setError(data.Message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [userData.customer_id]);

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchData(1, pagination.limit); // Reset to first page
  };

  // Load more data when reaching end of list
  const loadMoreData = () => {
    if (
      pagination.currentPage < pagination.totalPages &&
      !loading &&
      !refreshing
    ) {
      fetchData(pagination.currentPage + 1, pagination.limit);
    }
  };

  // Filter data based on selected filter
  const filteredData = serviceHistoryData.filter((item) => {
    if (filter === "completed") return item.status === "completed";
    if (filter === "cancelled") return item.status === "cancelled";
    if (filter === "active") {
      return item.status !== "completed" && item.status !== "cancelled";
    }
    return true; // "all" filter
  });

  // Modal handlers
  const openModal = (item) => {
    if (!item) {
      console.warn("Item is null or undefined");
      return;
    }
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Photo modal handlers
  // ในฟังก์ชัน openPhotoModal
  // ในฟังก์ชัน openPhotoModal ของ HistoryPage.js
  const openPhotoModal = (type, index = 0) => {
    // console.log("Opening photo modal:", { type, index });
    setCurrentPhotoType(type);
    setCurrentPhotoIndex(index);

    // ปิด DetailModal ก่อนเปิด PhotoViewer
    setModalVisible(false);

    // รอให้ DetailModal ปิดก่อนจึงเปิด PhotoViewer
    setTimeout(() => {
      setPhotoModalVisible(true);
      // console.log("photoModalVisible set to true after DetailModal closed");
    }, 300); // รอเวลาให้ Modal แรกปิดก่อน
  };

  const closePhotoModal = () => {
    // console.log("Closing photo modal");
    setPhotoModalVisible(false);

    // เปิด DetailModal อีกครั้งหลังจากปิด PhotoViewer
    setTimeout(() => {
      setModalVisible(true);
      // console.log("DetailModal reopened after PhotoViewer closed");
    }, 300);
  };

  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    const photos =
      currentPhotoType === "before"
        ? selectedItem.photos_before_service || []
        : selectedItem.photos_after_service || [];

    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  // Handle rating action
  const handleRating = (requestId) => {
    setModalVisible(false);
    Alert.alert(
      "แจ้งเตือน",
      "ขอบคุณที่กลับมารีวิวให้เรา",
      [
        {
          text: "ให้คะแนน",
          onPress: () => {
            // console.log(serviceHistoryData)
            // ถ้า Rating อยู่ใน Stack Navigator ที่ชื่อ "ServiceStack"
            navigation.navigate("Home", {
              screen: "Rating",
              params: {
                requestId: requestId,
              },
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Handle view status action
  const handleViewStatus = () => {
    setModalVisible(false);
    Alert.alert("แจ้งเตือน", "กำลังนำท่านไปยังหน้าติดตามสถานะ");
  };

  // Apply filter
  const applyFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  // Render loading state
  if (loading && !refreshing) {
    return (
      <>
        <HeaderWithBackButton
          title="ประวัติการใช้บริการ"
          showBackButton={false}
          backgroundColor={PRIMARY_COLOR}
          titleColor="white"
        />
        <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={[styles.customFont, tw`text-gray-600 mt-4`]}>
            กำลังโหลดประวัติ...
          </Text>
        </View>
      </>
    );
  }

  // Render error state
  if (error && !refreshing) {
    return (
      <>
        <HeaderWithBackButton
          title="ประวัติการใช้บริการ"
          showBackButton={false}
          backgroundColor={PRIMARY_COLOR}
          titleColor="white"
        />
        <View style={tw`flex-1 justify-center items-center bg-gray-50 p-5`}>
          <Ionicons name="alert-circle-outline" size={60} color="#f87171" />
          <Text
            style={[
              styles.customFont,
              tw`text-lg text-gray-700 mt-4 text-center`,
            ]}
          >
            เกิดข้อผิดพลาด
          </Text>
          <Text style={[styles.customFont, tw`text-center text-gray-500 mt-2`]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[
              tw`mt-6 bg-[${PRIMARY_COLOR}] px-6 py-3 rounded-full`,
              styles.buttonShadow,
            ]}
            onPress={onRefresh}
          >
            <Text style={[styles.customFont, tw`text-white font-bold`]}>
              ลองใหม่อีกครั้ง
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // Main render
  return (
    <>
      <HeaderWithBackButton
        title="ประวัติการใช้บริการ"
        showBackButton={false}
        backgroundColor={PRIMARY_COLOR}
        titleColor="white"
      />
      <View style={tw`flex-1 bg-gray-50`}>
        {/* Filter tabs */}
        <FilterTabs activeFilter={filter} onFilterChange={applyFilter} />

        {/* History list */}
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <HistoryCard item={item} onPress={openModal} />
          )}
          keyExtractor={(item, index) => {
            return item && item.request_id
              ? `request-${item.request_id}-${index}`
              : `index-${index}`;
          }}
          contentContainerStyle={[
            tw`pb-20`,
            filteredData.length === 0 && tw`flex-1`,
          ]}
          ListEmptyComponent={
            <EmptyState filter={filter} onRefresh={onRefresh} />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[PRIMARY_COLOR]}
              tintColor={PRIMARY_COLOR}
            />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === "android"}
          ListFooterComponent={
            pagination.currentPage < pagination.totalPages && !loading ? (
              <View style={tw`py-4 items-center`}>
                <ActivityIndicator color={PRIMARY_COLOR} />
                <Text style={[styles.customFont, tw`text-gray-500 mt-2`]}>
                  กำลังโหลดข้อมูลเพิ่มเติม...
                </Text>
              </View>
            ) : null
          }
        />

        {/* Detail Modal */}
        <DetailModal
          visible={modalVisible}
          item={selectedItem}
          onClose={closeModal}
          onViewPhoto={openPhotoModal}
          onRate={() => handleRating(selectedItem?.request_id)}
          onViewStatus={handleViewStatus}
        />

        {/* Photo Viewer Modal */}
        {selectedItem && (
          <PhotoViewer
            visible={photoModalVisible}
            onClose={closePhotoModal} // ใช้ฟังก์ชันใหม่ที่จะเปิด DetailModal อีกครั้ง
            photos={
              currentPhotoType === "before"
                ? selectedItem?.photos_before_service || []
                : selectedItem?.photos_after_service || []
            }
            currentIndex={currentPhotoIndex}
            onPrevious={handlePreviousPhoto}
            onNext={handleNextPhoto}
            photoType={currentPhotoType}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  customFont: {
    fontFamily: Platform.OS === "ios" ? "Mitr-Regular" : "Mitr-Regular",
  },
  floatingButton: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default HistoryPage;
