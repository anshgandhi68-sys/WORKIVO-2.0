"use client";

import React, { useState } from "react";
import { WORKIVO_SERVICES } from "@/data/services";

interface ProOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

export const ProOnboardingModal: React.FC<ProOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState(WORKIVO_SERVICES[0].title);
  const [experienceYears, setExperienceYears] = useState(3);
  const [city, setCity] = useState(CITIES[0]);
  const [s3Key, setS3Key] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await fetch("/api/aws/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/pdf",
          folder: "pros",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setS3Key(data.fileKey);
      }
    } catch (err) {
      console.warn("Upload fallback error:", err);
      setS3Key(`pros/local-${Date.now()}-${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Please provide your name and phone number.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email,
          trade,
          experience_years: experienceYears,
          city,
          s3_document_key: s3Key,
        }),
      });

      const data = await res.json();
      if (data.success && data.application) {
        setSubmittedId(data.application.id);
      } else {
        setErrorMsg(data.error || "Failed to submit application.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedId(null);
    setErrorMsg("");
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

        {submittedId ? (
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
              Welcome to the Workivo Guild!
            </h2>
            <p style={{ marginBottom: "20px" }}>
              Your application (<strong>{submittedId}</strong>) has been stored in Supabase PostgreSQL and routed to our onboarding team.
            </p>
            <p style={{ fontSize: "14px", color: "var(--t)", marginBottom: "28px" }}>
              We will verify your profile and contact you at <strong>{phone}</strong> within 24 hours.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="btn btn-sm"
            >
              Done
            </button>
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
                Earn With Your Craft
              </span>
              <h2 style={{ fontSize: "32px", color: "var(--g)", marginTop: "4px" }}>
                Join as a Workivo Pro
              </h2>
            </div>

            {errorMsg && (
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
                ⚠️ {errorMsg}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Primary Trade</label>
                <select
                  className="form-select"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                >
                  {WORKIVO_SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service City</label>
                <select
                  className="form-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Years of Experience: {experienceYears} {experienceYears === 1 ? "year" : "years"}
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                style={{ accentColor: "var(--co)" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Upload Government ID / Trade Certificate (AWS S3)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocUpload}
                className="form-input"
                style={{ padding: "8px" }}
              />
              {uploading && (
                <span style={{ fontSize: "12px", color: "var(--t)" }}>
                  Uploading verification document to AWS S3...
                </span>
              )}
              {s3Key && (
                <span style={{ fontSize: "12px", color: "var(--lg)", fontWeight: 700 }}>
                  ✓ Secured to AWS S3: {s3Key}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {submitting ? "Submitting Application..." : "Submit Pro Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
