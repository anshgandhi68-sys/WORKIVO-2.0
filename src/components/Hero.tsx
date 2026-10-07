"use client";

import React from "react";

interface HeroProps {
  onBookClick: () => void;
  onWorkClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onWorkClick }) => {
  const handleScrollToStory = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("story");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="hero" id="top">
      <h1>Small task, Big relief.</h1>
      <p>
        Trusted pros for the things you don&apos;t have time for. Book an electrician, a cleaner, a barber or movers, and they come to you.
      </p>
      <div className="row">
        <a href="#story" onClick={handleScrollToStory} className="btn">
          Book a service
        </a>
        <button type="button" onClick={onWorkClick} className="btn o">
          Work with us
        </button>
      </div>
      <div className="hint" aria-hidden="true">
        Scroll to meet the pros
      </div>
    </header>
  );
};
