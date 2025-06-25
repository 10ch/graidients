"use client";

import { useState } from "react";
import { sanitizeInput } from "@/lib/utils";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

export function QuestionInput({ onSubmit, isLoading = false }: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeInput(question);
    if (sanitized) {
      onSubmit(sanitized);
      setQuestion("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Describe a use of AI..."
          className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          disabled={isLoading}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="btn-primary disabled:opacity-50 whitespace-nowrap"
        >
          Open Vote
        </button>
      </div>
    </form>
  );
}
