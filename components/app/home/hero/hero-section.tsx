"use client";

import React, { useEffect, useState } from "react";
import HeroHeading from "./hero-heading";
import HeroButton from "./hero-button";
import HeroImage from "./hero-image";
import SectionLabel from "@/components/app/section-label";
import HeroBackgroundVideo from "./hero-background-video";
import LogoSection from "@/components/shared/icons/logo-section";

function AnimatedPaycasso() {
  const text = "Paycasso";
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < text.length) {
      const timeout = setTimeout(() => setVisibleCount((v) => v + 1), 100);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount]);

  return (
    <div className="hidden md:flex w-full justify-center mt-40">
      <h1
        className="
          font-poppins font-bold tracking-tight text-[#E3E3E3]
          md:text-6xl lg:text-[80px]
          leading-[1.15]
        "
      >
        {text.split("").map((char, i) => (
          <span
            key={i}
            className={i < visibleCount ? "opacity-100" : "opacity-0"}
            style={{ transition: "opacity 0.2s" }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* ================= HERO BACKGROUND (SCOPED) ================= */}
      <HeroBackgroundVideo />

      {/* ================= HERO CONTENT ================= */}
      <div
        className="
          relative z-10
          px-4 pt-20 md:pt-0
          flex flex-col
          items-start md:items-center
        "
      >
        {/* Desktop-only animated brand */}
        <AnimatedPaycasso />

        {/* Mobile-only static logo */}
        <div className="md:hidden mb-7 w-45">
          <LogoSection />
        </div>

        {/* Mobile + Desktop heading */}
        <HeroHeading />

        {/* CTA */}
        <div className="mt-1 mb-1 w-full flex justify-start md:justify-center">
          <HeroButton />
        </div>

        {/* Dashboard image */}
        <div className="w-full flex justify-start md:justify-center mb-10 md:mb-16">
          <HeroImage />
        </div>

        {/* Tagline */}
        <SectionLabel className="hidden md:block text-left md:text-center text-sm md:text-xl mb-8">
          Shaping the future of finance together
        </SectionLabel>
      </div>
    </section>
  );
}
