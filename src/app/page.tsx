"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Interactive3DDeck } from "@/components/Interactive3DDeck";
import { HowItWorks3D } from "@/components/HowItWorks3D";
import { JoinAsProSection } from "@/components/JoinAsProSection";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { BookingTrackerModal } from "@/components/BookingTrackerModal";
import { ProOnboardingModal } from "@/components/ProOnboardingModal";
import { CloudConfigDrawer } from "@/components/CloudConfigDrawer";
import { ServiceItem } from "@/data/services";
import { BookingRecord } from "@/lib/supabase";

export default function WorkivoHomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackedBookingId, setTrackedBookingId] = useState<string | null>("WKV-8421");

  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isCloudDrawerOpen, setIsCloudDrawerOpen] = useState(false);

  const [cloudStatus, setCloudStatus] = useState({
    supabaseConnected: false,
    awsConnected: false,
  });

  useEffect(() => {
    fetch("/api/cloud-status")
      .then((res) => res.json())
      .then((data) => {
        setCloudStatus({
          supabaseConnected: data?.supabase?.connected || false,
          awsConnected: data?.aws?.connected || false,
        });
      })
      .catch((err) => {
        console.warn("Could not check cloud status:", err);
      });
  }, []);

  const handleOpenBookingForService = (service?: ServiceItem) => {
    if (service) {
      setSelectedService(service);
    }
    setIsBookingOpen(true);
  };

  const handleBookingCreated = (booking: BookingRecord) => {
    setTrackedBookingId(booking.id);
  };

  return (
    <main>
      {/* 1. Global Navbar with Brand Logo, Theme, and Cloud Status */}
      <Navbar
        onOpenBooking={() => handleOpenBookingForService()}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenCloudDrawer={() => setIsCloudDrawerOpen(true)}
        cloudStatus={cloudStatus}
      />

      {/* 2. Hero Section with 3D Depth Buttons & Social Proof */}
      <Hero
        onBookClick={() => handleOpenBookingForService()}
        onWorkClick={() => setIsProModalOpen(true)}
      />

      {/* 3. The 3D Interactive Scrollytelling Deck & 10 Services */}
      <Interactive3DDeck
        onSelectService={(service) => handleOpenBookingForService(service)}
      />

      {/* 4. Three Taps to Relief - 3D Perspective Tilt Cards */}
      <HowItWorks3D />

      {/* 5. Join as a Pro Section */}
      <JoinAsProSection onJoinClick={() => setIsProModalOpen(true)} />

      {/* 6. Footer */}
      <Footer />

      {/* MODALS */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedService}
        onBookingCreated={handleBookingCreated}
      />

      <BookingTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        selectedBookingId={trackedBookingId}
      />

      <ProOnboardingModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />

      <CloudConfigDrawer
        isOpen={isCloudDrawerOpen}
        onClose={() => setIsCloudDrawerOpen(false)}
      />
    </main>
  );
}
