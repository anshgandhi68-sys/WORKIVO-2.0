import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MobileBooking,
  WorkerJob,
  INITIAL_BOOKINGS,
  INITIAL_WORKER_JOBS,
  fetchRemoteBookings,
  saveRemoteBooking,
  updateRemoteBookingStatus,
} from "../lib/supabase";
import { ServiceCategory, WORKIVO_SERVICES } from "../data/services";
import { WorkerProfile, WORKIVO_WORKERS } from "../data/workers";

export type AppMode = "customer" | "worker";

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Customer Bookings
  bookings: MobileBooking[];
  activeBooking: MobileBooking | null;
  setActiveBooking: (b: MobileBooking | null) => void;
  createBooking: (newBookingData: Omit<MobileBooking, "id" | "createdAt" | "status" | "proAssignedName" | "proAssignedPhone" | "proRating" | "proTrade" | "proImage">) => MobileBooking;
  updateBookingStatus: (id: string, status: MobileBooking["status"]) => void;
  cancelBooking: (id: string) => void;

  // Selected entities for modals
  selectedService: ServiceCategory | null;
  setSelectedService: (s: ServiceCategory | null) => void;
  selectedWorker: WorkerProfile | null;
  setSelectedWorker: (w: WorkerProfile | null) => void;

  // Worker Mode State
  workerJobs: WorkerJob[];
  isAcceptingJobs: boolean;
  setIsAcceptingJobs: (val: boolean) => void;
  acceptJob: (jobId: string) => void;
  declineJob: (jobId: string) => void;
  advanceJobStatus: (jobId: string) => void;
  todaysEarnings: number;
  completedJobsCount: number;

  // Quick action helpers
  openBookingForService: (service: ServiceCategory) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>("customer");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true); // Default true for instant exploration, user can replay anytime

  const [bookings, setBookings] = useState<MobileBooking[]>(INITIAL_BOOKINGS);
  const [activeBooking, setActiveBooking] = useState<MobileBooking | null>(INITIAL_BOOKINGS[0]);

  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(WORKIVO_SERVICES[0]);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(WORKIVO_WORKERS[0]);

  const [workerJobs, setWorkerJobs] = useState<WorkerJob[]>(INITIAL_WORKER_JOBS);
  const [isAcceptingJobs, setIsAcceptingJobs] = useState(true);
  const [todaysEarnings, setTodaysEarnings] = useState(1480);
  const [completedJobsCount, setCompletedJobsCount] = useState(38);

  // Sync with live Supabase database on launch
  useEffect(() => {
    fetchRemoteBookings().then((remote) => {
      if (remote && remote.length > 0) {
        setBookings(remote);
        const active =
          remote.find((b) => b.status !== "completed" && b.status !== "cancelled") ||
          remote[0];
        setActiveBooking(active);
      }
    });
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === "customer" ? "worker" : "customer"));
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
  };

  const createBooking = (
    newBookingData: Omit<
      MobileBooking,
      "id" | "createdAt" | "status" | "proAssignedName" | "proAssignedPhone" | "proRating" | "proTrade" | "proImage"
    >
  ): MobileBooking => {
    // Match with corresponding worker
    const matchedWorker =
      WORKIVO_WORKERS.find((w) => w.serviceId === newBookingData.serviceId) ||
      WORKIVO_WORKERS[0];

    const newBooking: MobileBooking = {
      ...newBookingData,
      id: `WKV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "matched",
      proAssignedName: matchedWorker.name,
      proAssignedPhone: "+91 98112 34567",
      proRating: matchedWorker.rating,
      proTrade: matchedWorker.trade,
      proImage: matchedWorker.image,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBooking(newBooking);

    // Asynchronously persist to live Supabase PostgreSQL database
    saveRemoteBooking(newBooking).catch((err) =>
      console.warn("Background Supabase save error:", err)
    );

    // Also inject as job in worker feed
    const newJob: WorkerJob = {
      id: `JOB-${Math.floor(200 + Math.random() * 800)}`,
      bookingId: newBooking.id,
      serviceName: newBooking.serviceName,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      address: newBooking.address,
      scheduledTime: `${newBooking.scheduledDate} • ${newBooking.scheduledTime.split(" ")[0]}`,
      payout: 350,
      status: "incoming",
      createdAt: new Date().toISOString(),
    };
    setWorkerJobs((prev) => [newJob, ...prev]);

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: MobileBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    if (activeBooking && activeBooking.id === id) {
      setActiveBooking((prev) => (prev ? { ...prev, status } : null));
    }
    // Asynchronously update status in live Supabase PostgreSQL database
    updateRemoteBookingStatus(id, status).catch((err) =>
      console.warn("Background Supabase status update error:", err)
    );
  };

  const cancelBooking = (id: string) => {
    updateBookingStatus(id, "cancelled");
  };

  const acceptJob = (jobId: string) => {
    setWorkerJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "accepted" } : j))
    );
  };

  const declineJob = (jobId: string) => {
    setWorkerJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const advanceJobStatus = (jobId: string) => {
    setWorkerJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        if (j.status === "accepted") return { ...j, status: "in_progress" };
        if (j.status === "in_progress") {
          setTodaysEarnings((curr) => curr + j.payout);
          setCompletedJobsCount((curr) => curr + 1);
          return { ...j, status: "completed" };
        }
        return j;
      })
    );
  };

  const openBookingForService = (service: ServiceCategory) => {
    setSelectedService(service);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
        bookings,
        activeBooking,
        setActiveBooking,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        selectedService,
        setSelectedService,
        selectedWorker,
        setSelectedWorker,
        workerJobs,
        isAcceptingJobs,
        setIsAcceptingJobs,
        acceptJob,
        declineJob,
        advanceJobStatus,
        todaysEarnings,
        completedJobsCount,
        openBookingForService,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
