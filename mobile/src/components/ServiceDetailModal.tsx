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
import { ServiceCategory } from "../data/services";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";

interface ServiceDetailModalProps {
  visible: boolean;
  onClose: () => void;
  service: ServiceCategory;
  onProceedToBook: (service: ServiceCategory) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  visible,
  onClose,
  service,
  onProceedToBook,
}) => {
  const insets = useSafeAreaInsets();

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
              <Image source={service.image} style={styles.image} resizeMode="cover" />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{service.number} • {service.badge}</Text>
              </View>
            </View>

            <View style={styles.body}>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.shortDesc}>{service.description}</Text>

              {/* Specs Chips */}
              <View style={styles.metaRow}>
                <View style={styles.chip}>
                  <Ionicons name="time-outline" size={14} color={WORKIVO_COLORS.mutedCoral} />
                  <Text style={styles.chipText}>{service.duration}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="wallet-outline" size={14} color={WORKIVO_COLORS.mutedCoral} />
                  <Text style={styles.chipText}>{service.priceEstimate}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.chipText}>{service.rating} ({service.reviewsCount} reviews)</Text>
                </View>
              </View>

              {/* Long Description */}
              <Text style={styles.sectionHeading}>About this Service</Text>
              <Text style={styles.longDesc}>{service.longDescription}</Text>

              {/* Popular Tasks Checklist */}
              <Text style={styles.sectionHeading}>Common Doorstep Tasks</Text>
              <View style={styles.tasksList}>
                {service.popularTasks.map((task, i) => (
                  <View key={i} style={styles.taskItem}>
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-sharp" size={12} color="#FFFFFF" />
                    </View>
                    <Text style={styles.taskText}>{task}</Text>
                  </View>
                ))}
              </View>

              {/* Guarantees Box */}
              <View style={styles.guaranteeBox}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Ionicons name="shield-checkmark" size={16} color={WORKIVO_COLORS.deepTeal} />
                  <Text style={styles.guaranteeTitle}>Workivo Trust Assurance</Text>
                </View>
                <Text style={styles.guaranteeDesc}>
                  Every pro carries an ITI or background verification. Re-work guaranteed if you are not 100% satisfied.
                </Text>
              </View>

              {/* Action Button */}
              <PrimaryButton
                title={`Proceed to Book (${service.priceEstimate})`}
                size="lg"
                onPress={() => {
                  onClose();
                  onProceedToBook(service);
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
  badgePill: {
    position: "absolute",
    bottom: 14,
    left: 16,
    backgroundColor: WORKIVO_COLORS.coral,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: WORKIVO_RADII.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2A1210",
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 6,
  },
  shortDesc: {
    fontSize: 15,
    color: WORKIVO_COLORS.mainText,
    marginBottom: 16,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: WORKIVO_COLORS.cardBg,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginTop: 8,
    marginBottom: 10,
  },
  longDesc: {
    fontSize: 14,
    color: WORKIVO_COLORS.mainText,
    lineHeight: 22,
    marginBottom: 16,
  },
  tasksList: {
    gap: 8,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 12,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: WORKIVO_COLORS.softGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  taskText: {
    fontSize: 13,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
    flex: 1,
  },
  guaranteeBox: {
    backgroundColor: "rgba(47, 104, 96, 0.08)",
    padding: 14,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1,
    borderColor: "rgba(47, 104, 96, 0.2)",
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  guaranteeDesc: {
    fontSize: 12,
    color: WORKIVO_COLORS.mainText,
    lineHeight: 18,
  },
});
