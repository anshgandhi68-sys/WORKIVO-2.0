import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { WORKIVO_COLORS, WORKIVO_RADII } from "../constants/theme";

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "outline" | "teal" | "cream";
  size?: "sm" | "md";
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = "cream",
  size = "md",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          container: styles.outlineBtn,
          text: styles.outlineText,
        };
      case "teal":
        return {
          container: styles.tealBtn,
          text: styles.tealText,
        };
      case "cream":
      default:
        return {
          container: styles.creamBtn,
          text: styles.creamText,
        };
    }
  };

  const v = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.base,
        v.container,
        size === "sm" ? styles.smSize : styles.mdSize,
        style,
      ]}
    >
      <Text style={[styles.baseText, v.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: WORKIVO_RADII.md,
    justifyContent: "center",
    alignItems: "center",
  },
  baseText: {
    fontWeight: "700",
  },
  smSize: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 38,
  },
  mdSize: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 46,
  },
  creamBtn: {
    backgroundColor: "rgba(143, 69, 63, 0.08)",
  },
  creamText: {
    color: WORKIVO_COLORS.mutedCoral,
    fontSize: 13,
  },
  outlineBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.warmCream,
  },
  outlineText: {
    color: WORKIVO_COLORS.warmCream,
    fontSize: 14,
  },
  tealBtn: {
    backgroundColor: WORKIVO_COLORS.deepTeal,
  },
  tealText: {
    color: WORKIVO_COLORS.white,
    fontSize: 14,
  },
});
