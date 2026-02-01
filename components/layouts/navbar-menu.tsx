"use client";
import React from "react";
import { motion } from "motion/react";
import type { Transition } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  route,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  route: string;
}) => {
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => setActive(item)}
      onClick={() => router.push(route)}
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-300"
      >
        {item}
      </motion.p>

      {active === item && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          className="absolute top-[calc(100%_+_1.2rem)] left-1/2 -translate-x-1/2"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        flex items-center justify-center gap-8
        px-8 py-4
        rounded-full
        border border-white/10
        backdrop-blur-lg
        shadow-xl
      "
      style={{
        background: "rgba(255,255,255,0.05)",
        boxShadow: "0 8px 32px rgba(31,38,135,0.22)",
        width: "580px",
      }}
    >
      {children}
    </nav>
  );
};

/* Optional exports unchanged */
export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2 group">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-white">{title}</h4>
        <p className="text-gray-300 text-sm max-w-40">{description}</p>
      </div>
    </a>
  );
};
