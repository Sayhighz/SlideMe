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
        {statuses.map((s, i) => {
          // Determine the color based on the current status
          const getStatusColor = () => {
            if (status === "completed") return "#34D399"; // Green for completed status
            if (i < currentIndex) return "#34D399"; // Green for completed
            if (i === currentIndex) return "#F59E0B"; // Yellow for in-progress
            return "gray"; // Gray for not reached yet
          };

          return (
            <View key={s.key} style={tw`items-center flex-1 h-20`}>
              {/* Show icon only for the current index */}
              <Animated.View style={{ opacity: i === currentIndex ? 1 : 0 }}>
                <MaterialIcons
                  name="local-shipping"
                  size={30}
                  color={getStatusColor()}
                />
              </Animated.View>
              <View
                style={[
                  tw`w-3 h-3 rounded-full z-10`,
                  { backgroundColor: getStatusColor() },
                ]}
              />
              <Text style={tw`text-xs text-gray-500 mt-1 text-center`}>
                {s.label}
              </Text>

              {i < statuses.length - 1 && (
                <View
                  style={[
                    tw`absolute w-full`,
                    {
                      height: 2,
                      backgroundColor:
                        i < currentIndex ? "#34D399" : "gray", // Line color
                      left: "50%",
                      marginLeft: -1, // Center the line
                      top: "45%",
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const statuses = [
  { key: "pending", label: "รอคนขับ" },
  { key: "accepted", label: "คนขับรับงาน" },
  { key: "pickup_in_progress", label: "กำลังไปรับรถ" },
  { key: "delivery_in_progress", label: "กำลังไปส่งรถ" },
  { key: "completed", label: "จัดส่งสำเร็จ" }, // Completed status will be green
];
