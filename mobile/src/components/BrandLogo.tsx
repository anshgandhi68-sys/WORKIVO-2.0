import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface BrandLogoProps {
  height?: number;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ height = 36 }) => {
  // 140x44 aspect ratio ~ 3.18
  const width = Math.round(height * 3.18);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
