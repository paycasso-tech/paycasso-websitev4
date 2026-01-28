import Image from "next/image";

export default function HeroImage() {
  return (
    <>
      {/* ================= MOBILE HERO IMAGE (CRISP) ================= */}
      <div className="md:hidden w-full mt-10 flex justify-center">
        <div
          className="
      w-full max-w-sm
      rounded-2xl
      border border-[#FAFAFA40]
      bg-[#9292920A]
      p-3
      shadow-[0_4px_12px_0_#2323234D]
      overflow-hidden
    "
        >
          <Image
            src="/demo2.png"
            alt="Demo"
            width={900}
            height={560}
            className="w-full h-auto rounded-xl"
            priority
          />
        </div>
      </div>

      {/* ================= DESKTOP HERO IMAGE (FIXED) ================= */}
      <div
        className="
    hidden md:flex
    mx-auto mt-12
    justify-center items-center
    w-[970px] h-[640px]
    rounded-[20px]
    border border-[#FAFAFA75]
    bg-[#9292920A]
    shadow-[0_4px_4px_0_#2323237D,1px_4px_17.1px_0_#FFFFFF0A_inset]
    p-[19px] py-2
    overflow-hidden
  "
      >
        <div className="relative w-full h-full">
          <Image
            src="/demo2.svg"
            alt="Demo"
            fill
            className="object-contain rounded-[20px]"
            priority
          />
        </div>
      </div>
    </>
  );
}
