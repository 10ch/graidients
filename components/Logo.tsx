export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <h1 className="text-4xl font-normal text-gray-600 flex items-center justify-center">
        <span>gr</span>
        <span className="inline-flex items-center justify-center w-[50px] h-[50px] border-2 border-dashed border-gray-500 rounded mx-1">
          <span className="text-black font-semibold">ai</span>
        </span>
        <span>dients</span>
      </h1>
      <p className="text-center text-gray-600 text-xs tracking-[0.2em] mt-2 uppercase">
        Center for Digital Thriving
      </p>
    </div>
  );
}