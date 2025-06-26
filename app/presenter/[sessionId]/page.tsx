"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { QuestionInput } from "@/components/QuestionInput";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ResultsChart } from "@/components/ResultsChart";
import { supabase } from "@/lib/supabase";
import { Question, VoteSummary } from "@/lib/types";

type ViewMode = "input" | "voting" | "results";

export default function PresenterView() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [viewMode, setViewMode] = useState<ViewMode>("input");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [results, setResults] = useState<VoteSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch results for current question
  const fetchResults = useCallback(async () => {
    if (!currentQuestion) return;

    const { data, error } = await supabase
      .from("vote_summary")
      .select("*")
      .eq("question_id", currentQuestion.id)
      .single();

    if (!error && data) {
      setResults(data);
    }
  }, [currentQuestion]);

  // Set up real-time subscription for votes
  useEffect(() => {
    if (!currentQuestion || viewMode !== "voting") return;

    let timeout: NodeJS.Timeout;

    const channel = supabase
      .channel(`votes:${currentQuestion.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `question_id=eq.${currentQuestion.id}`,
        },
        () => {
          // Debounce updates more aggressively for large audiences
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            fetchResults();
          }, 2000); // Increased to 2 seconds for 500+ users
        }
      )
      .subscribe();

    // Initial fetch
    fetchResults();

    return () => {
      clearTimeout(timeout);
      channel.unsubscribe();
    };
  }, [currentQuestion, viewMode, fetchResults]);

  const handleSubmitQuestion = async (questionText: string) => {
    setIsLoading(true);

    try {
      // Create new question
      const { data, error } = await supabase
        .from("questions")
        .insert({
          session_id: sessionId,
          question_text: questionText,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentQuestion(data);
      setViewMode("voting");
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Failed to create question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseVoting = async () => {
    if (!currentQuestion) return;

    try {
      // Mark question as inactive
      await supabase.from("questions").update({ is_active: false }).eq("id", currentQuestion.id);

      // Fetch final results
      await fetchResults();
      setViewMode("results");
    } catch (error) {
      console.error("Error closing voting:", error);
    }
  };

  const handleNewQuestion = () => {
    setCurrentQuestion(null);
    setResults(null);
    setViewMode("input");
  };

  const handleViewSummary = () => {
    router.push(`/summary/${sessionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gray-50">
      <header className="mb-6 text-center">
        <Logo className="mx-auto" />
      </header>

      <main className="flex-1 flex flex-col">
        {viewMode === "input" && (
          <div className="w-full max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <QuestionInput onSubmit={handleSubmitQuestion} isLoading={isLoading} />
            </div>
          </div>
        )}

        {viewMode === "voting" && currentQuestion && (
          <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <div className="flex gap-8">
              <div className="flex-1">
                <QRCodeDisplay questionId={currentQuestion.id} onClose={handleCloseVoting} />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm p-8 h-full flex flex-col items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-5xl font-semibold text-gray-800 mb-8">
                      How do you feel about using AI to {currentQuestion.question_text}?
                    </h2>
                    <p className="text-xl text-gray-600">
                      Total Votes: {results?.total_votes || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "results" && results && currentQuestion && (
          <div className="w-full max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ResultsChart
                results={results}
                onNewQuestion={handleNewQuestion}
                onViewSummary={handleViewSummary}
              />
            </div>
          </div>
        )}
      </main>

      {viewMode === "results" && (
        <div className="absolute top-8 right-8">
          <button
            onClick={handleViewSummary}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="View Session Summary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
