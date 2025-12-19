import BackgroundVideo from "@/components/our-flow/BackgroundVideo";
import CryptoBackground from "@/components/our-flow/CryptoBackground";
import HeroText from "@/components/our-flow/HeroText";
import LightOverlay from "@/components/our-flow/LightOverlay";
import Navbar from "@/components/layouts/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* 1. Video */}
        <BackgroundVideo />

        {/* 2. Crypto grid */}
        <CryptoBackground />

        {/* 3. Light image */}
        <LightOverlay />

        <div
          className="absolute inset-0 z-1
        bg-linear-to-b from-black/10 via-black/20 to-black/30"
        />
        {/* 4. Text */}
        <HeroText />
      </main>
    </>
  );
}
