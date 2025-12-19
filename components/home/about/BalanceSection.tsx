"use client";

import { useEffect, useRef, useState } from "react";
import BalanceShapes from "./BalanceShapes";
import Image from "next/image";

const headlineTexts = [
  "stability built on balance",
  "payments built on trust",
  "work built on fairness",
];

const paragraphs = [
  "Our vision is to revolutionize global work payments with secure, low-cost, and transparent smart contract-based escrow and instant USDC settlements.",
  "Pay and get paid in stablecoins USDC which are pegged 1:1 with US dollars.",
  "Fairness guaranteed for both sides. Funds locked in smart contract escrow until contract conditions are met.",
  "Convert Bitcoin, Ethereum, and other tokens to USDC and pay freelancers and gig workers instantly.",
];

export default function BalanceSection() {
  /* ---------- Headline swap ---------- */
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((i) => (i + 1) % headlineTexts.length);
        setFade(true);
      }, 400);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  /* ---------- Scroll reveal ---------- */
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="min-h-screen bg-black text-white flex items-center px-6 md:px-20">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
        {/* LEFT */}
        <div className="relative flex w-full items-center space-y-6">
          <h1
            className={`text-[70px] md:text-[60px] font-bold leading-tight
            transition-all duration-500 w-[50%]
            ${
              fade
                ? "opacity-100 blur-0 drop-shadow-[0_0_28px_rgba(255,255,255,0.25)]"
                : "opacity-0 blur-[6px]"
            }`}
          >
            {headlineTexts[index]}
          </h1>

          <div className="w-[40%]">
            <BalanceShapes />
          </div>
        </div>

        {/* RIGHT */}
        <div ref={ref} className="space-y-6 max-w-xl items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Hi, We’re{" "}
            <span className="relative w-32 h-8">
              <Image
                src="/logo.png"
                alt="Paycasso Logo"
                width={160}
                height={32}
                priority
                className="h-8 w-40 object-contain"
              />
            </span>
          </h2>

          {paragraphs.map((text, i) => (
            <p
              key={i}
              className={`text-white/80 transition-all duration-700 ease-out ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {text}
            </p>
          ))}

          <p
            className={`pt-4 text-white/50 transition-all duration-700 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            Ready to be a part of something remarkable?
          </p>
        </div>
      </div>
    </section>
  );
}
