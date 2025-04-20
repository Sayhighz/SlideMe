import { Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function ProgressBar({ status }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const currentIndex = statuses.findIndex((s) => s.key === status);

  // Animation for progress transition
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: currentIndex,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();

    // Add bounce animation for current status
    Animated.sequence([
      Animated.timing(bounceValue, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
      }),
      Animated.timing(bounceValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Create continuous pulse animation for current status
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [currentIndex, status]);

  const getStatusIcon = (statusKey) => {
    switch (statusKey) {
      case "pending":
        return "access-time";
      case "accepted":
        return "check-circle";
      case "pickup_in_progress":
        return "directions-car";
      case "delivery_in_progress":
        return "local-shipping";
      case "completed":
        return "celebration";
      default:
        return "radio-button-unchecked";
    }
  };

  return (
    <View style={tw`items-center w-full mt-5 px-2`}>
      <View style={tw`flex-row items-center justify-between relative`}>
        {/* Progress line background */}
        <View
          style={[
            tw`absolute h-1 bg-gray-200 rounded-full`,
            { width: "90%", left: "5%", top: 16 },
          ]}
        />

        {/* Animated progress line */}
        <Animated.View
          style={[
            tw`absolute h-2 rounded-full`,
            {
              width: `${(currentIndex / (statuses.length - 1)) * 90}%`,
              left: "5%",
              top: 15.5,
              backgroundColor: "#34D399",
              shadowColor: "#34D399",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 3,
            },
          ]}
        >
          <LinearGradient
            colors={["#34D399", "#10B981"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`w-full h-full rounded-full`}
          />
        </Animated.View>

        {statuses.map((s, i) => {
          // Determine the color based on the current status
          const getStatusColor = () => {
            if (status === "completed") return "#10B981"; // Green for completed status
            if (i < currentIndex) return "#10B981"; // Green for completed
            if (i === currentIndex) return "#F59E0B"; // Yellow for in-progress
            return "#9CA3AF"; // Gray for not reached yet
          };

          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex || status === "completed";

          return (
            <View key={s.key} style={tw`items-center z-10 flex-1`}>
              {/* Icon container */}
              <Animated.View
                style={[
                  tw`items-center justify-center mb-2`,
                  {
                    transform: [
                      { scale: isActive ? pulseAnim : isCompleted ? 1 : 0.9 },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    tw`items-center justify-center rounded-full p-2`,
                    {
                      backgroundColor: isCompleted
                        ? "#DCFCE7"
                        : isActive
                        ? "#FEF3C7"
                        : "#F3F4F6",
                      width: 40,
                      height: 40,
                      shadowColor: getStatusColor(),
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: isActive || isCompleted ? 0.5 : 0,
                      shadowRadius: 5,
                      elevation: isActive || isCompleted ? 3 : 0,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={getStatusIcon(s.key)}
                    size={24}
                    color={getStatusColor()}
                  />
                </View>
              </Animated.View>

              {/* Status dot */}
              <Animated.View
                style={[
                  tw`w-4 h-4 rounded-full border-2 z-10`,
                  {
                    backgroundColor: isCompleted ? getStatusColor() : "#FFFFFF",
                    borderColor: getStatusColor(),
                    transform: [{ scale: isActive ? bounceValue : 1 }],
                    shadowColor: getStatusColor(),
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isActive ? 0.8 : 0.3,
                    shadowRadius: 4,
                    elevation: isActive ? 4 : 1,
                  },
                ]}
              >
                {isCompleted && (
                  <View style={tw`items-center justify-center h-full`}>
                    <MaterialIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                )}
              </Animated.View>

              {/* Status label */}
              <Text
                style={[
                  tw`text-xs mt-1 text-center font-medium`,
                  {
                    color: isActive
                      ? "#F59E0B"
                      : isCompleted
                      ? "#10B981"
                      : "#6B7280",
                    fontSize: 11,
                    opacity: isActive ? 1 : isCompleted ? 0.9 : 0.7,
                  },
                ]}
              >
                {s.label}
              </Text>
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
  { key: "completed", label: "จัดส่งสำเร็จ" },
];