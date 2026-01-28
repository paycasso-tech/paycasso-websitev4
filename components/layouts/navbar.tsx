"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LogoSection from "../shared/icons/logo-section";
import { Menu, MenuItem } from "./navbar-menu";
import { Button } from "../ui/button";
import { IoArrowRedoCircleOutline } from "react-icons/io5";
import { Home, Layers, Workflow, LayoutGrid } from "lucide-react";
import Image from "next/image";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      {/* ================= DESKTOP / TABLET NAVBAR ================= */}
      <div
        className={cn(
          "hidden md:flex fixed top-2 inset-x-0 max-w-3xl mx-auto z-50 items-center justify-center",
          className,
        )}
      >
        <Menu setActive={setActive}>
          <div className="flex items-center">
            <LogoSection />
          </div>

          <div className="flex flex-row gap-x-8 whitespace-nowrap items-center">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Home"
              route="/"
            />
            <MenuItem
              setActive={setActive}
              active={active}
              item="How It Works"
              route="/how-it-works"
            />
            <MenuItem
              setActive={setActive}
              active={active}
              item="Our Flow"
              route="/our-flow"
            />

            <Link href="/dashboard">
              <Button className="py-3 px-4 bg-white text-black font-semibold text-md rounded-4xl hover:bg-gray-300">
                Get App
                <IoArrowRedoCircleOutline />
              </Button>
            </Link>
          </div>
        </Menu>
      </div>

      {/* ================= MOBILE BOTTOM NAVBAR ================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-black/90 backdrop-blur border-t border-white/10">
        <div className="flex h-full items-center justify-around text-xs text-white">
          <MobileNavItem
            href="/"
            icon={
              <Image
                src="/logoFrameEagle.png"
                alt="Paycasso"
                width={50}
                height={50}
                className="h-auto"
              />
            }
            label=""
          />
          <MobileNavItem
            href="/how-it-works"
            icon={<Layers size={35} />}
            label=""
          />
          <MobileNavItem
            href="/our-flow"
            icon={<Workflow size={35} />}
            label=""
          />
          <MobileNavItem
            href="/dashboard"
            icon={<LayoutGrid size={35} />}
            label=""
          />
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 text-white/80 hover:text-white"
    >
      {icon}
      <span className="text-[11px]">{label}</span>
    </Link>
  );
}
