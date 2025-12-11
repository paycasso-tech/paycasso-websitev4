"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type Tile = {
  id: number;
  type: "brown" | "brown_with_logo" | "white" | "transparent";
  logo: boolean;
  plus: boolean;
  text?: string;
};

const frames: Tile[][] = [
  [
    { id: 1, type: "transparent", plus: false, logo: false },
    {
      id: 2,
      type: "brown",
      plus: false,
      logo: false,
      text: "Escrow Made Effortless",
    },
    { id: 3, type: "brown_with_logo", plus: false, logo: true },
    {
      id: 4,
      type: "white",
      plus: true,
      logo: false,
      text: "Your Bridge of Trust.",
    },
    {
      id: 5,
      type: "white",
      plus: true,
      logo: false,
      text: "No Risk. Just Confidence.",
    },
    { id: 6, type: "transparent", plus: false, logo: false },
  ],
  [
    { id: 1, type: "brown_with_logo", plus: false, logo: true },
    { id: 2, type: "transparent", plus: false, logo: false },
    {
      id: 3,
      type: "white",
      plus: true,
      logo: false,
      text: "No Risk. Just Confidence.",
    },
    {
      id: 4,
      type: "brown",
      plus: false,
      logo: false,
      text: "Escrow Made Effortless",
    },
    { id: 5, type: "transparent", plus: false, logo: false },
    {
      id: 6,
      type: "white",
      plus: true,
      logo: false,
      text: "Your Bridge of Trust.",
    },
  ],
  [
    {
      id: 1,
      type: "white",
      plus: true,
      logo: false,
      text: "No Risk. Just Confidence.",
    },
    { id: 2, type: "brown_with_logo", plus: false, logo: true },
    { id: 3, type: "transparent", plus: false, logo: false },
    { id: 4, type: "transparent", plus: false, logo: false },
    {
      id: 5,
      type: "brown",
      plus: false,
      logo: false,
      text: "Escrow Made Effortless",
    },
    {
      id: 6,
      type: "white",
      plus: true,
      logo: false,
      text: "Your Bridge of Trust.",
    },
  ],
  [
    { id: 1, type: "transparent", plus: false, logo: false },
    {
      id: 2,
      type: "white",
      plus: true,
      logo: false,
      text: "No Risk. Just Confidence.",
    },
    {
      id: 3,
      type: "brown",
      plus: false,
      logo: false,
      text: "Escrow Made Effortless",
    },
    { id: 4, type: "brown_with_logo", plus: false, logo: true },
    {
      id: 5,
      type: "white",
      plus: true,
      logo: false,
      text: "Your Bridge of Trust.",
    },
    { id: 6, type: "transparent", plus: false, logo: false },
  ],
  [
    {
      id: 1,
      type: "brown",
      plus: false,
      logo: false,
      text: "Escrow Made Effortless",
    },
    { id: 2, type: "transparent", plus: false, logo: false },
    {
      id: 3,
      type: "white",
      plus: true,
      logo: false,
      text: "Your Bridge of Trust.",
    },
    {
      id: 4,
      type: "white",
      plus: true,
      logo: false,
      text: "No Risk. Just Confidence.",
    },
    { id: 5, type: "transparent", plus: false, logo: false },
    { id: 6, type: "brown_with_logo", plus: false, logo: true },
  ],
  [
    { id: 1, type: "transparent", plus: false, logo: false },
    {
      id: 2,
      type: "brown",
      plus: false,
      logo: false,
      text: "Escrow Made Effortless",
    },
    { id: 3, type: "brown_with_logo", plus: false, logo: true },
    {
      id: 4,
      type: "white",
      plus: true,
      logo: false,
      text: "Your Bridge of Trust.",
    },
    {
      id: 5,
      type: "white",
      plus: true,
      logo: false,
      text: "No Risk. Just Confidence.",
    },
    { id: 6, type: "transparent", plus: false, logo: false },
  ],
];

export default function AnimatedGrid() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 2000); // Change frame every 2s

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative left-15 h-155 w-140 rounded-3xl overflow-hidden justify-center items-center">
      <img
        src="./auth-frames/frame_background.png"
        alt="Paycasso Platform"
        className="absolute inset-0 h-full w-full object-cover shadow-[0px_2px_53.8px_0px_#ffffff0f]"
      />
      <motion.div
        layout
        className="absolute left-19 top-4 grid grid-cols-2 gap-x-3 gap-y-3 shadow-custom-light justify-center "
      >
        {frames[index].map((tile) => (
          <motion.div
            key={tile.id}
            layout
            layoutId={`tile-${tile.id}`}
            transition={{
              layout: {
                type: "spring",
                damping: 15, // lower = smoother slide
                stiffness: 45, // lower = softer movement
                mass: 1,
                duration: 0.6,
                ease: "easeInOut",
              },
              delay: 1,
            }}
            className={`h-47 w-49 rounded-2xl flex flex-col text-black text-lg font-semibold p-4 shadow-lg
            ${
              tile.type === "brown"
                ? "bg-[#8E6C4C] text-white justify-end items-start"
                : tile.type === "brown_with_logo"
                ? "bg-[#8E6C4C] justify-center items-center"
                : tile.type === "transparent"
                ? "bg-[#FFFFFF29]"
                : "bg-[#FFFFFF] text-black justify-between items-start "
            }
          `}
          >
            {tile.logo == true && (
              <img
                src="/auth-frames/logoFrameEagleblack.png"
                alt="logo"
                className="w-18"
              />
            )}
            {tile.plus == true && (
              <div className="text-2xl font-semibold">+</div>
            )}
            {tile.text ? (
              <div className="font-normal text-lg leading-tight">
                {tile.text}
              </div>
            ) : null}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
