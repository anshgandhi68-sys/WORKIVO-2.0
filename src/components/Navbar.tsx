"use client";

import React from "react";

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenProModal: () => void;
  onOpenCloudDrawer: () => void;
  cloudStatus: {
    supabaseConnected: boolean;
    awsConnected: boolean;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenTracker,
  onOpenProModal,
  onOpenCloudDrawer,
  cloudStatus,
}) => {
  return (
    <nav className="main-nav" role="navigation" aria-label="Main Navigation">
      <a href="#top" aria-label="Workivo Home" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/images/logo.png"
          alt="Workivo"
          style={{ height: "44px", width: "auto", display: "block" }}
        />
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          type="button"
          onClick={onOpenTracker}
          className="nav-text-link"
          style={{
            background: "none",
            border: "none",
            color: "#d6e9e2",
            font: "700 13px 'Comfortaa', sans-serif",
            cursor: "pointer",
            padding: "8px 12px",
          }}
        >
          Track booking
        </button>

        <button
          type="button"
          onClick={onOpenProModal}
          className="btn"
          style={{
            minHeight: "44px",
            padding: "0 20px",
            fontSize: "13px",
            boxShadow: "0 4px 0 #9c4c47",
          }}
        >
          Become a pro
        </button>
      </div>
    </nav>
  );
};
