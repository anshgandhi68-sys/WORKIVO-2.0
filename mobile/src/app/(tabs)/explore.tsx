import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Header } from "../../components/Header";
import { ServiceStoryCard } from "../../components/ServiceStoryCard";
import { WorkerCard } from "../../components/WorkerCard";
import { WORKIVO_SERVICES, ServiceCategory } from "../../data/services";
import { WORKIVO_WORKERS, WorkerProfile } from "../../data/workers";
import { WORKIVO_COLORS, WORKIVO_RADII } from "../../constants/theme";
import { useApp } from "../../context/AppContext";

const FILTERS = ["All 10", "Home Repairs", "Personal Care", "Cleaning & Moves"];

export const FILTER_MAP: Record<string, string[]> = {
  "All 10": [
    "electrician",
    "cook",
    "barber",
    "beauty",
    "carpenter",
    "plumber",
    "cleaning",
    "ac-service",
    "movers",
    "laundry",
  ],
  "Home Repairs": ["electrician", "plumber", "carpenter", "ac-service"],
  "Personal Care": ["cook", "barber", "beauty"],
  "Cleaning & Moves": ["cleaning", "movers", "laundry"],
};

export default function ExploreScreen() {
  const {
    mode,
    openBookingForService,
    setSelectedService,
    setSelectedWorker,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState("All 10");
  const [activeSubTab, setActiveSubTab] = useState<"services" | "pros">("services");

  const allowedIds = FILTER_MAP[activeFilter] || FILTER_MAP["All 10"];
  const filteredServices = WORKIVO_SERVICES.filter((s) => allowedIds.includes(s.id));

  const handleBookService = (service: ServiceCategory) => {
    openBookingForService(service);
  };

  const handleDetailService = (service: ServiceCategory) => {
    setSelectedService(service);
  };

  const handleBookWorker = (worker: WorkerProfile) => {
    const linked = WORKIVO_SERVICES.find((s) => s.id === worker.serviceId);
    if (linked) {
      openBookingForService(linked);
    }
  };

  const handleProfileWorker = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
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
            {/* Header Titles */}
            <View style={styles.topTitleBox}>
              <Text style={styles.pageCategoryTag}>DISCOVERY &amp; MARKETPLACE</Text>
              <Text style={styles.pageTitle}>Explore All Services</Text>
              <Text style={styles.pageSubtitle}>
                Verified local experts delivering craft and care to your doorstep.
              </Text>
            </View>

            {/* Toggle: Services / Pros */}
            <View style={styles.switchTabsRow}>
              <TouchableOpacity
                style={[styles.switchTab, activeSubTab === "services" && styles.activeSwitchTab]}
                onPress={() => setActiveSubTab("services")}
              >
                <Text
                  style={[
                    styles.switchTabText,
                    activeSubTab === "services" && styles.activeSwitchTabText,
                  ]}
                >
                  10 Service Stories
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.switchTab, activeSubTab === "pros" && styles.activeSwitchTab]}
                onPress={() => setActiveSubTab("pros")}
              >
                <Text
                  style={[
                    styles.switchTabText,
                    activeSubTab === "pros" && styles.activeSwitchTabText,
                  ]}
                >
                  Verified Workers ({WORKIVO_WORKERS.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Filter Pills (when in services tab) */}
            {activeSubTab === "services" && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScroll}
              >
                {FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.filterChip, activeFilter === f && styles.activeFilterChip]}
                    onPress={() => setActiveFilter(f)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        activeFilter === f && styles.activeFilterChipText,
                      ]}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Content view */}
            {activeSubTab === "services" ? (
              <View>
                {filteredServices.map((service) => (
                  <ServiceStoryCard
                    key={service.id}
                    service={service}
                    onBookPress={handleBookService}
                    onDetailPress={handleDetailService}
                  />
                ))}
              </View>
            ) : (
              <View>
                <Text style={styles.prosSectionHeading}>
                  Direct Pro Profiles &amp; Ratings
                </Text>
                {WORKIVO_WORKERS.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onBookPress={handleBookWorker}
                    onProfilePress={handleProfileWorker}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          /* WORKER MODE SCHEDULE VIEW */
          <View style={styles.workerScheduleContainer}>
            <View style={styles.topTitleBox}>
              <Text style={styles.pageCategoryTag}>CALENDAR &amp; ROSTER</Text>
              <Text style={styles.pageTitle}>Job Schedule</Text>
              <Text style={styles.pageSubtitle}>
                Manage your daily appointments and doorstep arrival times.
              </Text>
            </View>

            {/* Calendar Chips */}
            <View style={styles.calendarStrip}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <View
                  key={day}
                  style={[styles.calendarDayBox, i === 2 && styles.activeDayBox]}
                >
                  <Text style={[styles.dayName, i === 2 && styles.activeDayText]}>
                    {day}
                  </Text>
                  <Text style={[styles.dayDate, i === 2 && styles.activeDayText]}>
                    {7 + i}
                  </Text>
                </View>
              ))}
            </View>

            {/* Today's Roster */}
            <View style={styles.rosterList}>
              <Text style={styles.rosterHeading}>Today&apos;s Confirmed Jobs</Text>

              <View style={styles.rosterItem}>
                <View style={styles.timeTag}>
                  <Text style={styles.timeTagText}>10:30 AM</Text>
                </View>
                <View style={styles.rosterItemBody}>
                  <Text style={styles.rosterItemTitle}>MCB Tripping Fix</Text>
                  <Text style={styles.rosterItemAddress}>Bellandur • Rahul Sharma</Text>
                  <Text style={styles.rosterItemPayout}>Payout: ₹420</Text>
                </View>
              </View>

              <View style={styles.rosterItem}>
                <View style={[styles.timeTag, { backgroundColor: WORKIVO_COLORS.deepTeal }]}>
                  <Text style={[styles.timeTagText, { color: "#FFFFFF" }]}>03:00 PM</Text>
                </View>
                <View style={styles.rosterItemBody}>
                  <Text style={styles.rosterItemTitle}>Chandelier &amp; Fan Fitting</Text>
                  <Text style={styles.rosterItemAddress}>Whitefield • Priya Nair</Text>
                  <Text style={styles.rosterItemPayout}>Payout: ₹650</Text>
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
  topTitleBox: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  pageCategoryTag: {
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
  switchTabsRow: {
    flexDirection: "row",
    backgroundColor: WORKIVO_COLORS.cardBg,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: WORKIVO_RADII.lg,
    padding: 4,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: WORKIVO_RADII.md,
  },
  activeSwitchTab: {
    backgroundColor: WORKIVO_COLORS.deepTeal,
  },
  switchTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedText,
  },
  activeSwitchTabText: {
    color: "#FFFFFF",
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 6,
    marginBottom: 4,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: WORKIVO_RADII.pill,
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  activeFilterChip: {
    backgroundColor: WORKIVO_COLORS.coral,
    borderColor: WORKIVO_COLORS.btn3dShadow,
    borderBottomWidth: 2.5,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: WORKIVO_COLORS.mainText,
  },
  activeFilterChipText: {
    color: "#2A1210",
    fontWeight: "700",
  },
  prosSectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },

  /* WORKER SCHEDULE STYLES */
  workerScheduleContainer: {
    paddingTop: 4,
  },
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 14,
  },
  calendarDayBox: {
    width: 44,
    height: 60,
    backgroundColor: WORKIVO_COLORS.cardBg,
    borderRadius: WORKIVO_RADII.md,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
    justifyContent: "center",
    alignItems: "center",
  },
  activeDayBox: {
    backgroundColor: WORKIVO_COLORS.coral,
    borderColor: WORKIVO_COLORS.btn3dShadow,
    borderBottomWidth: 3,
  },
  dayName: {
    fontSize: 11,
    color: WORKIVO_COLORS.mutedText,
    fontWeight: "600",
  },
  dayDate: {
    fontSize: 16,
    fontWeight: "700",
    color: WORKIVO_COLORS.mainText,
    marginTop: 2,
  },
  activeDayText: {
    color: "#2A1210",
    fontWeight: "700",
  },
  rosterList: {
    marginHorizontal: 16,
    marginTop: 10,
    gap: 12,
  },
  rosterHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
    marginBottom: 4,
  },
  rosterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: WORKIVO_COLORS.cardBg,
    padding: 16,
    borderRadius: WORKIVO_RADII.lg,
    borderWidth: 1.5,
    borderColor: WORKIVO_COLORS.borderLine,
  },
  timeTag: {
    backgroundColor: "rgba(233, 132, 125, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: WORKIVO_RADII.md,
  },
  timeTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: WORKIVO_COLORS.mutedCoral,
  },
  rosterItemBody: {
    flex: 1,
  },
  rosterItemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: WORKIVO_COLORS.deepTeal,
  },
  rosterItemAddress: {
    fontSize: 12,
    color: WORKIVO_COLORS.mutedText,
    marginVertical: 2,
  },
  rosterItemPayout: {
    fontSize: 13,
    fontWeight: "700",
    color: WORKIVO_COLORS.softGreen,
  },
});
