"use client";

import {
  motion,
  MotionValue,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

const PATH_D = `
  M 100 150
  C 1000 300, 1200 400, 1000 450
  C 0 660, 0 700, 950 860
`;

export default function StarPath({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  const cx = useMotionValue(0);
  const cy = useMotionValue(0);

  const starScale = useTransform(progress, [0, 0.5, 1], [1, 1.15, 1]);
  const pathLength = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    if (!pathRef.current) return;

    const path = pathRef.current;
    const totalLength = path.getTotalLength();

    const unsubscribe = progress.on("change", (v) => {
      const point = path.getPointAtLength(v * totalLength);
      cx.set(point.x);
      cy.set(point.y);
    });

    return unsubscribe;
  }, [progress]);

  return (
    <svg className="absolute inset-0" viewBox="0 0 1200 900" fill="none">
      <defs>
        <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" result="blur1" />
          <feGaussianBlur stdDeviation="20" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="trailGradient" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
        </linearGradient>
      </defs>

      <motion.path
        ref={pathRef}
        d={PATH_D}
        stroke="url(#trailGradient)"
        strokeWidth="2"
        fill="none"
        style={{ pathLength }}
      />

      <motion.circle
        r="1"
        fill="white"
        filter="url(#starGlow)"
        style={{ cx, cy, scale: starScale }}
      />
    </svg>
  );
}
