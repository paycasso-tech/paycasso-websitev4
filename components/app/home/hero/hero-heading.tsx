export default function HeroHeading() {
  return (
    <>
      {/* ================= MOBILE HERO TEXT ================= */}
      <div className="md:hidden w-full">
        {/* Logo line spacing handled by HeroSection */}
        <h1 className="text-[#F2F2F2] font-medium leading-16 text-[46px] mb-4">
          Built on <br />
          certainty, not <br />
          assumptions.
        </h1>

        <div className="w-full h-[1px] bg-white/40 mb-4" />

        <p className="text-[#B8B8B8] font-medium leading-normal max-w-xs text-sm">
          Every interaction is verified, secured, and designed to earn trust —
          not ask for it.
        </p>
      </div>

      {/* ================= DESKTOP HERO TEXT (UNCHANGED) ================= */}
      <h1 className="hidden md:block mx-auto mt-8 max-w-[559px] text-center text-lg md:text-2xl leading-[129%] font-normal font-varta text-[#BEBEBE]">
        The future of money we build together
      </h1>
    </>
  );
}
