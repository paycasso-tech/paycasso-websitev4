"use client";
import React from "react";
import Image from "next/image";
import { IconBrandOpenai } from "@tabler/icons-react";
import { SiHuggingface } from "react-icons/si";

type Props = {
  card: any;
  index: number;
  isInView: boolean;
  hoveredCard: number | null;
  setHoveredCard: (id: number | null) => void;
  safeEmails: string[][];
};

function WhyChooseUsCard({
  card,
  index,
  isInView,
  hoveredCard,
  setHoveredCard,
  safeEmails,
}: Props) {
  return (
    <div
      className={`${card.mobileSpan ?? "col-span-2"} md:${card.colSpan}
        relative bg-neutral-950/80
        backdrop-blur-none md:backdrop-blur-sm
        border border-neutral-800/50
        flex flex-col justify-between
        h-auto md:h-96 lg:h-112
        rounded-2xl overflow-hidden
        group transition-all duration-700
        md:hover:border-blue-500/30
        md:hover:shadow-2xl md:hover:shadow-blue-500/10
        ${isInView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}
      `}
      style={{
        transitionDelay: `${index * 150}ms`,
        ...(card.bgImage && {
          backgroundImage: "url('/website/pocket-friendly.svg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
      }}
      onMouseEnter={() => setHoveredCard(card.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 space-y-4 p-4 md:p-6 lg:p-7">
        <div className="flex items-center gap-2">
          <Image
            src={card.icon}
            width={20}
            height={20}
            alt=""
            className="object-contain"
          />
          <h3 className="font-bold text-lg md:text-xl text-white">
            {card.title}
          </h3>
        </div>
        {card.description && <div>{card.description}</div>}
      </div>

      {card.features && (
        <div className="px-4 md:px-6 lg:px-7 pb-6 md:pb-0">
          <ul className="text-xs font-medium md:text-sm md:space-y-1 md:text-neutral-300">
            {card.features.map((f: string, i: number) => (
              <li
                key={i}
                className={`pb-1 md:pb-4 transition-all duration-500 ${
                  hoveredCard === card.id
                    ? "md:translate-x-2 md:text-green-400"
                    : ""
                }`}
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {card.illustration && (
        <Image
          width={200}
          height={200}
          src={card.illustration}
          className={`absolute w-full max-w-25 md:max-w-64 right-2 md:right-4 top-28 md:top-1/2 md:-translate-y-1/3 opacity-30 md:group-hover:opacity-50 transition-all duration-500 ${
            hoveredCard === card.id ? "md:scale-110 md:rotate-3" : ""
          }`}
          alt=""
        />
      )}

      {card.hasMarquee && safeEmails.length > 0 && (
        <div className="space-y-3 overflow-hidden pb-3 md:pb-16">
          {safeEmails.map((row, i) => (
            <div
              key={i}
              className="animate-marquee-horizontal flex gap-3 text-neutral-400"
              style={
                { "--duration": `${[60, 30, 45][i]}s` } as React.CSSProperties
              }
            >
              {[...row, ...row].map((email, idx) => (
                <div
                  key={idx}
                  className="py-2 px-4 border rounded-lg border-neutral-700 text-xs whitespace-nowrap"
                >
                  {email}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {card.hasDispute && (
        <div className="md:pb-16 px-4 md:px-6 lg:px-7">
          <Image
            src="/website/dispute-resolution.svg"
            width={200}
            height={200}
            alt=""
            className="md:opacity-80"
          />
        </div>
      )}

      {card.hasML && (
        <>
          <div className="p-4 md:p-6 lg:p-7 text-sm space-y-3">
            <div className="flex items-center gap-3 text-neutral-300">
              <IconBrandOpenai className="w-5 h-5" />
              OpenAI
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <SiHuggingface className="w-5 h-5" />
              Hugging Face
            </div>
          </div>
          <Image
            src="/website/ml-models.svg"
            width={200}
            height={200}
            alt=""
            className="absolute h-full w-auto -bottom-7 right-0 opacity-20"
          />
        </>
      )}
    </div>
  );
}

export default React.memo(WhyChooseUsCard);
