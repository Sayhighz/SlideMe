import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Animated,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";

const DriverCard = React.memo(
  ({ item, selectedDriver, onDriverSelect, fee }) => {
    // Animation for card selection
    const [animation] = React.useState(
      new Animated.Value(selectedDriver?.id === item.id ? 1 : 0)
    );

    React.useEffect(() => {
      Animated.timing(animation, {
        toValue: selectedDriver?.id === item.id ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [selectedDriver?.id === item.id]);

    const cardScale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.02],
    });

    const isSelected = selectedDriver?.id === item.id;
    const totalPrice = item.price + fee;

    return (
      <Animated.View
        style={{
          transform: [{ scale: cardScale }],
        }}
      >
        <TouchableOpacity
          style={[
            tw`rounded-xl shadow-sm p-4 my-1.5`,
            Platform.OS === "ios" ? tw`shadow-sm` : tw`elevation-2`,
            isSelected ? styles.selectedCard : styles.normalCard,
          ]}
          onPress={() => onDriverSelect(item)}
          activeOpacity={0.7}
        >
          <View style={tw`flex-row items-center`}>
            {/* Avatar and name section */}
            <View style={tw`mr-3`}>
              <View
                style={tw`h-12 w-12 rounded-full bg-blue-50 items-center justify-center`}
              >
                <MaterialIcons
                  name="person"
                  size={28}
                  color={isSelected ? "#3182CE" : "#4a5568"}
                />
              </View>
            </View>

            {/* Info section */}
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center justify-between`}>
                <Text
                  style={[
                    styles.globalText,
                    tw`text-base font-medium text-gray-800`,
                  ]}
                >
                  {item.name}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <MaterialIcons name="star" size={16} color="#F6AD55" />
                  <Text style={[styles.globalText, tw`ml-1 text-gray-600`]}>
                    {item.rating ? item.rating : "0.0"}
                  </Text>
                </View>
              </View>

              {/* Price and distance */}
              <View style={tw`flex-row items-center justify-between mt-1`}>
                <View style={[tw`flex-row items-center`]}>
                  <MaterialIcons name="payments" size={16} color="#4a5568" />
                  <Text style={[styles.globalText, tw`ml-1 text-gray-700`]}>
                    {totalPrice} บาท
                  </Text>
                </View>

                <View style={tw`flex-row items-center`}>
                  <MaterialIcons name="map" size={16} color="#4a5568" />
                  <Text style={[styles.globalText, tw`ml-1 text-gray-700`]}>
                    {item.distance ? `${item.distance / 1000} กม.` : "- กม."}
                  </Text>
                </View>
              </View>

              {/* Duration and select button */}
              <View style={tw`flex-row items-center justify-between mt-2`}>
                <View style={tw`flex-row items-center`}>
                  <MaterialIcons name="access-time" size={16} color="#4a5568" />
                  <Text style={[styles.globalText, tw`ml-1 text-gray-700`]}>
                    {item.durationText ? `${item.durationText} นาที` : "- นาที"}
                  </Text>
                </View>

                <View
                  style={[
                    tw`px-3 py-1 rounded-full flex-row items-center`,
                    isSelected ? styles.selectedButton : styles.selectButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.globalText,
                      tw`text-xs mr-1`,
                      isSelected ? tw`text-white` : tw`text-blue-600`,
                    ]}
                  >
                    {isSelected ? "เลือกแล้ว" : "เลือก"}
                  </Text>
                  <MaterialIcons
                    name={isSelected ? "check" : "arrow-forward"}
                    size={14}
                    color={isSelected ? "white" : "#3B82F6"}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const DriverList = ({
  drivers = [],
  selectedDriver,
  onDriverSelect,
  fee = 0,
  isLoading = false,
}) => {
  // Show empty state when no drivers are available
  const renderEmptyList = () => (
    <View style={tw`flex-1 justify-center items-center py-10`}>
      <View style={tw`bg-gray-100 p-4 rounded-full mb-3`}>
        <MaterialIcons name="search-off" size={42} color="#a0aec0" />
      </View>
      <Text style={[styles.globalText, tw`text-lg text-gray-500 mt-2`]}>
        ไม่มีคนขับในระยะนี้
      </Text>
      <Text
        style={[
          styles.globalText,
          tw`text-sm text-gray-400 mt-1 text-center px-10`,
        ]}
      >
        ลองเปลี่ยนระยะทางหรือรีเฟรชอีกครั้ง
      </Text>
    </View>
  );

  // Show loading state
  // if (isLoading) {
  //   return (
  //     <View style={tw`h-full items-center py-6`}>
  //       <ProgressBar status="pending" />
  //       <Text style={[styles.globalText, tw`text-gray-500 h-20 mt-4`]}>
  //         กำลังค้นหาคนขับ...
  //       </Text>
  //       <Text style={[styles.globalText, tw`text-sm text-gray-400 mt-1 text-center px-6`]}>
  //         โปรดรอสักครู่
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <View style={tw`flex-1`}>
      <View style={tw` items-center -mt-5`}>
        <ProgressBar status="pending" />
      </View>
      <FlatList
        data={drivers}
        keyExtractor={(item) => `driver-${item.id}`}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-4`}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selectedDriver={selectedDriver}
            onDriverSelect={onDriverSelect}
            fee={fee}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  globalText: {
    fontFamily: "Mitr-Regular",
  },
  normalCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  selectedCard: {
    backgroundColor: "#EBF8FF",
    borderWidth: 1,
    borderColor: "#BEE3F8",
  },
  selectButton: {
    backgroundColor: "#EBF8FF",
    borderWidth: 1,
    borderColor: "#90CDF4",
  },
  selectedButton: {
    backgroundColor: "#3B82F6",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
});

export default DriverList;
