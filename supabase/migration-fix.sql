-- Migration script to fix existing database
-- Use this if you already ran the original schema.sql and got errors

-- First, drop the duplicate view if it exists
DROP VIEW IF EXISTS vote_summary;

-- Recreate the view with the correct structure
CREATE VIEW vote_summary AS
SELECT 
  q.id as question_id,
  q.session_id,
  q.use_case,
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
GROUP BY q.id, q.session_id, q.use_case, q.created_at, q.is_active;

-- If you need to rename question_text to use_case (if not already done)
-- ALTER TABLE questions RENAME COLUMN question_text TO use_case;

-- Add ip_address column to votes if missing
-- ALTER TABLE votes ADD COLUMN IF NOT EXISTS ip_address TEXT;