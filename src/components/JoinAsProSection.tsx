"use client";

import React from "react";

interface JoinAsProSectionProps {
  onJoinClick: () => void;
}

export const JoinAsProSection: React.FC<JoinAsProSectionProps> = ({
  onJoinClick,
}) => {
  return (
    <section className="join" id="join" aria-label="Join Workivo as a Pro">
      <h2>Skilled at something? Earn with Workivo.</h2>
      <p>Join as a pro, pick the jobs you want and get paid for your craft.</p>
      <button type="button" onClick={onJoinClick} className="btn">
        Join as a pro
      </button>
    </section>
  );
};
