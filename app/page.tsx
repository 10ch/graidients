"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartSession = async () => {
    setIsCreating(true);

    try {
      // Create a new session
      const { data, error } = await supabase.from("sessions").insert({}).select().single();

      if (error) throw error;

      // Navigate to the presenter view
      router.push(`/presenter/${data.id}`);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="page-container items-center justify-center">
      <div className="content-wrapper">
        <div className="flex flex-col items-center">
          <Logo className="mb-8" />

          <button
            onClick={handleStartSession}
            disabled={isCreating}
            className="btn-primary disabled:opacity-50"
          >
            {isCreating ? "Creating Session..." : "Start a Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
