import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { WORKIVO_COLORS } from "../../constants/theme";

export default function TabLayout() {
  const { mode, activeBooking, workerJobs } = useApp();
  const insets = useSafeAreaInsets();

  const isWorker = mode === "worker";
  const pendingJobsCount = workerJobs.filter((j) => j.status === "incoming").length;

  const bottomInset = insets.bottom;
  const tabHeight = 56 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: WORKIVO_COLORS.coral,
        tabBarInactiveTintColor: WORKIVO_COLORS.mutedText,
        tabBarStyle: {
          backgroundColor: WORKIVO_COLORS.white,
          borderTopColor: WORKIVO_COLORS.borderLine,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: Math.max(bottomInset, 6),
          paddingTop: 6,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isWorker ? "Jobs" : "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isWorker ? "briefcase-outline" : "home-outline"}
              size={22}
              color={color}
            />
          ),
          tabBarBadge: isWorker && pendingJobsCount > 0 ? pendingJobsCount : undefined,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: isWorker ? "Schedule" : "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isWorker ? "calendar-outline" : "compass-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: isWorker ? "Earnings" : "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isWorker ? "wallet-outline" : "receipt-outline"}
              size={22}
              color={color}
            />
          ),
          tabBarBadge:
            !isWorker && activeBooking && activeBooking.status !== "completed"
              ? "●"
              : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
