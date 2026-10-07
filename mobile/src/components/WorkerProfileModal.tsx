import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WorkerProfile } from "../data/workers";
import { WORKIVO_SERVICES } from "../data/services";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";

interface WorkerProfileModalProps {
  visible: boolean;
  onClose: () => void;
  worker: WorkerProfile;
  onBookWorker: (worker: WorkerProfile) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  visible,
  onClose,
  worker,
  onBookWorker,
}) => {
  const insets = useSafeAreaInsets();
  const linkedService =
    WORKIVO_SERVICES.find((s) => s.id === worker.serviceId) || WORKIVO_SERVICES[0];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Header Image */}
            <View style={styles.imageWrapper}>
              <Image source={worker.image} style={styles.image} resizeMode="cover" />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              {worker.verified && (
                <View style={styles.verifiedTag}>
                  <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" />
                  <Text style={styles.verifiedText}>Workivo Background Verified</Text>
                </View>
              )}
            </View>

            <View style={styles.body}>
              <View style={styles.nameRow}>
                <View>
                  <Text style={styles.name}>{worker.name}</Text>
                  <Text style={styles.trade}>{worker.trade}</Text>
                </View>
                <View style={styles.rateBox}>
                  <Text style={styles.rateLabel}>Hourly Rate</Text>
                  <Text style={styles.rateVal}>{worker.hourlyRate}</Text>
                </View>
              </View>

              {/* Stats Bar */}
              <View style={styles.statsBar}>
                <View style={styles.statCol}>
                  <Text style={styles.statVal}>★ {worker.rating}</Text>
                  <Text style={styles.statLabel}>{worker.reviewsCount} reviews</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statVal}>{worker.completedJobs}+</Text>
                  <Text style={styles.statLabel}>Jobs Done</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statVal}>{worker.experienceYears} Years</Text>
                  <Text style={styles.statLabel}>Experience</Text>
                </View>
              </View>

              {/* Bio */}
              <Text style={styles.sectionHeading}>Professional Bio</Text>
              <Text style={styles.bioText}>{worker.bio}</Text>

              {/* Specialties */}
              <Text style={styles.sectionHeading}>Verified Specialties</Text>
              <View style={styles.specialtiesList}>
                {worker.specialties.map((spec, i) => (
                  <View key={i} style={styles.specialtyChip}>
                    <Ionicons name="checkmark-circle" size={14} color={WORKIVO_COLORS.softGreen} />
                    <Text style={styles.specialtyText}>{spec}</Text>
                  </View>
                ))}
              </View>

              {/* Service Details Card */}
              <View style={styles.linkedServiceCard}>
                <View>
                  <Text style={styles.linkedServiceLabel}>Primary Service Category</Text>
                  <Text style={styles.linkedServiceTitle}>{linkedService.title}</Text>
                  <Text style={styles.linkedServicePrice}>{linkedService.priceEstimate}</Text>
                </View>
              </View>

              {/* CTA */}
              <PrimaryButton
                title={`Book ${worker.name.split(" ")[0]} Now`}
                size="lg"
                onPress={() => {
                  onClose();
                  onBookWorker(worker);
                }}
                style={{ marginTop: 20 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(18, 30, 28, 0.75)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: WORKIVO_COLORS.warmCream,
    borderTopLeftRadius: WORKIVO_RADII.xl,
    borderTopRightRadius: WORKIVO_RADII.xl,
    maxHeight: "92%",
    overflow: "hidden",
    ...WORKIVO_SHADOWS.card3d,
  },
  scrollBody: {
    paddingBottom: 30,
  },
  imageWrapper: {
    height: 220,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedTag: {
    position: "absolute",
    bottom: 14,
    left: 16,
    backgroundColor: WORKIVO_COLORS.softGreen,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: WORKIVO_RADII.pill,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  body: {
    padding: 20,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  trade: {
    fontSize: 14,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "600",
    marginTop: 2,
  },
  rateBox: {
    alignItems: "flex-end",
  },
  rateLabel: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
  },
  rateVal: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  statsBar: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.md,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    marginBottom: 20,
  },
  statCol: {
    alignItems: "center",
  },
  statVal: {
    fontSize: 15,
    fontWeight: "700",
    color: WORKIVO_COLORS.mainText,
  },
  statLabel: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: WORKIVO_COLORS.borderLine,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: WORKIVO_COLORS.mainText,
    lineHeight: 22,
    marginBottom: 18,
  },
  specialtiesList: {
    gap: 8,
    marginBottom: 20,
  },
  specialtyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: WORKIVO_COLORS.cardBg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  specialtyText: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
    fontWeight: "600",
  },
  linkedServiceCard: {
    backgroundColor: "rgba(47, 104, 96, 0.08)",
    padding: 14,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1,
    borderColor: "rgba(47, 104, 96, 0.2)",
  },
  linkedServiceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    textTransform: "uppercase",
  },
  linkedServiceTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginTop: 2,
  },
  linkedServicePrice: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
    marginTop: 2,
  },
});
