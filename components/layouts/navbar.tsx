"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LogoSection from "../shared/icons/logo-section";
import { Menu, MenuItem } from "./navbar-menu";
import { Button } from "../ui/button";
import { IoArrowRedoCircleOutline } from "react-icons/io5";
import { Layers, Workflow, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type MobileItem = "home" | "how" | "flow" | "app";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  const activeMobile: MobileItem =
    pathname === "/how-it-works"
      ? "how"
      : pathname === "/our-flow"
        ? "flow"
        : pathname === "/dashboard"
          ? "app"
          : "home";

  return (
    <>
      {/* ================= DESKTOP NAVBAR (UNCHANGED) ================= */}
      <div
        className={cn(
          "hidden md:flex fixed top-2 inset-x-0 z-50 items-center justify-center",
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
              <Button className="py-3 px-4 bg-white text-black font-semibold rounded-4xl flex items-center gap-2">
                Get App
                <IoArrowRedoCircleOutline />
              </Button>
            </Link>
          </div>
        </Menu>
      </div>

      {/* ================= MOBILE EXPANDABLE PILL NAVBAR ================= */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className="
            flex items-center gap-2
            px-2 py-2
            w-[92vw] max-w-sm
            rounded-full
            border border-white/10
            backdrop-blur-lg
            shadow-xl
          "
          style={{
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 8px 32px rgba(31,38,135,0.25)",
          }}
        >
          <MobileNavButton
            active={activeMobile === "home"}
            href="/"
            icon={
              <Image
                src="/logoFrameEagle.png"
                alt="Paycasso"
                width={22}
                height={22}
              />
            }
            label="Paycasso"
          />

          <MobileNavButton
            active={activeMobile === "how"}
            href="/how-it-works"
            icon={<Layers size={20} />}
            label="How it works"
          />

          <MobileNavButton
            active={activeMobile === "flow"}
            href="/our-flow"
            icon={<Workflow size={20} />}
            label="Our Flow"
          />

          <MobileNavButton
            active={activeMobile === "app"}
            href="/dashboard"
            icon={<LayoutGrid size={20} />}
            label="Get App"
          />
        </div>
      </nav>
    </>
  );
}

/* ================= MOBILE NAV ITEM ================= */

function MobileNavButton({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        `
        flex items-center gap-2
        px-4 py-2
        rounded-full
        transition-all duration-300 ease-out
        overflow-hidden justify-center
      `,
        active
          ? "grow bg-white/15 text-white"
          : "grow-0 text-white/70 hover:text-white",
      )}
    >
      <div className="shrink-0">{icon}</div>

      <span
        className={cn(
          "text-sm whitespace-nowrap transition-all duration-300",
          active ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
