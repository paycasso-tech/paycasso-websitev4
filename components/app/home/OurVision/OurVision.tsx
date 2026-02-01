"use client";

import React, { useState } from "react";
import SectionLabel from "@/components/app/section-label";
import Image from "next/image";

// ===== Desktop floating icon config (UNCHANGED) =====
const leftSvgs = [
  { src: "/left3.svg", size: 100, offsetX: -300 },
  { src: "/left2.svg", size: 80, offsetX: -380 },
  { src: "/left1.svg", size: 60, offsetX: -440 },
];

const rightSvgs = [
  { src: "/right3.svg", size: 100, offsetX: 300 },
  { src: "/right2.svg", size: 80, offsetX: 380 },
  { src: "/right1.svg", size: 60, offsetX: 440 },
];

export default function VisionSection() {
  const [hovering, setHovering] = useState(false);

  return (
    <section className="relative w-full font-poppins overflow-hidden">
      {/* ======================= DESKTOP ======================= */}
      <div className="hidden md:block">
        <section className="relative flex flex-col items-center justify-center min-h-[700px] w-full py-24">
          {/* Cube backgrounds (unchanged) */}
          <Image
            src="/cube.svg"
            alt="Cube Left"
            width={200}
            height={200}
            draggable={false}
            style={{
              position: "absolute",
              left: "-70px",
              top: "20%",
              transform: "translateY(-50%)",
              width: "520px",
              height: "520px",
              zIndex: 0,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />

          <Image
            src="/cube.svg"
            alt="Cube Right"
            width={200}
            height={200}
            draggable={false}
            style={{
              position: "absolute",
              right: "-280px",
              top: "40%",
              transform: "translateY(-50%)",
              width: "420px",
              height: "420px",
              zIndex: 0,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />

          {/* Floating icons */}
          {leftSvgs.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt=""
              width={img.size}
              height={img.size}
              draggable={false}
              className="absolute pointer-events-none h-auto w-auto"
              style={{
                top: "64%",
                left: `calc(53% + ${img.offsetX}px)`,
                transform: "translateY(-50%)",
                opacity: hovering ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.1}s`,
                zIndex: 5,
              }}
            />
          ))}

          {rightSvgs.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt=""
              width={img.size}
              height={img.size}
              draggable={false}
              className="absolute pointer-events-none"
              style={{
                top: "64%",
                left: `calc(40% + ${img.offsetX}px)`,
                transform: "translateY(-50%)",
                opacity: hovering ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 0.1}s`,
                zIndex: 5,
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center w-full">
            <SectionLabel className="mb-4 text-lg md:text-2xl">
              Our Vision
            </SectionLabel>

            {/* Subtle divider */}
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />

            <div
              className="text-4xl md:text-5xl font-semibold tracking-tight text-white text-center"
              style={{ lineHeight: "115%" }}
            >
              Trustless payments
              <br />
              borderless work
            </div>

            {/* Supporting line */}
            <p className="mt-6 text-base text-neutral-400 max-w-xl text-center">
              A secure payment layer built for global freelancers and
              businesses.
            </p>

            {/* Logo */}
            <div
              className="mt-16 relative"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-full blur-3xl bg-white/10 scale-90" />

              <Image
                src="/just-logo.svg"
                alt="Paycasso Logo"
                width={400} // slightly reduced
                height={400}
                draggable={false}
                className="relative z-10 h-auto"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ======================= MOBILE (UNCHANGED) ======================= */}
      <div className="md:hidden px-4 py-10 flex flex-col items-center text-center">
        <SectionLabel className="mb-6 text-base">Our Vision</SectionLabel>

        <h2 className="text-3xl font-semibold leading-tight text-white mb-6">
          Trustless payments
          <br />
          borderless work
        </h2>

        <Image
          src="/just-logo.svg"
          alt="Paycasso Logo"
          width={320}
          height={180}
          className="w-full max-w-xs mx-auto mb-6 h-auto"
          priority
        />

        <p className="text-sm text-neutral-400 max-w-xs">
          We’re building a future where global work and payments happen without
          borders, intermediaries, or trust barriers.
        </p>
      </div>
    </section>
  );
}
