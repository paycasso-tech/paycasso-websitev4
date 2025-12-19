import type { ReactNode } from "react";

export default function OurFlowLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {children}
    </main>
  );
}
