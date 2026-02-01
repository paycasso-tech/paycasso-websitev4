"use client";
import React from "react";

const FOOTER_CONTENT = {
  brand: {
    title: "Paycasso",
    links: [
      { label: "Where", href: "#" },
      { label: "Convenience", href: "#" },
      { label: "Meets Security, Services", href: "#" },
    ],
  },
  nav: [
    { label: "Home", href: "#" },
    { label: "About Wallet", href: "#" },
    { label: "How it works?", href: "#" },
    { label: "Documentation for developers", href: "#" },
  ],
  faq: {
    title: "FAQ",
    contact: "Contact us:",
    queries: [
      {
        label: "Integration related queries:",
        email: "info.paycasso@gmail.com",
      },
      {
        label: "Business related queries:",
        email: "business.paycasso@gmail.com",
      },
    ],
  },
};

export default function Footer() {
  const [isVisible, setIsVisible] = React.useState(false);
  const paycassoRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const node = paycassoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full bg-black mb-16 md:mb-0">
      {/* ================= CONTENT ================= */}
      <div className="flex justify-center">
        <div
          className="
            w-full max-w-5xl
            grid gap-10
            px-6 md:py-14
            sm:grid-cols-2
            md:grid-cols-3
          "
        >
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-white text-2xl font-semibold mb-4">
              {FOOTER_CONTENT.brand.title}
            </h3>
            <ul className="text-sm space-y-2">
              {FOOTER_CONTENT.brand.links.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-neutral-300">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="text-center md:text-left md:flex md:justify-center">
            <ul className="text-sm space-y-2">
              {FOOTER_CONTENT.nav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-neutral-300">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="text-center md:text-left md:flex md:justify-end">
            <div className="space-y-2 max-w-xs">
              <h3 className="text-white text-lg font-semibold">
                {FOOTER_CONTENT.faq.title}
              </h3>
              <div className="text-sm text-neutral-400">
                {FOOTER_CONTENT.faq.contact}
              </div>
              <ul className="text-sm space-y-3">
                {FOOTER_CONTENT.faq.queries.map((item) => (
                  <li key={item.email}>
                    <div className="text-neutral-300">{item.label}</div>
                    <a href="#" className="text-neutral-500 break-all">
                      {item.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BRAND WORDMARK ================= */}
      <div className="text-center py-10">
        <h1
          ref={paycassoRef}
          className={`text-6xl font-bold sm:text-8xl md:text-8xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[14rem]
      bg-linear-to-b from-neutral-700 via-neutral-800 to-neutral-950
      bg-clip-text text-transparent leading-tight
      transition-all duration-1000 ease-[cubic-bezier(0.45,0,0.55,1)]
      ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-8 md:-translate-y-24"
      }
    `}
        >
          Paycasso<span>.</span>
        </h1>
      </div>
    </footer>
  );
}
