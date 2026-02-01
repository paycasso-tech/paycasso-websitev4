import React from "react";

export const whyChooseUsCards = [
  {
    id: 0,
    colSpan: "md:col-span-2",
    icon: "/website/dual.svg",
    title: "Dual Sided Protection",
    description: (
      <>
        Fairness <b className="text-white">guaranteed for both sides</b>.
        <br />
        Funds locked in <b className="text-white">
          smart escrow contracts
        </b>{" "}
        until milestones are completed.
      </>
    ),
    features: [
      "✓ Powered by L1 base infrastructure",
      "✓ Bridge assets seamlessly",
      "✓ Easy to use interface",
    ],
  },

  {
    id: 1,
    colSpan: "md:col-span-1",
    hideOnMobile: true,
    icon: "/website/secure-icon.svg",
    title: "Decentralised Trust",
    description:
      "Replace middlemen with decentralized smart contracts. Funds stay secured on-chain.",
  },

  {
    id: 2,
    colSpan: "md:col-span-1",
    icon: "/website/dispute.svg",
    title: "Dispute Resolution",
    description:
      "Multi-layered dispute resolution powered by DAO Agents and LLM Council.",
    hasDispute: true,
  },

  {
    id: 3,
    colSpan: "md:col-span-1",
    icon: "/website/choose-arrow.svg",
    title: "Instant Settlements. Minimal Fees",
    bgImage: true,
  },

  {
    id: 4,
    colSpan: "md:col-span-1",
    icon: "/website/ml.svg",
    title: "Immutable Resolution",
    description:
      "Never lose money to ghosting or scams again. Get refunds if you aren't at fault.",
    hasML: true,
  },
];
