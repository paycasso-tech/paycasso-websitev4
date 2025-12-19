import Image from "next/image";

export default function LightOverlay() {
  return (
    <div className="absolute inset-0 z-1 pointer-events-none">
      <Image
        src="/our-flow/light/spotlight_background.png"
        alt=""
        fill
        priority
        className="
          object-cover
          mix-blend-screen
          opacity-80
        "
      />
    </div>
  );
}
