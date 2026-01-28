"use client";
import Image from "next/image";
import React from "react";

type Props = {
  observeRef: React.RefObject<HTMLDivElement>;
};

export default function ServiceCenterVisual({ observeRef }: Props) {
  return (
    <div className="md:col-span-2 relative">
      <Image
        width={200}
        height={200}
        src="/our-services/welcome.svg"
        className="w-full"
        alt=""
      />
      <div ref={observeRef}>
        <Image
          alt=""
          width={200}
          height={200}
          src="/our-services/middle-sphere.svg"
          className="absolute w-56 left-1/2 mt-3 z-2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
