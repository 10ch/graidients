import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="Graidients - Center for Digital Thriving"
        width={450}
        height={130}
        className="w-auto h-[108px]"
        priority
      />
    </div>
  );
}