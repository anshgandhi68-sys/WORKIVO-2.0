import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ServiceCategory } from "../data/services";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";

interface ServiceStoryCardProps {
  service: ServiceCategory;
  onBookPress: (service: ServiceCategory) => void;
  onDetailPress: (service: ServiceCategory) => void;
}

export const ServiceStoryCard: React.FC<ServiceStoryCardProps> = ({
  service,
  onBookPress,
  onDetailPress,
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* 3D Stack Layer Background (Terracotta drop layer inspired by web deck) */}
      <View style={styles.backLayer} />

      {/* Main Card Surface */}
      <View style={styles.card}>
        {/* Real Worker Image Header */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onDetailPress(service)}
          style={styles.imageWrapper}
        >
          <Image source={service.image} style={styles.image} resizeMode="cover" />

          {/* Floating Category Pill in Coral */}
          <View style={styles.tagPill}>
            <Ionicons name="star" size={12} color="#2A1210" />
            <Text style={styles.tagText}>{service.badge}</Text>
          </View>

          {/* Service Number Badge */}
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{service.number}</Text>
          </View>
        </TouchableOpacity>

        {/* Narrative & Details */}
        <View style={styles.content}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onDetailPress(service)}>
            <Text style={styles.title}>{service.title}</Text>
          </TouchableOpacity>

          <Text style={styles.description}>{service.description}</Text>

          {/* Meta specs row */}
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>⏱ {service.duration}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>💰 {service.priceEstimate}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>★ {service.rating} ({service.reviewsCount})</Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                title={`Book ${service.title.toLowerCase()}`}
                size="sm"
                onPress={() => onBookPress(service)}
              />
            </View>
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() => onDetailPress(service)}
              activeOpacity={0.7}
            >
              <Text style={styles.detailBtnText}>Details</Text>
              <Ionicons name="arrow-forward" size={14} color={WORKIVO_COLORS.mutedCoral} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 14,
    marginHorizontal: 16,
    position: "relative",
  },
  backLayer: {
    position: "absolute",
    top: 8,
    left: 8,
    right: -6,
    bottom: -6,
    backgroundColor: WORKIVO_COLORS.mutedCoral,
    borderRadius: WORKIVO_RADII.xl,
    opacity: 0.65,
  },
  card: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.xl,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.borderLine,
    ...WORKIVO_SHADOWS.card3d,
  },
  imageWrapper: {
    height: 190,
    width: "100%",
    position: "relative",
    backgroundColor: WORKIVO_COLORS.darkTeal,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tagPill: {
    position: "absolute",
    bottom: 12,
    left: 14,
    backgroundColor: WORKIVO_COLORS.coral,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: WORKIVO_RADII.pill,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2A1210",
  },
  numberBadge: {
    position: "absolute",
    top: 12,
    right: 14,
    backgroundColor: "rgba(35, 79, 73, 0.85)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  numberText: {
    color: WORKIVO_COLORS.white,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  content: {
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 6,
    fontFamily: WORKIVO_COLORS.cardBg ? "serif" : undefined,
  },
  description: {
    fontSize: 14,
    color: WORKIVO_COLORS.mainText,
    lineHeight: 20,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  metaBadge: {
    backgroundColor: "rgba(247, 237, 234, 0.9)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.sm,
    borderWidth: 1,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: WORKIVO_COLORS.mutedCoral,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: WORKIVO_RADII.md,
    backgroundColor: "rgba(143, 69, 63, 0.08)",
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
  },
});
