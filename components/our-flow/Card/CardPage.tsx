"use client";

import { useRef, useEffect, useState } from "react";
import {
  useScroll,
  useMotionValue,
  useTransform,
  useSpring,
  motion,
  useAnimation,
} from "framer-motion";
import CardBundle from "./CardBundle";
import FlowChart from "./FlowChart";
import StarsBackground from "../shared/StarsBackground";

export default function CardPage() {
  const ref = useRef<HTMLDivElement>(null);

  const [cardsSettled, setCardsSettled] = useState(false);

  // 🎬 Timeline controller for flow animation
  const flowControls = useAnimation();

  /* -------------------------------
     SCROLL
  -------------------------------- */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "center end"],
  });

  // 🔒 One-way locked progress
  const lockedProgress = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      lockedProgress.set(Math.max(lockedProgress.get(), v));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Smooth scroll motion
  const smoothProgress = useSpring(lockedProgress, {
    stiffness: 90,
    damping: 120,
    mass: 1,
  });

  /* -------------------------------
     DETECT CARD SETTLE
  -------------------------------- */
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      if (v >= 0.32 && !cardsSettled) {
        setTimeout(() => {
          setCardsSettled(true);
          flowControls.start("enter"); // 🚀 START FLOW TIMELINE
        }, 120);
      }
    });
    return unsubscribe;
  }, [smoothProgress, cardsSettled, flowControls]);

  /* -------------------------------
     HEADING
  -------------------------------- */
  const headingOpacity = useTransform(smoothProgress, [0, 0.15], [0, 1]);
  const headingY = useTransform(smoothProgress, [0, 0.15], [20, 0]);

  return (
    <section ref={ref} className="relative h-[130vh] overflow-hidden bg-black">
      {/* 🔹 BACKGROUND IMAGE (NEW) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/our-flow/cards/cardSectionbackground.png')",
        }}
      />

      {/* ⭐ STARS LAYER */}
      <StarsBackground />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/30 via-black/20 to-black/40" />

      <div className="sticky top-0 h-screen z-20">
        {/* Heading */}
        <motion.div
          style={{ opacity: headingOpacity, y: headingY }}
          className="absolute top-24 left-24 z-20 max-w-[640px] text-white"
        >
          <h2 className="text-5xl font-normal leading-tight">
            nothing{" "}
            <span className="text-[#0DBBFF] font-extralight">hidden</span>
            <span className="font-extralight">.</span>
            <br />
            everything{" "}
            <span className="text-[#0DBBFF] font-extralight">flows</span>
          </h2>
        </motion.div>

        {/* Cards (scroll-driven ONLY) */}
        <CardBundle progress={smoothProgress} />

        {/* Flow chart (TIMELINE-DRIVEN) */}
        {cardsSettled && (
          <div className="absolute right-24 top-1/2 -translate-y-1/2 z-10">
            <FlowChart controls={flowControls} />
          </div>
        )}
      </div>
    </section>
  );
}
