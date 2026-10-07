"use client";

import React, { useEffect, useRef, useState } from "react";
import { WORKIVO_SERVICES, ServiceItem } from "@/data/services";

interface Interactive3DDeckProps {
  onSelectService: (service: ServiceItem) => void;
}

export const Interactive3DDeck: React.FC<Interactive3DDeckProps> = ({
  onSelectService,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const deckRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const syncScroll = () => {
      const mob = window.innerWidth <= 820;
      let top = 0;
      if (mob && stageRef.current) {
        top = stageRef.current.getBoundingClientRect().bottom;
      }
      const mid = top + (window.innerHeight - top) / 2;

      let bestIndex = 0;
      let smallestDist = 1e9;

      articleRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < smallestDist) {
          smallestDist = dist;
          bestIndex = index;
        }
      });

      setActiveIndex(bestIndex);

      if (deckRef.current) {
        const scrollY = window.scrollY || window.pageYOffset;
        const ry = -8 + 10 * Math.sin(scrollY / 260);
        deckRef.current.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initial calculation
    syncScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToStep = (index: number) => {
    const el = articleRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const currentService = WORKIVO_SERVICES[activeIndex] || WORKIVO_SERVICES[0];

  return (
    <section className="story" id="story" aria-label="Workivo Services Scrollytelling">
      {/* Sticky 3D Stage on Right */}
      <div className="stage" ref={stageRef} aria-hidden="true">
        <div className="deck" id="deck" ref={deckRef}>
          {WORKIVO_SERVICES.map((srv, idx) => (
            <img
              key={srv.id}
              src={srv.image}
              alt={srv.title}
              className={idx === activeIndex ? "on" : ""}
            />
          ))}
          <span className="tag" id="tag">
            {currentService.title}
          </span>
        </div>

        {/* Dots Pagination */}
        <div className="dots" id="dots" role="tablist" aria-label="Services Slider Navigation">
          {WORKIVO_SERVICES.map((srv, idx) => (
            <i
              key={srv.id}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Jump to ${srv.title}`}
              className={idx === activeIndex ? "on" : ""}
              onClick={() => scrollToStep(idx)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>

      {/* Scrolling Service Steps on Left */}
      <div className="steps" id="steps">
        {WORKIVO_SERVICES.map((srv, idx) => (
          <article
            key={srv.id}
            ref={(el) => {
              articleRefs.current[idx] = el;
            }}
            className={idx === activeIndex ? "on" : ""}
          >
            <span className="n">{srv.number}</span>
            <h2>{srv.title}</h2>
            <p>{srv.description}</p>
            <a
              href="#book"
              onClick={(e) => {
                e.preventDefault();
                onSelectService(srv);
              }}
            >
              Book {srv.title.toLowerCase()}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};
