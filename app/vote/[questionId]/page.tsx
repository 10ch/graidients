"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { VotingButton } from "@/components/VotingButton";
import { supabase } from "@/lib/supabase";
import { Question } from "@/lib/types";
import { VOTE_OPTIONS } from "@/lib/types";
import { getVoterFingerprint, hasVotedOnQuestion, markVoted, getVotedRating } from "@/lib/utils";

export default function VotingView() {
  const params = useParams();
  const questionId = params.questionId as string;
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already voted and get the rating
    if (hasVotedOnQuestion(questionId)) {
      setHasVoted(true);
      const savedRating = getVotedRating(questionId);
      if (savedRating) {
        setSelectedRating(savedRating);
      }
    }

    // Fetch question details
    const fetchQuestion = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (!error && data) {
        setQuestion(data);
      }
      setIsLoading(false);
    };

    fetchQuestion();
  }, [questionId]);

  const handleVote = async () => {
    if (!selectedRating || isSubmitting || hasVoted) return;

    setIsSubmitting(true);

    try {
      const fingerprint = getVoterFingerprint();

      const { error } = await supabase
        .from("votes")
        .insert({
          question_id: questionId,
          rating: selectedRating,
          voter_fingerprint: fingerprint,
        });

      if (error) {
        // Check if it's a duplicate vote error
        if (error.code === "23505") {
          setHasVoted(true);
          markVoted(questionId, selectedRating);
        } else {
          throw error;
        }
      } else {
        // Successfully voted
        setHasVoted(true);
        markVoted(questionId, selectedRating);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit vote. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Question Not Found</h1>
          <p className="text-gray-600">This voting session may have ended.</p>
        </div>
      </div>
    );
  }

  if (!question.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Voting Closed</h1>
          <p className="text-gray-600">Thank you for participating!</p>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    const votedOption = selectedRating ? VOTE_OPTIONS[selectedRating - 1].label : "your choice";
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <Logo className="mb-12" />
        
        <div className="max-w-sm w-full text-center animate-fade-in">
          <h2 className="text-xl font-medium mb-12">Your vote has been recorded.</h2>
          
          <p className="text-lg text-gray-700 mb-12">
            You feel <strong>{votedOption}</strong> about<br />
            using AI to <strong>{question.question_text}</strong>.
          </p>
          
          <div className="space-y-2 text-gray-600">
            <p>Please wait for the voting to close.</p>
            <p>Results will be tabulated on screen.</p>
            <p className="text-sm mt-8 text-gray-500">You can close this tab.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-white">
      <header className="mb-8 mt-4 text-center">
        <Logo className="mx-auto" />
      </header>

      <main className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-lg mb-4">How do you feel about using AI to:</h1>
          <p className="text-gray-800 font-medium">{question.question_text}</p>
        </div>

        <div className="space-y-3 mb-8">
          {VOTE_OPTIONS.map((option) => (
            <VotingButton
              key={option.value}
              label={option.label}
              value={option.value}
              isSelected={selectedRating === option.value}
              onClick={() => setSelectedRating(option.value)}
              disabled={isSubmitting}
            />
          ))}
        </div>

        <button
          onClick={handleVote}
          disabled={!selectedRating || isSubmitting}
          className="btn-primary disabled:opacity-50 w-full"
        >
          {isSubmitting ? "Submitting..." : "Vote"}
        </button>
      </main>
    </div>
  );
}