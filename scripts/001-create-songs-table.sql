-- Create songs table for wedding song suggestions
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  spotify_id TEXT,
  album_image TEXT,
  suggested_by TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on votes for faster sorting
CREATE INDEX IF NOT EXISTS idx_songs_votes ON songs(votes DESC);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read songs
CREATE POLICY "Anyone can view songs" ON songs
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert songs
CREATE POLICY "Anyone can add songs" ON songs
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to update votes
CREATE POLICY "Anyone can update votes" ON songs
  FOR UPDATE USING (true);
