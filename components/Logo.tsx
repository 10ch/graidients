import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Link href="/" className="transition-opacity hover:opacity-80">
        <Image
          src="/logo.svg"
          alt="Graidients - Center for Digital Thriving"
          width={450}
          height={130}
          className="w-auto h-[108px]"
          priority
        />
      </Link>
    </div>
  );
}