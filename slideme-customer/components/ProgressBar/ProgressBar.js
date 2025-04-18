import { Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";

export function ProgressBar({ status }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const currentIndex = statuses.findIndex((s) => s.key === status);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: currentIndex,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: currentIndex,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, status]);

  return (
    <View style={tw`items-center w-full mt-5`}>
      <View style={tw`flex-row items-center justify-between`}>
        {statuses.map((s, i) => (
          <View key={s.key} style={tw`items-center flex-1 h-20`}>
            {/* แสดงไอคอนเฉพาะสถานะที่ตรงกับ currentIndex */}
            <Animated.View style={{ opacity: i === currentIndex ? 1 : 0 }}>
              <MaterialIcons
                name="local-shipping"
                size={30}
                color={i <= currentIndex ? "green" : "white"}
              />
            </Animated.View>
            <View
              style={[
                tw`w-3 h-3 rounded-full`,
                { backgroundColor: i <= currentIndex ? "green" : "gray" },
              ]}
            />
            <Text style={tw`text-xs text-gray-500 mt-1 text-center`}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const statuses = [
  { key: "pending", label: "รอคนขับ" },
  { key: "accepted", label: "คนขับรับงาน" },
  { key: "pickup_in_progress", label: "กำลังไปรับรถ" },
  { key: "delivery_in_progress", label: "กำลังไปส่งรถ" },
  { key: "completed", label: "จัดส่งสำเร็จ" },
];
