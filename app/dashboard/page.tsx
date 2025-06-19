"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

interface SessionWithStats {
  id: string;
  created_at: string;
  question_count: number;
  total_votes: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Fetch all sessions with their stats
        const { data, error } = await supabase
          .from("sessions")
          .select(`
            id,
            created_at,
            questions (
              id,
              votes (id)
            )
          `)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const sessionsWithStats = data.map((session: any) => ({
            id: session.id,
            created_at: session.created_at,
            question_count: session.questions?.length || 0,
            total_votes: session.questions?.reduce(
              (sum: number, q: any) => sum + (q.votes?.length || 0),
              0
            ) || 0,
          }));
          
          setSessions(sessionsWithStats);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
    <div className="min-h-screen p-8">
      <header className="mb-12">
        <Logo />
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-medium mb-2">All Sessions</h1>
          <p className="text-gray-600">
            {sessions.length} total sessions
          </p>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => router.push(`/summary/${session.id}`)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-medium mb-2">
                  {formatDate(session.created_at)}
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p>{session.question_count} questions</p>
                  <p>{session.total_votes} total votes</p>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-sm text-red-500 hover:text-red-600">
                    View Summary →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-8">No sessions have been created yet.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Start First Session
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}