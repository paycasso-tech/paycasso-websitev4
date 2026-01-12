"use client";

import { motion } from "framer-motion";
import FlowPair from "./FlowPair";
import { flowPairsData } from "./flowPairsData";

type FlowControls = ReturnType<typeof import("framer-motion").useAnimation>;

export default function FlowChart({ controls }: { controls: FlowControls }) {
  return (
    <motion.div
      className="relative w-[520px] h-[520px]"
      initial="initial"
      animate={controls}
      variants={{
        initial: {},
        enter: {
          transition: {
            staggerChildren: 0.16,
          },
        },
      }}
    >
      {flowPairsData.map((pair) => (
        <FlowPair key={pair.id} data={pair} />
      ))}
    </motion.div>
  );
}
