"use client";
import React, { useEffect, useState } from "react";
import SectionUnderlineLabel from "@/components/app/home/section-underline-label";
import WhyChooseUsCard from "./WhyChooseUsCard";

export default function WhyChooseUs() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById("why-choose-us");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why-choose-us"
      className="w-full px-4 md:px-6 lg:px-8 mt-16 md:mt-28"
    >
      <SectionUnderlineLabel title="Why Choose Us ?" />

      <div className="mx-auto max-w-5xl lg:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="grid grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="col-span-2">
            <WhyChooseUsCard type="dual" animate={inView} />
          </div>

          {/* Card 2 */}
          <WhyChooseUsCard type="dispute" animate={inView} />

          {/* Card 3 */}
          <WhyChooseUsCard type="pocket" animate={inView} />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          {/* Paragraph */}
          <p className="text-sm md:text-base text-[#B8B8B8] leading-relaxed">
            From day one, we’ve focused on building a foundation of trust. Every
            feature is designed to protect both sides and ensure confidence in
            every transaction.
          </p>

          {/* Card 4 */}
          <WhyChooseUsCard type="ai" large animate={inView} />
        </div>
      </div>
    </section>
  );
}
