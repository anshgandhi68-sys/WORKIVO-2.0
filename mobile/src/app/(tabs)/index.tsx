import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../../components/Header";
import { ThreeTapsSection } from "../../components/ThreeTapsSection";
import { PrimaryButton } from "../../components/PrimaryButton";
import { WORKIVO_SERVICES, ServiceCategory } from "../../data/services";
import { WORKIVO_COLORS, WORKIVO_RADII, WORKIVO_SHADOWS } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

export default function HomeScreen() {
  const {
    mode,
    activeBooking,
    openBookingForService,
    setSelectedService,
    workerJobs,
    acceptJob,
    declineJob,
    advanceJobStatus,
    isAcceptingJobs,
    setIsAcceptingJobs,
    todaysEarnings,
    completedJobsCount,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = searchQuery.trim()
    ? WORKIVO_SERVICES.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : WORKIVO_SERVICES;

  const featuredService = WORKIVO_SERVICES[0]; // Electrician
  const incomingJobs = workerJobs.filter((j) => j.status === "incoming");
  const activeJobs = workerJobs.filter(
    (j) => j.status === "accepted" || j.status === "in_progress"
  );

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mode === "customer" ? (
          <>
            {/* 1. Main Greeting */}
            <View style={styles.greetingBox}>
              <Text style={styles.greetingTitle}>What can we help with today?</Text>
              <Text style={styles.greetingSubtitle}>
                Trusted local help right when you need it.
              </Text>
            </View>

            {/* 2. Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color={WORKIVO_COLORS.mutedText} />
              <TextInput
                style={styles.searchInput}
                placeholder="Find a service (electrician, cook, barber...)"
                placeholderTextColor={WORKIVO_COLORS.mutedText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={16} color={WORKIVO_COLORS.mutedText} />
                </TouchableOpacity>
              )}
            </View>

            {/* 3. Upcoming Booking Card (if active) */}
            {activeBooking && activeBooking.status !== "completed" && (
              <View style={styles.activeBookingCard}>
                <View style={styles.activeBookingTop}>
                  <View style={styles.statusChip}>
                    <Text style={styles.statusChipText}>
                      ● {activeBooking.status.replace("_", " ").toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.activeBookingRef}>{activeBooking.id}</Text>
                </View>

                <View style={styles.activeBookingBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activeBookingTitle}>
                      {activeBooking.serviceName}
                    </Text>
                    <Text style={styles.activeBookingTime}>
                      {activeBooking.scheduledDate} • {activeBooking.scheduledTime.split(" ")[0]}
                    </Text>
                    <Text style={styles.activeBookingPro}>
                      Pro: {activeBooking.proAssignedName} (★ {activeBooking.proRating})
                    </Text>
                  </View>
                  {activeBooking.proImage && (
                    <Image
                      source={activeBooking.proImage}
                      style={styles.activeBookingAvatar}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            )}

            {/* 4. Featured Service Card */}
            {!searchQuery && (
              <View style={styles.featuredContainer}>
                <View style={styles.featuredHeaderRow}>
                  <Text style={styles.sectionLabel}>FEATURED SERVICE</Text>
                  <Text style={styles.featuredTopBadge}>Top Booked This Week</Text>
                </View>

                <View style={styles.featuredCard}>
                  <Image
                    source={featuredService.image}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                  <View style={styles.featuredOverlay}>
                    <View style={styles.featuredTagPill}>
                      <Text style={styles.featuredTagText}>{featuredService.badge}</Text>
                    </View>
                    <Text style={styles.featuredTitle}>{featuredService.title}</Text>
                    <Text style={styles.featuredDesc}>{featuredService.description}</Text>
                    <View style={styles.featuredFooter}>
                      <Text style={styles.featuredPrice}>
                        {featuredService.priceEstimate} • {featuredService.duration}
                      </Text>
                      <PrimaryButton
                        title="Book Now"
                        size="sm"
                        onPress={() => openBookingForService(featuredService)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* 5. 10 Service Categories Grid */}
            <View style={styles.categoriesSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.categoriesSectionTitle}>All 10 Services</Text>
                <Text style={styles.categoriesCount}>
                  {filteredServices.length} available
                </Text>
              </View>

              <View style={styles.categoriesGrid}>
                {filteredServices.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.categoryTile}
                    activeOpacity={0.8}
                    onPress={() => setSelectedService(service)}
                  >
                    <Image
                      source={service.image}
                      style={styles.categoryTileImage}
                      resizeMode="cover"
                    />
                    <View style={styles.categoryTileBody}>
                      <Text style={styles.categoryTileNumber}>{service.number}</Text>
                      <Text style={styles.categoryTileTitle}>{service.title}</Text>
                      <Text style={styles.categoryTilePrice}>
                        {service.priceEstimate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 6. Three Taps to Relief Section */}
            {!searchQuery && <ThreeTapsSection />}

            {/* 7. Reassurance Banner */}
            <View style={styles.reassuranceCard}>
              <View style={styles.reassuranceRow}>
                <Ionicons name="shield-checkmark" size={24} color={WORKIVO_COLORS.softGreen} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reassuranceTitle}>
                    100% Verified Doorstep Assurance
                  </Text>
                  <Text style={styles.reassuranceDesc}>
                    Every professional passes government ID checks and skill vetting. Free re-work guaranteed if not satisfied.
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* WORKER MODE DASHBOARD */
          <View style={styles.workerContainer}>
            {/* Pro Status & Duty Switch */}
            <View style={styles.workerStatusCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.workerRoleTag}>TIER 1 CERTIFIED PRO</Text>
                <Text style={styles.workerName}>Rajesh Kumar</Text>
                <Text style={styles.workerTrade}>Master Electrician • Bengaluru</Text>
              </View>

              <View style={styles.switchBox}>
                <Text style={styles.switchLabel}>
                  {isAcceptingJobs ? "Online" : "Offline"}
                </Text>
                <Switch
                  value={isAcceptingJobs}
                  onValueChange={setIsAcceptingJobs}
                  trackColor={{ false: "#D1D5DB", true: WORKIVO_COLORS.softGreen }}
                  thumbColor={WORKIVO_COLORS.white}
                />
              </View>
            </View>

            {/* Earnings Summary Row */}
            <View style={styles.earningsRow}>
              <View style={styles.earningBox}>
                <Text style={styles.earningLabel}>Today&apos;s Payout</Text>
                <Text style={styles.earningVal}>₹{todaysEarnings}</Text>
              </View>
              <View style={styles.earningBox}>
                <Text style={styles.earningLabel}>Jobs Completed</Text>
                <Text style={styles.earningVal}>{completedJobsCount}</Text>
              </View>
              <View style={styles.earningBox}>
                <Text style={styles.earningLabel}>Rating</Text>
                <Text style={styles.earningVal}>★ 4.9</Text>
              </View>
            </View>

            {/* Incoming Job Requests */}
            <View style={styles.jobSectionHeader}>
              <Text style={styles.jobSectionTitle}>Incoming Job Requests</Text>
              <Text style={styles.jobCountBadge}>{incomingJobs.length}</Text>
            </View>

            {incomingJobs.length === 0 ? (
              <View style={styles.emptyJobsCard}>
                <Text style={styles.emptyJobsText}>
                  No pending requests right now. Stay online to receive instant dispatches!
                </Text>
              </View>
            ) : (
              incomingJobs.map((job) => (
                <View key={job.id} style={styles.jobCard}>
                  <View style={styles.jobTopRow}>
                    <Text style={styles.jobServiceName}>{job.serviceName}</Text>
                    <Text style={styles.jobPayout}>+₹{job.payout}</Text>
                  </View>

                  <Text style={styles.jobTime}>⏰ {job.scheduledTime}</Text>
                  <Text style={styles.jobAddress}>📍 {job.address}</Text>
                  <Text style={styles.jobCustomer}>Customer: {job.customerName}</Text>

                  <View style={styles.jobActionsRow}>
                    <TouchableOpacity
                      style={styles.declineBtn}
                      onPress={() => declineJob(job.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <PrimaryButton
                        title="Accept Job"
                        size="sm"
                        onPress={() => acceptJob(job.id)}
                      />
                    </View>
                  </View>
                </View>
              ))
            )}

            {/* Active / In-Progress Jobs */}
            <View style={[styles.jobSectionHeader, { marginTop: 24 }]}>
              <Text style={styles.jobSectionTitle}>Active &amp; In-Progress Jobs</Text>
              <Text style={styles.jobCountBadge}>{activeJobs.length}</Text>
            </View>

            {activeJobs.map((job) => (
              <View key={job.id} style={[styles.jobCard, styles.activeJobCard]}>
                <View style={styles.jobTopRow}>
                  <View>
                    <Text style={styles.jobServiceName}>{job.serviceName}</Text>
                    <Text style={styles.jobStatusLabel}>
                      ● STATUS: {job.status.replace("_", " ").toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.jobPayout}>+₹{job.payout}</Text>
                </View>

                <Text style={styles.jobTime}>⏰ {job.scheduledTime}</Text>
                <Text style={styles.jobAddress}>📍 {job.address}</Text>
                <Text style={styles.jobCustomer}>
                  Customer: {job.customerName} ({job.customerPhone})
                </Text>

                <View style={{ marginTop: 14 }}>
                  <PrimaryButton
                    title={
                      job.status === "accepted"
                        ? "Start Work (Set In Progress)"
                        : "Complete Job & Collect Payment"
                    }
                    size="sm"
                    onPress={() => advanceJobStatus(job.id)}
                  />
                </View>
              </View>
            ))}
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
  greetingBox: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: WORKIVO_COLORS.mutedText,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WORKIVO_COLORS.cardBg,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: WORKIVO_RADII.lg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    gap: 8,
    ...WORKIVO_SHADOWS.subtle,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: WORKIVO_COLORS.mainText,
  },
  activeBookingCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: WORKIVO_RADII.lg,
    padding: 16,
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.coral,
    ...WORKIVO_SHADOWS.tactileBtn,
  },
  activeBookingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusChip: {
    backgroundColor: "rgba(233, 132, 125, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.sm,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
  },
  activeBookingRef: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  activeBookingBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activeBookingTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  activeBookingTime: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
    marginVertical: 2,
  },
  activeBookingPro: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "600",
  },
  activeBookingAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.coral,
  },
  featuredContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  featuredHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
    letterSpacing: 0.5,
  },
  featuredTopBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: WORKIVO_COLORS.softGreen,
  },
  featuredCard: {
    height: 240,
    borderRadius: WORKIVO_RADII.xl,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.borderLine,
    ...WORKIVO_SHADOWS.card3d,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(35, 79, 73, 0.65)",
    padding: 18,
    justifyContent: "flex-end",
  },
  featuredTagPill: {
    alignSelf: "flex-start",
    backgroundColor: WORKIVO_COLORS.coral,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: WORKIVO_RADII.pill,
    marginBottom: 8,
  },
  featuredTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2A1210",
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: WORKIVO_COLORS.white,
    marginBottom: 4,
  },
  featuredDesc: {
    fontSize: 13,
    color: "#D6E9E2",
    marginBottom: 12,
    lineHeight: 18,
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: WORKIVO_COLORS.white,
  },
  categoriesSection: {
    marginHorizontal: 16,
    marginVertical: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  categoriesSectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  categoriesCount: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryTile: {
    width: "48%",
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.lg,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    ...WORKIVO_SHADOWS.subtle,
  },
  categoryTileImage: {
    width: "100%",
    height: 96,
  },
  categoryTileBody: {
    padding: 10,
  },
  categoryTileNumber: {
    fontSize: 10,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
  },
  categoryTileTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginTop: 2,
  },
  categoryTilePrice: {
    fontSize: 12,
    color: WORKIVO_COLORS.mainText,
    marginTop: 2,
    fontWeight: "600",
  },
  reassuranceCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 16,
    borderRadius: WORKIVO_RADII.lg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  reassuranceRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  reassuranceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 4,
  },
  reassuranceDesc: {
    fontSize: 12,
    color: WORKIVO_COLORS.mainText,
    lineHeight: 17,
  },

  /* WORKER MODE STYLES */
  workerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  workerStatusCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.lg,
    padding: 18,
    borderWidth: 2,
    borderColor: WORKIVO_COLORS.deepTeal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  workerRoleTag: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.softGreen,
    letterSpacing: 0.5,
  },
  workerName: {
    fontSize: 20,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginTop: 2,
  },
  workerTrade: {
    fontSize: 13,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "600",
  },
  switchBox: {
    alignItems: "center",
    gap: 4,
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  earningsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  earningBox: {
    flex: 1,
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 12,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    alignItems: "center",
  },
  earningLabel: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
    marginBottom: 4,
  },
  earningVal: {
    fontSize: 18,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  jobSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  jobSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  jobCountBadge: {
    backgroundColor: WORKIVO_COLORS.coral,
    color: "#2A1210",
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: WORKIVO_RADII.pill,
  },
  emptyJobsCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 24,
    borderRadius: WORKIVO_RADII.lg,
    borderWidth: 1,
    borderColor: WORKIVO_COLORS.borderLine,
    alignItems: "center",
  },
  emptyJobsText: {
    fontSize: 13,
    color: WORKIVO_COLORS.mutedText,
    textAlign: "center",
    lineHeight: 18,
  },
  jobCard: {
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    marginBottom: 12,
    gap: 6,
  },
  activeJobCard: {
    borderColor: WORKIVO_COLORS.softGreen,
    borderWidth: 2,
  },
  jobTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobServiceName: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  jobStatusLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: WORKIVO_COLORS.softGreen,
    marginTop: 2,
  },
  jobPayout: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.softGreen,
  },
  jobTime: {
    fontSize: 13,
    color: WORKIVO_COLORS.mainText,
  },
  jobAddress: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
  },
  jobCustomer: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedCoral,
    fontWeight: "600",
  },
  jobActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  declineBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: WORKIVO_RADII.md,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  declineText: {
    fontSize: 13,
    fontWeight: "700",
    color: WORKIVO_COLORS.cancelled,
  },
});
