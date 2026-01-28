import React from "react";

export const whyChooseUsCards = [
  {
    id: 0,
    colSpan: "col-span-3 lg:col-span-2",
    mobileSpan: "col-span-2",
    icon: "/website/dual.svg",
    title: "Dual Sided Protection",
    description: (
      <div className="text-neutral-400">
        <p className="w-full max-w-xs text-sm md:mb-2">
          Fairness{" "}
          <span className="text-neutral-200 font-semibold">
            guaranteed for both sides
          </span>
        </p>
        <p className="w-full max-w-[18rem] text-sm">
          Funds locked in{" "}
          <span className="text-neutral-200 font-semibold">
            smart escrow contract
          </span>{" "}
          until milestones are completed
        </p>
      </div>
    ),
    features: [
      "✓ Powered by L1 base infrastucture",
      "✓ Bridge your assets seamlessly",
      "✓ Easy to use interface",
    ],
    illustration: "/website/lock-vector.svg",
  },
  {
    id: 1,
    colSpan: "col-span-3 lg:col-span-1",
    mobileSpan: "col-span-2",
    icon: "/website/secure-icon.svg",
    title: "Decentralised Trust",
    description: (
      <p className="w-full text-sm text-neutral-400">
        <span className="text-neutral-200 font-semibold">
          Replace middlemen with decentralized smart contracts.
        </span>{" "}
        Your funds stay secured on-chain.
      </p>
    ),
    hasMarquee: true,
  },
  {
    id: 2,
    colSpan: "col-span-3 lg:col-span-1",
    mobileSpan: "col-span-1",
    icon: "/website/dispute.svg",
    title: "Dispute Resolution",
    description: (
      <p className="w-full text-xs md:text-sm text-neutral-400">
        Multi-layered Dispute Resolution{" "}
        <span className="text-neutral-200 font-semibold">
          Powered by DAO Agents and LLM Council.
        </span>
      </p>
    ),
    hasDispute: true,
  },
  {
    id: 3,
    colSpan: "col-span-3 lg:col-span-1",
    mobileSpan: "col-span-1",
    icon: "/website/choose-arrow.svg",
    title: "Instant Settlements. Minimal Fees",
    bgImage: true,
  },
  {
    id: 4,
    colSpan: "col-span-3 lg:col-span-1",
    mobileSpan: "col-span-2",
    icon: "/website/ml.svg",
    title: "Immutable Resolution",
    description: (
      <p className="w-full text-sm text-neutral-400">
        Get your money back if you aren't at fault{" "}
        <span className="text-neutral-200 font-semibold">
          Never lose money to ghosting or scams again;
        </span>
      </p>
    ),
    hasML: true,
  },
];
