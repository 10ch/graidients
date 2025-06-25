export interface Session {
  id: string;
  created_at: string;
}

export interface Question {
  id: string;
  session_id: string;
  question_text: string;
  is_active: boolean;
  created_at: string;
}

export interface Vote {
  id: string;
  question_id: string;
  rating: number;
  voter_fingerprint: string;
  created_at: string;
}

export interface VoteSummary {
  question_id: string;
  question_text: string;
  is_active: boolean;
  session_id: string;
  total_votes: number;
  rating_1: number;
  rating_2: number;
  rating_3: number;
  rating_4: number;
  rating_5: number;
}

export const VOTE_OPTIONS = [
  { value: 1, label: "Totally Fine", color: "bg-green-500" },
  { value: 2, label: "Mostly Okay", color: "bg-lime-500" },
  { value: 3, label: "Not Sure", color: "bg-yellow-500" },
  { value: 4, label: "Feels Sketchy", color: "bg-orange-500" },
  { value: 5, label: "Crosses Line", color: "bg-red-500" },
] as const;
