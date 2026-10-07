import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../../components/Header";
import { PrimaryButton } from "../../components/PrimaryButton";
import { MobileBooking } from "../../lib/supabase";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

const STATUS_STEPS: { key: MobileBooking["status"]; label: string; icon: string }[] = [
  { key: "pending", label: "Requested", icon: "create-outline" },
  { key: "matched", label: "Pro Matched", icon: "people-outline" },
  { key: "on_the_way", label: "On The Way", icon: "bicycle-outline" },
  { key: "in_progress", label: "In Progress", icon: "construct-outline" },
  { key: "completed", label: "Completed", icon: "checkmark-circle-outline" },
];

export default function BookingsScreen() {
  const {
    mode,
    bookings,
    activeBooking,
    setActiveBooking,
    updateBookingStatus,
    cancelBooking,
    todaysEarnings,
    completedJobsCount,
  } = useApp();

  const [simulating, setSimulating] = useState(false);

  const currentStepIdx = activeBooking
    ? STATUS_STEPS.findIndex((s) => s.key === activeBooking.status)
    : -1;

  const handleSimulateStatus = (status: MobileBooking["status"]) => {
    if (!activeBooking) return;
    setSimulating(true);
    setTimeout(() => {
      updateBookingStatus(activeBooking.id, status);
      setSimulating(false);
    }, 300);
  };

  const handleCancel = () => {
    if (!activeBooking) return;
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? There is no cancellation fee.",
      [
        { text: "Keep Booking", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => cancelBooking(activeBooking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mode === "customer" ? (
          <>
            {/* Title Header */}
            <View style={styles.titleBox}>
              <Text style={styles.categoryTag}>TRACKING &amp; HISTORY</Text>
              <Text style={styles.pageTitle}>Your Bookings</Text>
              <Text style={styles.pageSubtitle}>
                Live doorstep progress tracking and verified pro assignments.
              </Text>
            </View>

            {activeBooking ? (
              <View style={styles.trackerCard}>
                {/* Booking Header */}
                <View style={styles.trackerTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceTitle}>{activeBooking.serviceName}</Text>
                    <Text style={styles.timeInfo}>
                      📅 {activeBooking.scheduledDate} • ⏰ {activeBooking.scheduledTime.split(" ")[0]}
                    </Text>
                  </View>
                  <View style={styles.bookingIdBadge}>
                    <Text style={styles.bookingIdText}>{activeBooking.id}</Text>
                  </View>
                </View>

                {/* Progress Pipeline */}
                <View style={styles.pipelineBox}>
                  <Text style={styles.pipelineTitle}>LIVE STATUS PIPELINE</Text>
                  <View style={styles.stepsTimeline}>
                    {STATUS_STEPS.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <View key={step.key} style={styles.timelineItem}>
                          <View
                            style={[
                              styles.timelineDot,
                              isDone && styles.timelineDotDone,
                              isCurrent && styles.timelineDotCurrent,
                            ]}
                          >
                            <Ionicons
                              name={isDone ? "checkmark" : (step.icon as any)}
                              size={12}
                              color={isDone ? "#FFFFFF" : WORKIVO_COLORS.mutedText}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={[
                                styles.stepLabel,
                                isCurrent && styles.stepLabelCurrent,
                                isDone && styles.stepLabelDone,
                              ]}
                            >
                              {step.label}
                            </Text>
                          </View>
                          {isCurrent && (
                            <View style={styles.activePill}>
                              <Text style={styles.activePillText}>NOW</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Assigned Pro Card */}
                <View style={styles.proInfoCard}>
                  {activeBooking.proImage ? (
                    <Image
                      source={activeBooking.proImage}
                      style={styles.proAvatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.proAvatarPlaceholder}>
                      <Ionicons name="person" size={24} color={WORKIVO_COLORS.deepTeal} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.proLabel}>ASSIGNED PRO</Text>
                    <Text style={styles.proName}>{activeBooking.proAssignedName}</Text>
                    <Text style={styles.proTrade}>
                      {activeBooking.proTrade} • ★ {activeBooking.proRating}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => alert(`Calling ${activeBooking.proAssignedName}: ${activeBooking.proAssignedPhone}`)}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Address & Notes */}
                <View style={styles.addressBox}>
                  <Text style={styles.addressLabel}>Doorstep Address:</Text>
                  <Text style={styles.addressVal}>📍 {activeBooking.address}</Text>
                  {activeBooking.notes ? (
                    <Text style={styles.notesVal}>📝 &ldquo;{activeBooking.notes}&rdquo;</Text>
                  ) : null}
                </View>

                {/* Simulation Testing Bar */}
                <View style={styles.simBar}>
                  <Text style={styles.simLabel}>⚡ TEST STATUS SIMULATOR</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.simButtonsRow}>
                    {STATUS_STEPS.map((s) => (
                      <TouchableOpacity
                        key={s.key}
                        style={[
                          styles.simBtn,
                          activeBooking.status === s.key && styles.activeSimBtn,
                        ]}
                        onPress={() => handleSimulateStatus(s.key)}
                      >
                        <Text
                          style={[
                            styles.simBtnText,
                            activeBooking.status === s.key && styles.activeSimBtnText,
                          ]}
                        >
                          {s.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Cancellation action if not finished */}
                {activeBooking.status !== "completed" && activeBooking.status !== "cancelled" && (
                  <TouchableOpacity
                    style={styles.cancelLink}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelLinkText}>Cancel Booking</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No bookings found.</Text>
              </View>
            )}

            {/* Other Bookings List */}
            <View style={styles.historySection}>
              <Text style={styles.historyHeading}>All Bookings ({bookings.length})</Text>
              {bookings.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.historyItem,
                    activeBooking?.id === b.id && styles.activeHistoryItem,
                  ]}
                  onPress={() => setActiveBooking(b)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyService}>{b.serviceName}</Text>
                    <Text style={styles.historyMeta}>
                      {b.scheduledDate} • {b.scheduledTime.split(" ")[0]}
                    </Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyId}>{b.id}</Text>
                    <Text
                      style={[
                        styles.historyStatus,
                        { color: b.status === "completed" ? WORKIVO_COLORS.softGreen : WORKIVO_COLORS.mutedCoral },
                      ]}
                    >
                      {b.status.replace("_", " ")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          /* WORKER EARNINGS DASHBOARD */
          <View style={styles.earningsContainer}>
            <View style={styles.titleBox}>
              <Text style={styles.categoryTag}>EARNINGS &amp; PAYOUTS</Text>
              <Text style={styles.pageTitle}>Worker Financials</Text>
              <Text style={styles.pageSubtitle}>
                Instant bank deposits, job commissions, and transparent payouts.
              </Text>
            </View>

            {/* Total Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>TOTAL EARNED TODAY</Text>
              <Text style={styles.balanceAmount}>₹{todaysEarnings}</Text>
              <Text style={styles.balanceSub}>Across 3 completed doorstep jobs</Text>

              <View style={styles.balanceStatsRow}>
                <View style={styles.balanceStatCol}>
                  <Text style={styles.statSubTitle}>Weekly Total</Text>
                  <Text style={styles.statSubVal}>₹9,420</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.balanceStatCol}>
                  <Text style={styles.statSubTitle}>Jobs Completed</Text>
                  <Text style={styles.statSubVal}>{completedJobsCount}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.balanceStatCol}>
                  <Text style={styles.statSubTitle}>Direct Tip Bonus</Text>
                  <Text style={styles.statSubVal}>100% Kept</Text>
                </View>
              </View>
            </View>

            {/* Recent Payout History */}
            <View style={styles.payoutHistoryList}>
              <Text style={styles.historyHeading}>Recent Doorstep Payouts</Text>

              <View style={styles.payoutItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.payoutService}>MCB &amp; Socket Rewiring</Text>
                  <Text style={styles.payoutCustomer}>Rahul Sharma • Bellandur</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.payoutAmt}>+₹420</Text>
                  <Text style={styles.payoutStatus}>Settled to UPI</Text>
                </View>
              </View>

              <View style={styles.payoutItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.payoutService}>Chandelier Fitting</Text>
                  <Text style={styles.payoutCustomer}>Priya Nair • Whitefield</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.payoutAmt}>+₹650</Text>
                  <Text style={styles.payoutStatus}>Settled to UPI</Text>
                </View>
              </View>

              <View style={styles.payoutItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.payoutService}>Inverter Cable Fix</Text>
                  <Text style={styles.payoutCustomer}>Gaurav K. • Koramangala</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.payoutAmt}>+₹410</Text>
                  <Text style={styles.payoutStatus}>Settled to UPI</Text>
                </View>
              </View>
            </View>
          </View>
        )}
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
  trackerCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.xl,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.borderLine,
    ...WORKIVO_SHADOWS.card3d,
  },
  trackerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: WORKIVO_COLORS.borderLine,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  timeInfo: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
    marginTop: 4,
  },
  bookingIdBadge: {
    backgroundColor: WORKIVO_COLORS.coral,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: WORKIVO_RADII.pill,
  },
  bookingIdText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2A1210",
  },
  pipelineBox: {
    marginBottom: 20,
  },
  pipelineTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  stepsTimeline: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: WORKIVO_COLORS.borderLine,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineDotDone: {
    backgroundColor: WORKIVO_COLORS.softGreen,
  },
  timelineDotCurrent: {
    backgroundColor: WORKIVO_COLORS.coral,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: WORKIVO_COLORS.mutedText,
  },
  stepLabelCurrent: {
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "700",
  },
  stepLabelDone: {
    color: WORKIVO_COLORS.mainText,
  },
  activePill: {
    backgroundColor: WORKIVO_COLORS.coral,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: WORKIVO_RADII.sm,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2A1210",
  },
  proInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(47, 104, 96, 0.08)",
    padding: 14,
    borderRadius: WORKIVO_RADII.lg,
    marginBottom: 16,
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.coral,
  },
  proAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WORKIVO_COLORS.borderLine,
    justifyContent: "center",
    alignItems: "center",
  },
  proLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
  },
  proName: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  proTrade: {
    fontSize: 12,
    color: WORKIVO_COLORS.mainText,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WORKIVO_COLORS.softGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  addressBox: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 12,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1,
    borderColor: WORKIVO_COLORS.borderLine,
    marginBottom: 16,
    gap: 4,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedText,
  },
  addressVal: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
  },
  notesVal: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedCoral,
    fontStyle: "italic",
    marginTop: 2,
  },
  simBar: {
    padding: 12,
    borderRadius: WORKIVO_RADII.md,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 12,
  },
  simLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    marginBottom: 8,
  },
  simButtonsRow: {
    gap: 6,
  },
  simBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: WORKIVO_RADII.sm,
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderWidth: 1,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  activeSimBtn: {
    backgroundColor: WORKIVO_COLORS.deepTeal,
    borderColor: WORKIVO_COLORS.deepTeal,
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
  },
  activeSimBtnText: {
    color: "#FFFFFF",
  },
  cancelLink: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelLinkText: {
    fontSize: 13,
    color: WORKIVO_COLORS.cancelled,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    marginHorizontal: 16,
    padding: 30,
    borderRadius: WORKIVO_RADII.lg,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: WORKIVO_COLORS.mutedText,
  },
  historySection: {
    marginHorizontal: 16,
    marginTop: 18,
    gap: 10,
  },
  historyHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 4,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 14,
    borderRadius: WORKIVO_RADII.lg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  activeHistoryItem: {
    borderColor: WORKIVO_COLORS.coral,
    backgroundColor: "rgba(233, 132, 125, 0.08)",
  },
  historyService: {
    fontSize: 15,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  historyMeta: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 2,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyId: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mainText,
  },
  historyStatus: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },

  /* EARNINGS STYLES */
  earningsContainer: {
    paddingTop: 4,
  },
  balanceCard: {
    backgroundColor: WORKIVO_COLORS.deepTeal,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 24,
    borderRadius: WORKIVO_RADII.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D6E9E2",
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 38,
    fontWeight: "700",
    color: "#FFFFFF",
    marginVertical: 4,
  },
  balanceSub: {
    fontSize: 13,
    color: "#A8D5CC",
    marginBottom: 20,
  },
  balanceStatsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingTop: 16,
  },
  balanceStatCol: {
    alignItems: "center",
  },
  statSubTitle: {
    fontSize: 11,
    color: "#A8D5CC",
  },
  statSubVal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  payoutHistoryList: {
    marginHorizontal: 16,
    marginTop: 10,
    gap: 10,
  },
  payoutItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 16,
    borderRadius: WORKIVO_RADII.lg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  payoutService: {
    fontSize: 15,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  payoutCustomer: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 2,
  },
  payoutAmt: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.softGreen,
  },
  payoutStatus: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
    marginTop: 2,
  },
});
