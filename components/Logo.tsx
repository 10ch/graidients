import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Image
        src="/logo.svg"
        alt="Graidients - Center for Digital Thriving"
        width={200}
        height={58}
        className="w-auto h-12"
        priority
      />
    </div>
  );
}