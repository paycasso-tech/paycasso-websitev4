import Image from "next/image";

type Props = {
  icon: string;
  title: string;
  description: string;
  bgImage?: string;
  alignRightIcon?: boolean;
};

export default function ServiceCard({
  icon,
  title,
  description,
  bgImage,
  alignRightIcon,
}: Props) {
  return (
    <div
      className="px-3 py-4 md:py-6 space-y-3 border border-neutral-800 rounded-xl bg-black relative overflow-hidden"
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      <div className={alignRightIcon ? "flex justify-end mb-0" : ""}>
        <Image
          src={icon}
          alt=""
          width={48}
          height={48}
          className="w-12 h-12 mb-5 md:mb-15"
        />
      </div>

      <h3 className="text-white font-medium text-lg">{title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
