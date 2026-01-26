"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function AnimatedLogo() {
  const [isVisible, setIsVisible] = React.useState(false);
  const paycassoRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const node = paycassoRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="text-center py-8">
      <h1
        ref={paycassoRef}
        className={`text-5xl font-bold sm:text-8xl md:text-8xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[14rem] bg-linear-to-b from-neutral-700 via-neutral-800 duration-1000 transition-all to-neutral-950 bg-clip-text ease-[cubic-bezier(0.45,0,0.55,1)] text-transparent leading-tight 
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-26"
            }
          `}
      >
        Paycasso
        <span className="">.</span>
      </h1>
    </div>
  );
}
