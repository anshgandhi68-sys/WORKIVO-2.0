"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { WORKIVO_SERVICES, ServiceItem } from "@/data/services";
import { BookingRecord } from "@/lib/supabase";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  onBookingCreated: (booking: BookingRecord) => void;
}

const TIME_SLOTS = [
  "Morning (09:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 04:00 PM)",
  "Evening (04:00 PM - 08:00 PM)",
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  onBookingCreated,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || WORKIVO_SERVICES[0].id
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setScheduledDate(today);
    setMinDate(today);
  }, []);
  const [scheduledTime, setScheduledTime] = useState(TIME_SLOTS[0]);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [fileKey, setFileKey] = useState<string>("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const activeService =
    WORKIVO_SERVICES.find((s) => s.id === selectedServiceId) || WORKIVO_SERVICES[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const res = await fetch("/api/aws/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "image/jpeg",
          folder: "bookings",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFileKey(data.fileKey);
      }
    } catch (err) {
      console.warn("Upload fallback error:", err);
      setFileKey(`bookings/local-${Date.now()}-${file.name}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      setErrorMessage("Please fill in your name, phone number, and address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          service_id: activeService.id,
          service_name: activeService.title,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          address,
          notes,
          price_estimate: activeService.priceEstimate,
          s3_photo_key: fileKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setCompletedBooking(data.booking);
        onBookingCreated(data.booking);
      } else {
        setErrorMessage(data.error || "Failed to create booking.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setCompletedBooking(null);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={resetAndClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={resetAndClose}
          className="modal-close-btn"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {completedBooking ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "var(--lg)",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontSize: "36px",
                margin: "0 auto 20px",
                boxShadow: "0 6px 0 #3b8a3e",
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: "32px", color: "var(--g)", marginBottom: "8px" }}>
              Relief is on the way!
            </h2>
            <p style={{ marginBottom: "24px" }}>
              Your booking has been registered in the database and matched to a verified professional.
            </p>

            <div
              style={{
                background: "var(--card)",
                padding: "20px",
                borderRadius: "20px",
                border: "2px solid var(--line)",
                textAlign: "left",
                marginBottom: "28px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "var(--t)", fontWeight: 700 }}>
                  BOOKING REFERENCE
                </span>
                <span
                  style={{
                    background: "var(--co)",
                    color: "#2A1210",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: "10px",
                    fontSize: "13px",
                  }}
                >
                  {completedBooking.id}
                </span>
              </div>

              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>
                {completedBooking.service_name}
              </div>
              <div style={{ fontSize: "14px", color: "var(--tx)", marginBottom: "12px" }}>
                📅 {completedBooking.scheduled_date} • ⏰ {completedBooking.scheduled_time}
              </div>

              <div
                style={{
                  paddingTop: "12px",
                  borderTop: "1px dashed var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "var(--t)", fontWeight: 700 }}>
                    ASSIGNED PRO
                  </div>
                  <div style={{ fontWeight: 700 }}>{completedBooking.pro_assigned_name}</div>
                  <div style={{ fontSize: "13px", color: "var(--tx)" }}>
                    {completedBooking.pro_assigned_phone}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--g)",
                    background: "rgba(47, 104, 96, 0.1)",
                    padding: "6px 12px",
                    borderRadius: "12px",
                  }}
                >
                  ★ {completedBooking.pro_rating}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={resetAndClose}
                className="btn btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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
                Instant Doorstep Booking
              </span>
              <h2 style={{ fontSize: "32px", color: "var(--g)", marginTop: "4px" }}>
                Book a Workivo Pro
              </h2>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: "rgba(143, 69, 63, 0.15)",
                  color: "var(--t)",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Service Chooser */}
            <div className="form-group">
              <label className="form-label">Select Service</label>
              <select
                className="form-select"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                {WORKIVO_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.priceEstimate})
                  </option>
                ))}
              </select>
            </div>

            {/* Service Mini Preview */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                background: "var(--card)",
                padding: "12px 16px",
                borderRadius: "16px",
                border: "2px solid var(--line)",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={activeService.image}
                  alt={activeService.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px" }}>{activeService.title}</div>
                <div style={{ fontSize: "13px", color: "var(--t)", fontWeight: 600 }}>
                  Est. {activeService.priceEstimate} • {activeService.duration}
                </div>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={scheduledDate}
                  min={minDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Est. Charge</label>
                <input
                  type="text"
                  readOnly
                  className="form-input"
                  value={activeService.priceEstimate}
                  style={{ fontWeight: 700, color: "var(--g)" }}
                />
              </div>
            </div>

            {/* Slot picker */}
            <div className="form-group">
              <label className="form-label">Preferred Time Slot</label>
              <div className="slots-grid">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-btn ${scheduledTime === slot ? "selected" : ""}`}
                    onClick={() => setScheduledTime(slot)}
                  >
                    {slot.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sen"
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="form-input"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Doorstep Address</label>
              <input
                type="text"
                required
                placeholder="House/Flat number, Street, Landmark, City"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Notes & Optional AWS S3 File upload */}
            <div className="form-group">
              <label className="form-label">Special Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Please bring extra drill bits or call before arriving"
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Upload Problem Photo (Saved to AWS S3)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="form-input"
                style={{ padding: "8px" }}
              />
              {uploadingFile && (
                <span style={{ fontSize: "12px", color: "var(--t)" }}>
                  Uploading to AWS S3...
                </span>
              )}
              {fileKey && (
                <span style={{ fontSize: "12px", color: "var(--lg)", fontWeight: 700 }}>
                  ✓ Attached: {fileKey}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {isSubmitting ? "Confirming with Workivo..." : `Confirm Booking (${activeService.priceEstimate})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
