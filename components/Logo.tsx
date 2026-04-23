import Image from "next/image";
import Link from "next/link";

type LogoSize = "default" | "large";

const sizeClassMap: Record<LogoSize, string> = {
  default: "w-auto h-[108px]",
  large: "w-auto h-[200px]",
};

export function Logo({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: LogoSize;
}) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Link href="/" className="transition-opacity hover:opacity-80">
        <Image
          src="/logo.svg"
          alt="Align on the Line - Center for Digital Thriving"
          width={450}
          height={130}
          className={sizeClassMap[size]}
          priority
        />
      </Link>
    </div>
  );
}
