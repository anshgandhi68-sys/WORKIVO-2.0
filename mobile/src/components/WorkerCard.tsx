import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkerProfile } from "../data/workers";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";

interface WorkerCardProps {
  worker: WorkerProfile;
  onBookPress: (worker: WorkerProfile) => void;
  onProfilePress: (worker: WorkerProfile) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onBookPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onProfilePress(worker)}
          style={styles.avatarWrapper}
        >
          <Image source={worker.image} style={styles.avatar} resizeMode="cover" />
          {worker.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-sharp" size={10} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.infoCol}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => onProfilePress(worker)}>
            <Text style={styles.name}>{worker.name}</Text>
          </TouchableOpacity>
          <Text style={styles.trade}>{worker.trade}</Text>

          <View style={styles.statsRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{worker.rating}</Text>
              <Text style={styles.reviewsCount}>({worker.reviewsCount})</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.expText}>{worker.experienceYears}y exp</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.jobsText}>{worker.completedJobs} jobs</Text>
          </View>
        </View>

        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Rate</Text>
          <Text style={styles.priceVal}>{worker.hourlyRate}</Text>
        </View>
      </View>

      {/* Specialties Tags */}
      <View style={styles.tagsRow}>
        {worker.specialties.map((spec, i) => (
          <View key={i} style={styles.tagBadge}>
            <Text style={styles.tagText}>{spec}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => onProfilePress(worker)}
          activeOpacity={0.7}
        >
          <Text style={styles.profileBtnText}>View Bio &amp; Reviews</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <PrimaryButton
            title="Book Pro"
            size="sm"
            onPress={() => onBookPress(worker)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.lg,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    ...WORKIVO_SHADOWS.subtle,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.coral,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -3,
    right: -3,
    backgroundColor: WORKIVO_COLORS.softGreen,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.mainText,
    marginBottom: 2,
  },
  trade: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "600",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mainText,
  },
  reviewsCount: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
  },
  dot: {
    fontSize: 12,
    color: WORKIVO_COLORS.borderLine,
  },
  expText: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
  },
  jobsText: {
    fontSize: 11,
    color: WORKIVO_COLORS.softGreen,
    fontWeight: "600",
  },
  priceCol: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
  },
  priceVal: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(227, 210, 204, 0.5)",
  },
  tagBadge: {
    backgroundColor: "rgba(47, 104, 96, 0.08)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.sm,
  },
  tagText: {
    fontSize: 11,
    color: WORKIVO_COLORS.deepTeal,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  profileBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: WORKIVO_RADII.md,
    backgroundColor: "rgba(143, 69, 63, 0.08)",
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
  },
});
