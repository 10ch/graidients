// Get or create a persistent voter fingerprint
export function getVoterFingerprint(): string {
  if (typeof window === "undefined") return "";

  let fingerprint = localStorage.getItem("voter_fingerprint");

  if (!fingerprint) {
    fingerprint = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("voter_fingerprint", fingerprint);
  }

  return fingerprint;
}

// Check if user has voted on a specific question
export function hasVotedOnQuestion(questionId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`voted_${questionId}`) === "true";
}

// Mark a question as voted with the rating
export function markVoted(questionId: string, rating?: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`voted_${questionId}`, "true");
  if (rating) {
    localStorage.setItem(`vote_rating_${questionId}`, rating.toString());
  }
}

// Get the rating for a voted question
export function getVotedRating(questionId: string): number | null {
  if (typeof window === "undefined") return null;
  const rating = localStorage.getItem(`vote_rating_${questionId}`);
  return rating ? parseInt(rating) : null;
}

// Calculate percentage for results
export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Sanitize text input to prevent XSS
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "").slice(0, 500); // Limit length
}
