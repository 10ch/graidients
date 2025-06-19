-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  voter_fingerprint TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_votes_question_id ON votes(question_id);
CREATE INDEX idx_questions_session_active ON questions(session_id, is_active);
CREATE UNIQUE INDEX idx_votes_unique_voter ON votes(question_id, voter_fingerprint);

-- Create view for vote summary
CREATE VIEW vote_summary AS
SELECT 
  q.id as question_id,
  q.question_text,
  q.is_active,
  q.session_id,
  COUNT(v.id) as total_votes,
  COUNT(CASE WHEN v.rating = 1 THEN 1 END) as rating_1,
  COUNT(CASE WHEN v.rating = 2 THEN 1 END) as rating_2,
  COUNT(CASE WHEN v.rating = 3 THEN 1 END) as rating_3,
  COUNT(CASE WHEN v.rating = 4 THEN 1 END) as rating_4,
  COUNT(CASE WHEN v.rating = 5 THEN 1 END) as rating_5
FROM questions q
LEFT JOIN votes v ON q.id = v.question_id
GROUP BY q.id, q.question_text, q.is_active, q.session_id;

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public app)
CREATE POLICY "Sessions are publicly readable" ON sessions
  FOR SELECT USING (true);

CREATE POLICY "Sessions can be created by anyone" ON sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Questions are publicly readable" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Questions can be created by anyone" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Questions can be updated by anyone" ON questions
  FOR UPDATE USING (true);

CREATE POLICY "Votes are publicly readable" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Votes can be created by anyone" ON votes
  FOR INSERT WITH CHECK (true);

-- Enable realtime for votes table
ALTER PUBLICATION supabase_realtime ADD TABLE votes;

-- Create vote summary view for efficient queries
CREATE OR REPLACE VIEW vote_summary AS
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