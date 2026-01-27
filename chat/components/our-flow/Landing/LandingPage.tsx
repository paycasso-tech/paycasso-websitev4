import BackgroundVideo from "./BackgroundVideo";
import CryptoBackground from "./CryptoBackground";
import HeroText from "./HeroText";
import LightOverlay from "./LightOverlay";

export default function LandingPage() {
  return (
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
  );
}
