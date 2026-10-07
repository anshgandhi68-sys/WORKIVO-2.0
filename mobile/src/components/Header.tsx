import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BrandLogo } from "./BrandLogo";
import { WORKIVO_COLORS, WORKIVO_RADII } from "../constants/theme";
import { useApp } from "../context/AppContext";

interface HeaderProps {
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNotificationPress }) => {
  const { mode, toggleMode, activeBooking } = useApp();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0
  );

  return (
    <View style={[styles.header, { paddingTop: topInset > 0 ? topInset + 8 : 14 }]}>
      {/* Top Row: Logo & Actions */}
      <View style={styles.topRow}>
        <BrandLogo height={34} />

        <View style={styles.actionGroup}>
          {/* Mode Switcher Pill */}
          <TouchableOpacity
            style={[
              styles.modePill,
              mode === "worker" && styles.workerModePill,
            ]}
            onPress={toggleMode}
            activeOpacity={0.8}
          >
            <Ionicons
              name={mode === "worker" ? "construct" : "person"}
              size={13}
              color={mode === "worker" ? "#2A1210" : WORKIVO_COLORS.white}
            />
            <Text
              style={[
                styles.modePillText,
                mode === "worker" && styles.workerModePillText,
              ]}
            >
              {mode === "worker" ? "Worker Mode" : "Customer"}
            </Text>
          </TouchableOpacity>

          {/* Alert / Notification Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={WORKIVO_COLORS.white} />
            {activeBooking && activeBooking.status !== "completed" && (
              <View style={styles.badgeDot} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Row: Location Selector */}
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={15} color={WORKIVO_COLORS.coral} />
        <Text style={styles.locationCity}>Bengaluru</Text>
        <Text style={styles.locationDivider}>•</Text>
        <Text style={styles.locationArea}>HSR Layout &amp; Bellandur</Text>
        <Ionicons name="chevron-down" size={13} color="#A8D5CC" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: WORKIVO_COLORS.deepTeal,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: WORKIVO_RADII.lg,
    borderBottomRightRadius: WORKIVO_RADII.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: WORKIVO_RADII.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  workerModePill: {
    backgroundColor: WORKIVO_COLORS.coral,
    borderColor: WORKIVO_COLORS.btn3dShadow,
  },
  modePillText: {
    color: WORKIVO_COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },
  workerModePillText: {
    color: "#2A1210",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: WORKIVO_RADII.pill,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WORKIVO_COLORS.coral,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
  },
  locationCity: {
    color: WORKIVO_COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  locationDivider: {
    color: "#A8D5CC",
    fontSize: 12,
  },
  locationArea: {
    color: "#D6E9E2",
    fontSize: 12,
    fontWeight: "500",
  },
});
