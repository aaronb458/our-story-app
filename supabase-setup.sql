-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user TEXT NOT NULL CHECK (user IN ('hubby', 'wifey')),
  date DATE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user, date)
);

-- Create love_notes table
CREATE TABLE IF NOT EXISTS love_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user TEXT NOT NULL CHECK (from_user IN ('hubby', 'wifey')),
  to_user TEXT NOT NULL CHECK (to_user IN ('hubby', 'wifey')),
  date DATE NOT NULL,
  note TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions (allow all for now - you can restrict later)
CREATE POLICY "Enable read access for all users" ON submissions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON submissions
  FOR UPDATE USING (true);

-- Create policies for love_notes
CREATE POLICY "Enable read access for all users" ON love_notes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON love_notes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON love_notes
  FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_date ON submissions(date);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user);
CREATE INDEX IF NOT EXISTS idx_love_notes_to_user_date ON love_notes(to_user, date);
