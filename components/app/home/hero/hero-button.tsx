// HeroButton.tsx
import { Button } from "@/components/ui/button";

export default function HeroButton() {
  const handleClick = () => {
    const section = document.getElementById("call-to-action");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ================= MOBILE BUTTON ================= */}
      <div className="mt-6 flex justify-start md:hidden">
        <Button
          onClick={handleClick}
          className="
            rounded-[14px]
            bg-[#F2F2F2] text-[#141313]
            transition-colors
            cursor-pointer
            font-medium
            px-7 py-2 h-[46px] text-sm
          "
        >
          Get Started
        </Button>
      </div>

      {/* ================= DESKTOP BUTTON (UNCHANGED) ================= */}
      <div className="hidden md:flex justify-center mt-8">
        <Button
          onClick={handleClick}
          className="
            rounded-full
            w-[163.37px] h-[52.42px]
            text-lg font-medium
            bg-white text-[#232323]
            hover:bg-gray-200
            transition-colors
            cursor-pointer
          "
        >
          Join Waitlist
        </Button>
      </div>
    </>
  );
}
