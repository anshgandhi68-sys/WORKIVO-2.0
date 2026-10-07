"use client";

import React from "react";

export const HowItWorks3D: React.FC = () => {
  return (
    <section className="how" aria-label="How Workivo Works">
      <h2>Three taps to relief</h2>
      <div className="cards">
        <div className="card">
          <b>1</b>
          <h3>Tell us the task</h3>
          <p>Pick a service, a time and your address.</p>
        </div>

        <div className="card">
          <b>2</b>
          <h3>Meet your pro</h3>
          <p>A verified worker is matched and you can track them arriving.</p>
        </div>

        <div className="card">
          <b>3</b>
          <h3>Relax</h3>
          <p>Pay once the job is done and the work is right.</p>
        </div>
      </div>
    </section>
  );
};
