import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../../components/Header";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { isSupabaseConfigured } from "../../lib/supabase";

export default function ProfileScreen() {
  const { mode, toggleMode, resetOnboarding } = useApp();

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleBox}>
          <Text style={styles.categoryTag}>ACCOUNT &amp; SETTINGS</Text>
          <Text style={styles.pageTitle}>Workivo Profile</Text>
          <Text style={styles.pageSubtitle}>
            Manage your personal preferences, role modes, and cloud connection.
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>
              {mode === "worker" ? "Rajesh Kumar" : "Aarav Patel"}
            </Text>
            <Text style={styles.userPhone}>+91 98765 43210</Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>
                {mode === "worker" ? "Verified Master Electrician" : "Workivo Prime Customer"}
              </Text>
            </View>
          </View>
        </View>

        {/* Mode Switcher Banner */}
        <View style={styles.modeCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.modeCardTitle}>Switch App Experience</Text>
            <Text style={styles.modeCardSubtitle}>
              Current mode: <strong>{mode === "worker" ? "Worker Mode" : "Customer Mode"}</strong>
            </Text>
          </View>
          <Switch
            value={mode === "worker"}
            onValueChange={toggleMode}
            trackColor={{ false: "#D1D5DB", true: WORKIVO_COLORS.coral }}
            thumbColor={WORKIVO_COLORS.white}
          />
        </View>

        {/* Settings Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>PREFERENCES &amp; SECURITY</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={resetOnboarding}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="sparkles" size={18} color={WORKIVO_COLORS.deepTeal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Replay Onboarding Tour</Text>
              <Text style={styles.menuSub}>View the 3 brand intro slides</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={WORKIVO_COLORS.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => alert("Notification preferences updated.")}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="notifications" size={18} color={WORKIVO_COLORS.deepTeal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Doorstep Arrival Alerts</Text>
              <Text style={styles.menuSub}>SMS, WhatsApp &amp; In-app alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={WORKIVO_COLORS.mutedText} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => alert("Saved addresses: HSR Layout, Bellandur")}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="location" size={18} color={WORKIVO_COLORS.deepTeal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Saved Addresses</Text>
              <Text style={styles.menuSub}>Home, Office, Parents</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={WORKIVO_COLORS.mutedText} />
          </TouchableOpacity>
        </View>

        {/* Cloud Integration Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>CLOUD BACKEND STATUS</Text>

          <View style={styles.cloudInfoRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isSupabaseConfigured ? WORKIVO_COLORS.softGreen : "#F59E0B" },
                ]}
              />
              <Text style={styles.cloudLabel}>Supabase PostgreSQL Database</Text>
            </View>
            <Text style={styles.cloudStatus}>
              {isSupabaseConfigured ? "Connected" : "Local Store Active"}
            </Text>
          </View>

          <View style={styles.cloudInfoRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={[styles.statusDot, { backgroundColor: WORKIVO_COLORS.softGreen }]} />
              <Text style={styles.cloudLabel}>AWS S3 Media &amp; APIs</Text>
            </View>
            <Text style={styles.cloudStatus}>ap-south-1 Active</Text>
          </View>

          <Text style={styles.cloudDesc}>
            All bookings, pro registrations, and status transitions persist reliably across sessions.
          </Text>
        </View>

        {/* Support & Version */}
        <View style={styles.supportBox}>
          <Text style={styles.brandTagline}>WORKIVO · Small task, Big relief.</Text>
          <Text style={styles.versionText}>Mobile Edition v2.0 • React Native &amp; Expo Router</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WORKIVO_COLORS.warmCream,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleBox: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginTop: 2,
  },
  pageSubtitle: {
    fontSize: 14,
    color: WORKIVO_COLORS.mainText,
    marginTop: 4,
  },
  profileCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: WORKIVO_RADII.xl,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.borderLine,
    ...WORKIVO_SHADOWS.subtle,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: WORKIVO_COLORS.deepTeal,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.coral,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  userPhone: {
    fontSize: 13,
    color: WORKIVO_COLORS.mutedText,
    marginVertical: 2,
  },
  userBadge: {
    backgroundColor: "rgba(107, 178, 110, 0.15)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.sm,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  userBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.softGreen,
  },
  modeCard: {
    backgroundColor: "rgba(233, 132, 125, 0.15)",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: WORKIVO_RADII.lg,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.coral,
  },
  modeCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  modeCardSubtitle: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: WORKIVO_RADII.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    ...WORKIVO_SHADOWS.subtle,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: WORKIVO_RADII.md,
    backgroundColor: "rgba(47, 104, 96, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.mainText,
  },
  menuSub: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(227, 210, 204, 0.5)",
    marginVertical: 4,
  },
  cloudInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cloudLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
  },
  cloudStatus: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
  },
  cloudDesc: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 8,
    lineHeight: 18,
  },
  supportBox: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  brandTagline: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  versionText: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 4,
  },
});
