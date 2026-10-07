"use client";

import React, { useState, useEffect } from "react";
import { BookingRecord } from "@/lib/supabase";

interface BookingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBookingId?: string | null;
}

const STATUS_STEPS: { key: BookingRecord["status"]; label: string; icon: string }[] = [
  { key: "pending", label: "Requested", icon: "📝" },
  { key: "matched", label: "Pro Matched", icon: "🤝" },
  { key: "on_the_way", label: "On The Way", icon: "🛵" },
  { key: "in_progress", label: "Work In Progress", icon: "🛠" },
  { key: "completed", label: "Completed", icon: "🎉" },
];

export const BookingTrackerModal: React.FC<BookingTrackerModalProps> = ({
  isOpen,
  onClose,
  selectedBookingId,
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedBookingId || "");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBookings(selectedBookingId || "");
    }
  }, [isOpen, selectedBookingId]);

  const fetchBookings = async (query?: string) => {
    try {
      setLoading(true);
      const url = query
        ? `/api/bookings?id=${encodeURIComponent(query)}`
        : "/api/bookings";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
        if (data.bookings.length > 0) {
          setActiveBooking(data.bookings[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: BookingRecord["status"]) => {
    if (!activeBooking) return;
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeBooking.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setActiveBooking(data.booking);
        setBookings((prev) =>
          prev.map((b) => (b.id === data.booking.id ? data.booking : b))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!isOpen) return null;

  const currentStepIdx = activeBooking
    ? STATUS_STEPS.findIndex((s) => s.key === activeBooking.status)
    : -1;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: "620px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close dialog"
        >
          ✕
        </button>

        <div style={{ marginBottom: "20px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--t)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Live Task Radar
          </span>
          <h2 style={{ fontSize: "32px", color: "var(--g)", marginTop: "4px" }}>
            Track Your Booking
          </h2>
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by Booking ID (e.g. WKV-8421) or phone"
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            onClick={() => fetchBookings(searchQuery)}
            className="btn btn-sm"
            style={{ whiteSpace: "nowrap" }}
          >
            Find
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            Querying Supabase database...
          </div>
        ) : activeBooking ? (
          <div>
            {/* Active booking banner */}
            <div
              style={{
                background: "var(--card)",
                padding: "20px",
                borderRadius: "20px",
                border: "2px solid var(--line)",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {activeBooking.service_name}
                </div>
                <span
                  style={{
                    background: "var(--co)",
                    color: "#2A1210",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}
                >
                  {activeBooking.id}
                </span>
              </div>

              <div style={{ fontSize: "14px", color: "var(--tx)", marginBottom: "8px" }}>
                📅 {activeBooking.scheduled_date} • ⏰ {activeBooking.scheduled_time}
              </div>

              <div style={{ fontSize: "13px", color: "var(--t)", fontWeight: 600 }}>
                📍 {activeBooking.address}
              </div>
            </div>

            {/* Stepper Pipeline */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--t)",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                }}
              >
                Service Status Progress
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div
                      key={step.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "10px 14px",
                        borderRadius: "14px",
                        background: isCurrent
                          ? "rgba(233, 132, 125, 0.18)"
                          : isDone
                          ? "rgba(107, 178, 110, 0.1)"
                          : "var(--card)",
                        border: isCurrent
                          ? "2px solid var(--co)"
                          : "1px solid var(--line)",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: isDone ? "var(--g)" : "var(--line)",
                          color: "#FFFFFF",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: isCurrent ? 700 : 600,
                            color: isCurrent ? "var(--t)" : "inherit",
                          }}
                        >
                          {step.icon} {step.label}
                        </div>
                      </div>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--t)",
                            textTransform: "uppercase",
                          }}
                        >
                          Current State
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pro Card Details */}
            <div
              style={{
                background: "var(--card)",
                padding: "16px 20px",
                borderRadius: "18px",
                border: "2px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", color: "var(--t)", fontWeight: 700 }}>
                  YOUR DISPATCHED PRO
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>
                  {activeBooking.pro_assigned_name || "Pawan Verma"}
                </div>
                <div style={{ fontSize: "13px", color: "var(--tx)" }}>
                  📞 {activeBooking.pro_assigned_phone || "+91 99201 88342"}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(47, 104, 96, 0.1)",
                  color: "var(--g)",
                  padding: "6px 14px",
                  borderRadius: "14px",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                ★ {activeBooking.pro_rating || 4.9}
              </div>
            </div>

            {/* Live simulation controls */}
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "rgba(0,0,0,0.04)",
                border: "1px dashed var(--line)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--t)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                ⚡ Live Status Simulation (Testing Controller)
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {STATUS_STEPS.map((step) => (
                  <button
                    key={step.key}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(step.key)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      background:
                        activeBooking.status === step.key ? "var(--g)" : "var(--card)",
                      color:
                        activeBooking.status === step.key ? "#FFFFFF" : "inherit",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Set: {step.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p>No bookings found. Try booking a service first!</p>
          </div>
        )}
      </div>
    </div>
  );
};
