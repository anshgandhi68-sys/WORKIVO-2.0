import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../constants/theme";

const STEPS = [
  {
    num: "1",
    title: "Tell us the task",
    desc: "Pick a service, a time and your address.",
  },
  {
    num: "2",
    title: "Meet your pro",
    desc: "A verified worker is matched and you can track them arriving.",
  },
  {
    num: "3",
    title: "Relax",
    desc: "Pay once the job is done and the work is right.",
  },
];

export const ThreeTapsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Three taps to relief</Text>

      <View style={styles.cardsList}>
        {STEPS.map((step) => (
          <View key={step.num} style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{step.num}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{step.title}</Text>
              <Text style={styles.cardDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WORKIVO_COLORS.deepTeal,
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginVertical: 20,
    borderRadius: WORKIVO_RADII.xl,
    marginHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 26,
    color: WORKIVO_COLORS.warmCream,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "700",
  },
  cardsList: {
    gap: 16,
  },
  card: {
    backgroundColor: WORKIVO_COLORS.warmCream,
    borderRadius: WORKIVO_RADII.lg,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderBottomWidth: 3,
    borderBottomColor: WORKIVO_COLORS.card3dShadow,
    ...WORKIVO_SHADOWS.subtle,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WORKIVO_COLORS.coral,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: WORKIVO_COLORS.btn3dShadow,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2A1210",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
    lineHeight: 18,
  },
});
