"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { SummaryGrid } from "@/components/SummaryGrid";
import { supabase } from "@/lib/supabase";
import { VoteSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function SessionSummary() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [questions, setQuestions] = useState<VoteSummary[]>([]);
  const [_sessionDate, setSessionDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // Fetch session info
        const { data: sessionData } = await supabase
          .from("sessions")
          .select("created_at")
          .eq("id", sessionId)
          .single();

        if (sessionData) {
          setSessionDate(formatDate(sessionData.created_at));
        }

        // Fetch all questions with vote summaries
        const { data: questionsData, error } = await supabase
          .from("vote_summary")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });

        if (!error && questionsData) {
          setQuestions(questionsData);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const _totalVotes = questions.reduce((sum, q) => sum + q.total_votes, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <header className="mb-12 text-center">
        <Logo className="mx-auto" />
      </header>

      <div className="max-w-7xl mx-auto">
        {questions.length > 0 ? (
          <SummaryGrid questions={questions} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions have been asked in this session yet.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <button onClick={() => router.push(`/presenter/${sessionId}`)} className="btn-primary">
            Back to Presenter View
          </button>
        </div>
      </div>
    </div>
  );
}
