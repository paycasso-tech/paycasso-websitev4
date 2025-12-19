import Image from "next/image";

export default function LogoSection() {
  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => (window.location.href = "/")}
    >
      <Image
        src="/logo.png"
        alt="Paycasso Logo"
        width={160}
        height={32}
        priority
        className="h-8 w-40 object-contain"
      />
    </div>
  );
}
