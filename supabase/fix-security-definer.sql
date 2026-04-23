-- Fix security definer issue on vote_summary view
-- Recreates the view with security_invoker = true so queries run under the
-- calling user's permissions and RLS policies, not the view creator's.

DROP VIEW IF EXISTS vote_summary;

CREATE VIEW vote_summary
WITH (security_invoker = true) AS
SELECT
  q.id as question_id,
  q.session_id,
  q.question_text,
  q.created_at,
  q.is_active,
  COUNT(CASE WHEN v.rating = 1 THEN 1 END) as rating_1,
  COUNT(CASE WHEN v.rating = 2 THEN 1 END) as rating_2,
  COUNT(CASE WHEN v.rating = 3 THEN 1 END) as rating_3,
  COUNT(CASE WHEN v.rating = 4 THEN 1 END) as rating_4,
  COUNT(CASE WHEN v.rating = 5 THEN 1 END) as rating_5,
  COUNT(v.id) as total_votes
FROM questions q
LEFT JOIN votes v ON q.id = v.question_id
GROUP BY q.id, q.session_id, q.question_text, q.created_at, q.is_active;

-- Grant SELECT to the roles that query the view via the anon/authenticated keys.
GRANT SELECT ON vote_summary TO anon;
GRANT SELECT ON vote_summary TO authenticated;