"use client";

import SectionUnderlineLabel from "@/components/app/home/OurServices/section-underline-label";
import Image from "next/image";
import React from "react";
import ServiceCard from "./ServiceCard";

export default function OurServices() {
  const [isVisible, setIsVisible] = React.useState(false);
  const paycassoRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = paycassoRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col my-10 md:my-20 items-center w-full relative">
      {/* background grid */}
      <Image
        alt=""
        width={200}
        height={200}
        src="/website/square-grid-bg.svg"
        className="w-full absolute top-0 lg:-top-56"
      />

      <SectionUnderlineLabel title="Our Services" />

      {/* ======================= DESKTOP (UNCHANGED) ======================= */}
      <div className="hidden md:block relative z-10">
        <div className="hidden md:grid w-full max-w-5xl grid-cols-4 gap-5 py-10 relative z-10">
          {/* LEFT */}
          <ServiceCard
            icon="/website/smart-contract-escrow.svg"
            title="Smart Contract Escrow"
            description="Create trustless agreements between clients and freelancers funds are locked until work is completed and approved."
          />

          {/* CENTER */}
          <div className="col-span-2 relative">
            <Image
              src="/our-services/welcome.svg"
              alt=""
              width={200}
              height={200}
              className="w-full"
            />
            <div ref={paycassoRef}>
              <Image
                src="/our-services/middle-sphere.svg"
                alt=""
                width={200}
                height={200}
                className="absolute z-20 w-56 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* RIGHT */}
          <ServiceCard
            icon="/website/gasless-transaction.svg"
            title="Gasless Transactions"
            description="Transact without worrying about gas fees powered by Base and optimized for efficiency."
          />

          <ServiceCard
            icon="/our-services/instant-settlement.svg"
            title="Instant USDC Settlements"
            description="Receive or send payments globally with zero delays settle in USDC instantly through blockchain rails."
          />

          <ServiceCard
            icon="/our-services/fiat-onboarding.svg"
            title="Fiat & Crypto Onboarding"
            description="Top up using fiat or existing crypto convert directly to USDC in your Paycasso wallet."
            bgImage="/our-services/orange-svg-bg.svg"
          />

          <ServiceCard
            icon="/our-services/borderless-tools.svg"
            title="Borderless Business Tools"
            description="Enable your freelance agency or business to serve global clients securely."
            bgImage="/our-services/purple-svg-bg.svg"
            alignRightIcon
          />

          <ServiceCard
            icon="/our-services/dispute-res.svg"
            title="Decentralized Dispute Resolution"
            description="Raise disputes when needed DAO-based reviewers ensure fair outcomes."
          />
        </div>
      </div>

      {/* ======================= MOBILE (NEW) ======================= */}
      <div className="md:hidden w-full px-4 relative z-10">
        {/* Sphere */}
        <div className="relative flex justify-center -mt-2 -mb-19 z-20">
          <Image
            src="/our-services/middle-sphere.svg"
            alt=""
            width={200}
            height={200}
            className="w-40"
          />
        </div>

        {/* Fiat + Borderless */}
        <div className="grid grid-cols-2 gap-4 -mt-4">
          <ServiceCard
            icon="/our-services/fiat-onboarding.svg"
            title="Fiat & Crypto Onboarding"
            description="Top up using fiat or crypto convert directly to USDC."
            bgImage="/our-services/orange-svg-bg.svg"
          />
          <ServiceCard
            icon="/our-services/borderless-tools.svg"
            title="Borderless Business Tools"
            description="Serve global clients securely with blockchain-powered tools."
            bgImage="/our-services/purple-svg-bg.svg"
            alignRightIcon
          />
        </div>

        {/* Remaining cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <ServiceCard
            icon="/website/gasless-transaction.svg"
            title="Gasless Transactions"
            description="Optimized for efficiency on Base."
          />
          <ServiceCard
            icon="/website/smart-contract-escrow.svg"
            title="Smart Contract Escrow"
            description="Funds locked until work is approved."
          />
          <ServiceCard
            icon="/our-services/dispute-res.svg"
            title="Decentralized Dispute Resolution"
            description="DAO-based dispute resolution."
          />
          <ServiceCard
            icon="/our-services/instant-settlement.svg"
            title="Instant USDC Settlements"
            description="Instant global payments via blockchain."
          />
        </div>
      </div>

      {/* animated background */}
      <Image
        width={200}
        height={200}
        alt=""
        src="/our-services/services-background.svg"
        className={`absolute w-full bottom-0 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-32"
        }`}
      />
    </div>
  );
}
