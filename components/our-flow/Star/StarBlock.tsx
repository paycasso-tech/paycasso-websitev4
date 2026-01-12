"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useState } from "react";

type Props = {
  starProgress: MotionValue<number>;
  triggerAt: number;
  baseY: number;
  left: string;
  title: string;
  text: string;
  isComplete: boolean;
  alwaysVisible?: boolean;
};

export default function StarBlock({
  starProgress,
  triggerAt,
  baseY,
  left,
  title,
  text,
  isComplete,
  alwaysVisible = false,
}: Props) {
  const [hovered, setHovered] = useState(false);

  // Heading visibility
  const opacity = useTransform(starProgress, (v) => {
    if (alwaysVisible) return 1;
    if (isComplete) return 1;
    return v >= triggerAt ? 1 : 0;
  });

  // Entrance motion (only once)
  const y = useTransform(
    starProgress,
    [triggerAt - 0.05, triggerAt],
    [baseY + 20, baseY],
    { clamp: true }
  );

  // Text logic
  const textOpacity = isComplete ? (hovered ? 1 : 0) : 1;

  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents: opacity.get() === 1 ? "auto" : "none",
      }}
      className={`absolute ${left} w-[320px] text-white`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="text-xl font-semibold mb-2 cursor-pointer">{title}</h3>

      <motion.p
        style={{ opacity: textOpacity }}
        className="text-sm transition-opacity duration-300"
      >
        {text}
      </motion.p>
    </motion.div>
  );
}
