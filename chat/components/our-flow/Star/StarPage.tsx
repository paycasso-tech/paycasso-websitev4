"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import StarBlock from "./StarBlock";
import StarsBackground from "../shared/StarsBackground";

const StarPath = dynamic(() => import("./StarPath"), { ssr: false });

/**
 * ⭐ Path percentage where Block One visually sits
 * This must match Figma
 */
const STAR_ENTRY_POINT = 0.07;

export default function StarPage() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });

  // Smooth scroll signal
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 90,
    mass: 0.8,
  });

  /**
   * 🔒 Locked visual progress
   * Starts ALREADY at Block One
   */
  const [lockedProgress, setLockedProgress] =
    useState<number>(STAR_ENTRY_POINT);

  useEffect(() => {
    const unsubscribe = smoothScroll.on("change", (v) => {
      setLockedProgress((prev) => {
        // Hold star at Block One on entry
        if (v < 0.01) return STAR_ENTRY_POINT;

        // Map remaining scroll to remaining path
        const mapped = STAR_ENTRY_POINT + v * (1 - STAR_ENTRY_POINT);

        return Math.max(prev, Math.min(mapped, 1));
      });
    });

    return unsubscribe;
  }, [smoothScroll]);

  // MotionValue used everywhere
  const starProgress = useTransform(() => lockedProgress);

  const isComplete = lockedProgress >= 0.99;

  return (
    <>
      {/* SECTION HEADING */}
      <div className="relative left-24 max-w-[720px] text-white z-20">
        <h2 className="text-5xl font-normal leading-tight">
          The motive is to have{" "}
          <span className="text-cyan-400 font-extralight">transparent</span>{" "}
          workflow
        </h2>
      </div>

      <section
        ref={ref}
        className="relative min-h-[160vh] bg-black overflow-hidden"
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/our-flow/stars/starpage-bg.png')",
          }}
        />

        {/* ⭐ STAR FIELD */}
        <StarsBackground />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 z-10 bg-linear-to-b from-black/30 via-black/20 to-black/40" />

        {/* STICKY CONTENT */}
        <div className="sticky top-0 h-screen z-20 overflow-visible">
          <StarPath progress={starProgress} />

          <StarBlock
            starProgress={starProgress}
            isComplete={isComplete}
            triggerAt={0}
            baseY={80}
            left="left-80"
            title="Block One"
            text="First explanation"
            alwaysVisible
          />

          <StarBlock
            starProgress={starProgress}
            isComplete={isComplete}
            triggerAt={0.23}
            baseY={200}
            left="right-52"
            title="Block Two"
            text="Second explanation"
          />

          <StarBlock
            starProgress={starProgress}
            isComplete={isComplete}
            triggerAt={0.6}
            baseY={560}
            left="left-102"
            title="Block Three"
            text="Third explanation"
          />

          <StarBlock
            starProgress={starProgress}
            isComplete={isComplete}
            triggerAt={0.97}
            baseY={810}
            left="right-42"
            title="Block Four"
            text="Fourth explanation"
          />
        </div>
      </section>
    </>
  );
}
