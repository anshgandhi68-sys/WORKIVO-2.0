import React, { useState } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useApp } from "../context/AppContext";
import { BookingModal } from "../components/BookingModal";
import { ServiceDetailModal } from "../components/ServiceDetailModal";
import { WorkerProfileModal } from "../components/WorkerProfileModal";
import { OnboardingModal } from "../components/OnboardingModal";
import { WORKIVO_SERVICES } from "../data/services";
import { WORKIVO_WORKERS } from "../data/workers";
import { WORKIVO_COLORS } from "../constants/theme";

function AppContent() {
  const {
    hasCompletedOnboarding,
    completeOnboarding,
    selectedService,
    setSelectedService,
    selectedWorker,
    setSelectedWorker,
  } = useApp();

  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

  return (
    <>
      <StatusBar style="light" />
      {Platform.OS === "android" && (
        <RNStatusBar
          backgroundColor={WORKIVO_COLORS.deepTeal}
          barStyle="light-content"
          translucent
        />
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      {/* Global Modals Controlled by Context */}
      {selectedService && (
        <BookingModal
          visible={isBookingModalVisible}
          onClose={() => setIsBookingModalVisible(false)}
          service={selectedService}
        />
      )}

      {selectedService && (
        <ServiceDetailModal
          visible={Boolean(selectedService) && !isBookingModalVisible}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onProceedToBook={(srv) => {
            setSelectedService(srv);
            setIsBookingModalVisible(true);
          }}
        />
      )}

      {selectedWorker && (
        <WorkerProfileModal
          visible={Boolean(selectedWorker)}
          onClose={() => setSelectedWorker(null)}
          worker={selectedWorker}
          onBookWorker={(w) => {
            const linked =
              WORKIVO_SERVICES.find((s) => s.id === w.serviceId) ||
              WORKIVO_SERVICES[0];
            setSelectedWorker(null);
            setSelectedService(linked);
            setIsBookingModalVisible(true);
          }}
        />
      )}

      <OnboardingModal
        visible={!hasCompletedOnboarding}
        onFinish={completeOnboarding}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: WORKIVO_COLORS.deepTeal }}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
