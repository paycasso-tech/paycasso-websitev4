"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function BalanceShapes() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const maxOffset = 15; // max pixels to move

      const x = (e.clientX - centerX) / centerX;
      const y = (e.clientY - centerY) / centerY;

      setOffset({
        x: x * maxOffset,
        y: y * maxOffset,
      });
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      className="relative w-full flex justify-center items-center select-none"
      style={{
        transform: `translateX(${offset.x}px) translateY(${offset.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Glow behind image */}
      <div className="absolute w-[320px] h-80 rounded-full bg-white/5 blur-3xl" />

      {/* Shapes Image */}
      <div className="animate-float">
        <Image
          src="/about/group.png"
          alt="3D balance shapes"
          width={320}
          height={420}
          priority
          className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        />
      </div>
    </div>
  );
}
