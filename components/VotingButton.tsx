"use client";

interface VotingButtonProps {
  label: string;
  value: number;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function VotingButton({
  label,
  value: _value,
  isSelected,
  onClick,
  disabled = false,
}: VotingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3 px-4 text-base font-medium rounded-lg transition-all duration-200
        ${
          isSelected
            ? "bg-gray-600 text-white shadow-lg"
            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {label}
    </button>
  );
}
