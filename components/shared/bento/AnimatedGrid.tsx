"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type Tile = {
  uid: string;
  type: "brown" | "brown_with_logo" | "white" | "transparent";
  logo: boolean;
  plus: boolean;
  text?: string;
};

/**
 * Stable tile identities (VERY IMPORTANT for smooth motion)
 */
const TILE_POOL: Record<string, Tile> = {
  hero: {
    uid: "hero",
    type: "brown",
    logo: false,
    plus: false,
    text: "Escrow Made Effortless",
  },
  logo: {
    uid: "logo",
    type: "brown_with_logo",
    logo: true,
    plus: false,
  },
  white1: {
    uid: "white1",
    type: "white",
    logo: false,
    plus: true,
    text: "Your Bridge of Trust.",
  },
  white2: {
    uid: "white2",
    type: "white",
    logo: false,
    plus: true,
    text: "No Risk. Just Confidence.",
  },
  ghost1: {
    uid: "ghost1",
    type: "transparent",
    logo: false,
    plus: false,
  },
  ghost2: {
    uid: "ghost2",
    type: "transparent",
    logo: false,
    plus: false,
  },
};

/**
 * Frames define POSITIONS, not identities
 */
const frames: Tile[][] = [
  [
    TILE_POOL.ghost1,
    TILE_POOL.hero,
    TILE_POOL.logo,
    TILE_POOL.white1,
    TILE_POOL.white2,
    TILE_POOL.ghost2,
  ],
  [
    TILE_POOL.logo,
    TILE_POOL.ghost1,
    TILE_POOL.white2,
    TILE_POOL.hero,
    TILE_POOL.ghost2,
    TILE_POOL.white1,
  ],
  [
    TILE_POOL.white2,
    TILE_POOL.logo,
    TILE_POOL.ghost1,
    TILE_POOL.ghost2,
    TILE_POOL.hero,
    TILE_POOL.white1,
  ],
  [
    TILE_POOL.ghost1,
    TILE_POOL.white2,
    TILE_POOL.hero,
    TILE_POOL.logo,
    TILE_POOL.white1,
    TILE_POOL.ghost2,
  ],
];

function MirrorTile() {
  return (
    <div className="relative h-[178px] w-[178px] rounded-2xl overflow-hidden">
      {/* Glass base */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[18px]" />

      {/* Light refraction gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06),rgba(0,0,0,0.25))]opacity-70" />

      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]" />

      {/* Outer depth */}
      <div
        className="absolute inset-0 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.45)]
        "
      />
    </div>
  );
}

export default function AnimatedGrid() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 7200);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative w-[630px] aspect-square rounded-[28px]
                 overflow-hidden p-6
                 bg-black/40 backdrop-blur-xl
                 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
    >
      {/* Background */}
      <img
        src="./auth-frames/frame_background.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* MIRROR TILES (edge reflections only) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top mirrors */}
        <div className="absolute -top-39 left-33 grid grid-cols-2 gap-3 opacity-[0.12]">
          <MirrorTile />
          <MirrorTile />
        </div>

        {/* Bottom mirrors */}
        <div className="absolute -bottom-39 left-33 grid grid-cols-2 gap-3 opacity-[0.12]">
          <MirrorTile />
          <MirrorTile />
        </div>

        {/* Left mirrors */}
        <div className="absolute -left-15 top-1/2 -translate-y-1/2 grid grid-rows-3 gap-3 opacity-[0.12]">
          <MirrorTile />
          <MirrorTile />
          <MirrorTile />
          <MirrorTile />
          <MirrorTile />
        </div>

        {/* Right mirrors */}
        <div className="absolute -right-15 top-1/2 -translate-y-1/2 grid grid-rows-3 gap-3 opacity-[0.12]">
          <MirrorTile />
          <MirrorTile />
          <MirrorTile />
          <MirrorTile />
          <MirrorTile />
        </div>
      </div>

      {/* REAL ANIMATED GRID */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div layout className="grid grid-cols-2 grid-rows-3 gap-3">
          {frames[index].map((tile) => (
            <motion.div
              key={tile.uid}
              layout
              layoutId={tile.uid}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 50,
                  damping: 20,
                  mass: 0.9,
                },
              }}
              className={`relative h-[178px] w-[178px] rounded-2xl p-4
                          flex flex-col shadow-[0_12px_30px_rgba(0,0,0,0.35)]
                          before:absolute before:inset-0 before:rounded-2xl
                          before:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
              ${
                tile.type === "brown"
                  ? "bg-[#8E6C4C] text-white justify-end items-start scale-[1.02]"
                  : tile.type === "brown_with_logo"
                  ? "bg-[#8E6C4C] flex items-center justify-center"
                  : tile.type === "transparent"
                  ? "bg-white/5 backdrop-blur-md border border-white/10"
                  : "bg-white justify-between items-start text-black"
              }`}
            >
              {/* Brown texture */}
              {tile.type === "brown" && (
                <div
                  className="absolute inset-0 opacity-15
             bg-[linear-gradient(#ffffff_0.8px,transparent_0.8px),linear-gradient(90deg,#ffffff_0.8px,transparent_0.8px)]
             bg-size-[15px_15px]
            "
                />
              )}

              {tile.logo && (
                <img
                  src="/auth-frames/logoFrameEagleblack.png"
                  alt="logo"
                  className="w-16"
                />
              )}

              {tile.plus && (
                <div className="text-xl font-medium text-black">+</div>
              )}

              {tile.text && (
                <div className="font-medium text-[15px] leading-snug max-w-[90%]">
                  {tile.text}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
