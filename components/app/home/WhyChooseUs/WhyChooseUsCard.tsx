"use client";
import Image from "next/image";
import { IconBrandOpenai } from "@tabler/icons-react";
import { SiHuggingface } from "react-icons/si";

type Props = {
  type: "dual" | "dispute" | "pocket" | "ai";
  large?: boolean;
  animate?: boolean;
};

export default function WhyChooseUsCard({ type, large, animate }: Props) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        border border-neutral-800
        bg-neutral-950/90 backdrop-blur-sm
        transition-all duration-700
        ${large ? "min-h-[360px]" : "min-h-[220px]"}
        ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
    >
      {/* ========== CARD 1 ========= */}
      {type === "dual" && (
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-md md:text-lg font-semibold text-white">
              Dual Sided Protection
            </h3>

            <p className="mt-3 text-xs md:text-sm text-[#B8B8B8] lg:max-w-sm">
              Fairness guaranteed for{" "}
              <span className="text-white font-medium">both sides.</span>
            </p>
            <p className="text-xs md:text-sm text-[#B8B8B8] lg:max-w-sm">
              Funds locked in{" "}
              <span className="text-white font-medium">
                smart escrow contract
              </span>{" "}
              until milestones are completed.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-xs md:text-sm text-[#B8B8B8]">
            <li>
              <span className="text-green-400">✓</span> 100% user friendly
            </li>
            <li>
              <span className="text-green-400">✓</span> Will become your
              companion
            </li>
            <li>
              <span className="text-green-400">✓</span> Easy to use
            </li>
          </ul>
          {/* image for desktop */}
          <Image
            src="/website/lock-vector.svg"
            width={140}
            height={240}
            alt=""
            className="hidden md:block absolute right-4 -bottom-14 -translate-y-1/2 opacity-50 "
          />
          {/* image for mobile */}
          <Image
            src="/website/lock-vector.svg"
            width={100}
            height={240}
            alt=""
            className="block md:hidden absolute right-4 -bottom-10 -translate-y-1/2 opacity-50 "
          />
        </div>
      )}

      {/* ========== CARD 2 ========= */}
      {type === "dispute" && (
        <div className="p-6 h-full">
          <h3 className="text-md md:text-lg font-semibold text-white">
            Dispute Resolution with DAOs
          </h3>

          <Image
            src="/website/dispute-resolution.svg"
            width={260}
            height={160}
            alt=""
            className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-70"
          />
        </div>
      )}

      {/* ========== CARD 3 ========= */}
      {type === "pocket" && (
        <div className="p-6 h-full bg-cover">
          <h3 className="text-md md:text-lg font-semibold text-white">
            Your Pocket Friendly Crypto
          </h3>
          <Image
            src="/website/pocket-friendly.svg"
            width={260}
            height={160}
            alt=""
            className="absolute -bottom-14 left-1/2 -translate-x-1/2 opacity-70"
          />
        </div>
      )}

      {/* ========== CARD 4 (FIXED AS PER FIGMA) ========= */}
      {type === "ai" && (
        <div className="p-6 h-full lg:h-[58vh] flex flex-col justify-between">
          {/* TOP AI BLOCK */}
          <div>
            <h3 className="text-md md:text-lg font-semibold text-white flex items-center gap-2">
              AI Integration
            </h3>

            <p className="mt-3 text-sm text-neutral-400 max-w-sm">
              Integrate your favourite ML-models to{" "}
              <span className="text-white font-medium">
                store, index and search vector embeddings
              </span>
            </p>

            <div className="mt-4 flex gap-6 text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <IconBrandOpenai size={18} /> OpenAI
              </div>
              <div className="flex items-center gap-2">
                <SiHuggingface size={18} /> Hugging Face
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="my-5 h-px w-full bg-neutral-800" />

          {/* BOTTOM AI BLOCK */}
          <div className="pb-9">
            <h4 className="text-md md:text-lg font-semibold text-white flex items-center gap-2">
              AI Integration
            </h4>

            <p className="mt-2 text-sm text-neutral-400 max-w-sm">
              Funds are secured in{" "}
              <span className="text-white font-medium">
                decentralized escrow
              </span>{" "}
              until tasks are verified
            </p>
          </div>

          {/* CUBE */}
          <Image
            src="/website/ml-models.svg"
            width={260}
            height={260}
            alt=""
            className="absolute -bottom-23 right-0 opacity-55 pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
