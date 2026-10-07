import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WORKIVO_COLORS, WORKIVO_RADII } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";
import { BrandLogo } from "./BrandLogo";

interface OnboardingModalProps {
  visible: boolean;
  onFinish: () => void;
}

const SLIDES = [
  {
    title: "Small task, Big relief.",
    subtitle: "Trusted local help, right when you need it.",
    image: require("../../assets/images/electrician.jpg"),
    badge: "01 • Instant Doorstep Dispatch",
  },
  {
    title: "Meet your local pros.",
    subtitle: "Find people with the skills your home needs.",
    image: require("../../assets/images/cook.jpg"),
    badge: "02 • 100% Background Verified",
  },
  {
    title: "Your time matters.",
    subtitle: "Book a service and follow its progress.",
    image: require("../../assets/images/barber.jpg"),
    badge: "03 • Live Status & Transparent Pay",
  },
];

const { width } = Dimensions.get("window");

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onFinish,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0
  );
  const bottomInset = insets.bottom;

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onFinish}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(topInset + 12, 24),
            paddingBottom: Math.max(bottomInset + 16, 24),
          },
        ]}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <BrandLogo height={32} />
          <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Image Container */}
        <View style={styles.imageCard}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>{slide.badge}</Text>
          </View>
        </View>

        {/* Slide Copy */}
        <View style={styles.content}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>

          {/* Dots Indicator */}
          <div style={{ display: "none" }} />
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentSlide && styles.activeDot]}
              />
            ))}
          </View>

          {/* Action Button */}
          <PrimaryButton
            title={currentSlide === SLIDES.length - 1 ? "Get Started" : "Continue"}
            size="lg"
            onPress={handleNext}
            style={{ width: "100%", marginTop: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WORKIVO_COLORS.warmCream,
    justifyContent: "space-between",
    paddingTop: 48,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: WORKIVO_RADII.pill,
    backgroundColor: "rgba(143, 69, 63, 0.08)",
  },
  skipText: {
    fontSize: 13,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "700",
  },
  imageCard: {
    width: "100%",
    height: 320,
    borderRadius: WORKIVO_RADII.xl,
    overflow: "hidden",
    position: "relative",
    borderWidth: 3,
    borderColor: WORKIVO_COLORS.borderLine,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgePill: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: WORKIVO_COLORS.coral,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: WORKIVO_RADII.pill,
  },
  badgeText: {
    color: "#2A1210",
    fontWeight: "700",
    fontSize: 12,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: WORKIVO_COLORS.mainText,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WORKIVO_COLORS.borderLine,
  },
  activeDot: {
    width: 24,
    backgroundColor: WORKIVO_COLORS.coral,
  },
});
