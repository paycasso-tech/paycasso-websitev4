"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface CardBundleProps {
  progress: MotionValue<number>;
}

export default function CardBundle({ progress }: CardBundleProps) {
  /* -------------------------------
     PHASE TIMINGS (TIGHTENED)
  -------------------------------- */
  const DROP_START = 0.18;
  const DROP_END = 0.38;
  const PAUSE_END = 0.42;
  const LEFT_END = 0.55;

  /* -------------------------------
     STACK MOTION (bundle)
  -------------------------------- */
  // ⬇️ Phase 1 — move down
  const stackY = useTransform(progress, [DROP_START, DROP_END], [0, 180], {
    clamp: true,
  });

  // ⬅️ Phase 2 — FAST move left
  const stackX = useTransform(progress, [PAUSE_END, LEFT_END], [0, -320], {
    clamp: true,
  });

  /* -------------------------------
     BACK CARD — folder open effect
  -------------------------------- */
  const backRotate = useTransform(progress, [DROP_START, DROP_END], [0, -28]);
  const backRotateX = useTransform(progress, [DROP_START, DROP_END], [0, 12]);
  const backY = useTransform(progress, [DROP_START, DROP_END], [0, -140]);

  // back card exits slightly faster
  const backX = useTransform(progress, [PAUSE_END, LEFT_END], [-60, -140]);

  /* -------------------------------
     FRONT CARD
  -------------------------------- */
  const frontRotate = useTransform(progress, [DROP_START, DROP_END], [0, 4]);

  // subtle lead for front card
  const frontX = useTransform(progress, [PAUSE_END, LEFT_END], [0, 18]);

  return (
    <motion.div
      style={{ x: stackX, y: stackY }}
      className="absolute inset-0 flex items-center justify-center overflow-visible"
    >
      <div className="relative w-[310px] h-[540px] overflow-visible">
        {/* BACK CARD */}
        <motion.img
          src="/our-flow/cards/card-back.png"
          alt="Back card"
          style={{
            rotateZ: backRotate,
            rotateX: backRotateX,
            x: backX,
            y: backY,
          }}
          className="
            absolute
            bottom-0
            left-0
            right-0
            mx-auto
            h-[350px]
            rounded-2xl
            shadow-md
          "
        />

        {/* FRONT CARD */}
        <motion.img
          src="/our-flow/cards/card-front.png"
          alt="Front card"
          style={{
            rotateZ: frontRotate,
            x: frontX,
          }}
          className="
            relative
            z-10
            mx-auto
            h-[420px]
            rounded-2xl
            shadow-xl
          "
        />
      </div>
    </motion.div>
  );
}
