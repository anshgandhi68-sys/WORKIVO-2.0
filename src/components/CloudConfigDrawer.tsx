"use client";

import React, { useEffect, useState } from "react";

interface CloudConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StatusData {
  supabase: {
    connected: boolean;
    url: string;
    databaseType: string;
  };
  aws: {
    connected: boolean;
    region: string;
    bucket: string;
    services: string[];
  };
  environment: string;
}

export const CloudConfigDrawer: React.FC<CloudConfigDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<StatusData | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/cloud-status")
        .then((res) => res.json())
        .then((data) => setStatus(data))
        .catch((err) => console.error("Cloud status error:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: "680px" }}
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
            Cloud Infrastructure Monitor
          </span>
          <h2 style={{ fontSize: "32px", color: "var(--g)", marginTop: "4px" }}>
            AWS &amp; Supabase Integration
          </h2>
        </div>

        <p style={{ marginBottom: "20px", fontSize: "15px" }}>
          Workivo 2.0 uses a hybrid cloud model: <strong>AWS S3 &amp; API Routes</strong> handle file storage and server execution, while <strong>Supabase</strong> provides the PostgreSQL database and data persistence.
        </p>

        {/* Cloud Status Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          {/* Supabase Status Card */}
          <div
            style={{
              background: "var(--card)",
              border: "2px solid var(--line)",
              borderRadius: "18px",
              padding: "18px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>⚡ Supabase</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "8px",
                  background: status?.supabase.connected ? "rgba(74, 222, 128, 0.2)" : "rgba(251, 191, 36, 0.2)",
                  color: status?.supabase.connected ? "#15803d" : "#b45309",
                }}
              >
                {status?.supabase.connected ? "Connected" : "Simulated / Local DB"}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--tx)", marginBottom: "4px" }}>
              <strong>Role:</strong> PostgreSQL Database
            </div>
            <div style={{ fontSize: "13px", color: "var(--tx)" }}>
              <strong>Endpoint:</strong> {status?.supabase.url || "Local Store"}
            </div>
          </div>

          {/* AWS Status Card */}
          <div
            style={{
              background: "var(--card)",
              border: "2px solid var(--line)",
              borderRadius: "18px",
              padding: "18px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>☁️ Amazon Web Services</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "8px",
                  background: status?.aws.connected ? "rgba(74, 222, 128, 0.2)" : "rgba(251, 191, 36, 0.2)",
                  color: status?.aws.connected ? "#15803d" : "#b45309",
                }}
              >
                {status?.aws.connected ? "Active" : "Simulated / Local S3"}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--tx)", marginBottom: "4px" }}>
              <strong>Role:</strong> S3 Media &amp; Presigned APIs
            </div>
            <div style={{ fontSize: "13px", color: "var(--tx)" }}>
              <strong>Bucket:</strong> {status?.aws.bucket || "workivo-media-storage"}
            </div>
          </div>
        </div>

        {/* Quick Instructions */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.04)",
            padding: "16px 20px",
            borderRadius: "16px",
            border: "1px dashed var(--line)",
            marginBottom: "20px",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: "var(--t)", marginBottom: "6px" }}>
            📋 Connecting Live Credentials:
          </div>
          <ol style={{ paddingLeft: "18px" }}>
            <li>Copy <code>.env.example</code> to <code>.env.local</code> in the project root.</li>
            <li>Fill in your Supabase project URL &amp; Anon Key, plus your AWS S3 bucket and IAM keys.</li>
            <li>Run the ready SQL script in <code>supabase/schema.sql</code> inside your Supabase SQL editor.</li>
          </ol>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} className="btn btn-sm">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
