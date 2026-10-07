import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../constants/theme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: "sm" | "md" | "lg";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  size = "md",
}) => {
  const getPadding = () => {
    switch (size) {
      case "sm":
        return { paddingVertical: 10, paddingHorizontal: 16, minHeight: 42 };
      case "lg":
        return { paddingVertical: 18, paddingHorizontal: 28, minHeight: 56 };
      case "md":
      default:
        return { paddingVertical: 14, paddingHorizontal: 22, minHeight: 48 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return 13;
      case "lg":
        return 16;
      case "md":
      default:
        return 14;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getPadding(),
        WORKIVO_SHADOWS.tactileBtn,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#2A1210" size="small" />
      ) : (
        <Text style={[styles.text, { fontSize: getFontSize() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: WORKIVO_COLORS.coral,
    borderRadius: WORKIVO_RADII.lg,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: WORKIVO_COLORS.btn3dShadow,
  },
  text: {
    color: "#2A1210",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.5,
  },
});
