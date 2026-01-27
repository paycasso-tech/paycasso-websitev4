"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Star = {
  id: number;
  size: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  duration: number;
};

const STAR_COUNT = 40;

export default function StarsBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const generatedStars: Star[] = Array.from({ length: STAR_COUNT }).map(
      (_, i) => ({
        id: i,
        size: Math.random() * 1.5 + 0.6,
        x: Math.random() * 100,
        y: Math.random() * 100,
        driftX: (Math.random() - 0.5) * 30,
        driftY: (Math.random() - 0.5) * 30,
        duration: Math.random() * 20 + 25,
      })
    );

    setStars(generatedStars);
    setMounted(true);
  }, []);

  // 🚫 Prevent SSR render entirely
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            x: [0, star.driftX, 0],
            y: [0, star.driftY, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
