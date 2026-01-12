"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import StarBlock from "./StarBlock";

const StarPath = dynamic(() => import("./StarPath"), { ssr: false });

const STAR_ENTRY_OFFSET = 0.08;

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

  // Raw star progress (scroll-driven)
  const rawStarProgress = useTransform(smoothScroll, (v) =>
    Math.min(STAR_ENTRY_OFFSET + v * (1 - STAR_ENTRY_OFFSET), 1)
  );

  // 🔒 LOCKED progress (never decreases)
  const [lockedProgress, setLockedProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = rawStarProgress.on("change", (v) => {
      setLockedProgress((prev) => Math.max(prev, v));
    });
    return unsubscribe;
  }, [rawStarProgress]);

  // ✅ This is the ONLY progress used everywhere
  const starProgress = useTransform(() => lockedProgress);

  // Completion flag
  const isComplete = lockedProgress >= 0.99;

  return (
    <>
      {/* Section Heading */}
      <div className="relative left-24 max-w-[720px] text-white z-10">
        <h2 className="text-5xl font-semibold leading-tight">
          The motive is to have{" "}
          <span className="text-cyan-400">transparent</span> workflow
        </h2>
      </div>

      <section ref={ref} className="relative h-[150vh] bg-black">
        <div className="sticky top-0 h-screen">
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
