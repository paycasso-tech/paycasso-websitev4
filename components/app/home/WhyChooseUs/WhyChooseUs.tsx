"use client";
import React, { useState, useEffect, useMemo } from "react";
import SectionUnderlineLabel from "@/components/app/home/OurServices/section-underline-label";
import WhyChooseUsCard from "./WhyChooseUsCard";
import { whyChooseUsCards } from "./whyChooseUsData";

export default function WhyChooseUs() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [safeEmails, setSafeEmails] = useState<string[][]>([]);

  useEffect(() => {
    const generated = [60, 30, 45].map(() =>
      Array.from({ length: 20 }).map(
        () => `user${Math.floor(Math.random() * 9999)}@example.com`,
      ),
    );
    setSafeEmails(generated);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsInView(true),
      { threshold: 0.1 },
    );
    const el = document.getElementById("why-choose-us");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cards = useMemo(() => whyChooseUsCards, []);

  return (
    <div
      id="why-choose-us"
      className="flex flex-col justify-center mt-10 md:mt-20 items-center w-full px-4 md:px-6 lg:px-8"
    >
      <SectionUnderlineLabel title="Why Choose Us" />

      <div className="w-full max-w-5xl md:py-10 pb-4 md:pb-0 ">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <WhyChooseUsCard
              key={card.id}
              card={card}
              index={index}
              isInView={isInView}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              safeEmails={safeEmails}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
