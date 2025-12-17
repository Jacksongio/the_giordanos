-- Create cocktails table for ranking wedding cocktails
CREATE TABLE IF NOT EXISTS cocktails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  image_url TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view cocktails
CREATE POLICY "Anyone can view cocktails"
  ON cocktails
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert cocktails
CREATE POLICY "Anyone can add cocktails"
  ON cocktails
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update cocktail votes
CREATE POLICY "Anyone can vote on cocktails"
  ON cocktails
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Insert some default cocktails
INSERT INTO cocktails (name, description, ingredients) VALUES
  ('Margarita', 'Classic tequila cocktail with lime and salt', 'Tequila, Triple Sec, Lime Juice, Salt'),
  ('Mojito', 'Refreshing rum cocktail with mint and lime', 'White Rum, Mint, Lime, Sugar, Soda Water'),
  ('Old Fashioned', 'Timeless whiskey cocktail with bitters', 'Bourbon, Bitters, Sugar, Orange Peel'),
  ('Cosmopolitan', 'Elegant vodka cocktail with cranberry', 'Vodka, Triple Sec, Cranberry Juice, Lime'),
  ('Aperol Spritz', 'Light and bubbly Italian aperitif', 'Aperol, Prosecco, Soda Water, Orange Slice'),
  ('Espresso Martini', 'Coffee-infused vodka cocktail', 'Vodka, Coffee Liqueur, Espresso, Sugar Syrup'),
  ('Negroni', 'Bold Italian cocktail with gin and Campari', 'Gin, Campari, Sweet Vermouth, Orange Peel'),
  ('Whiskey Sour', 'Smooth whiskey with lemon and egg white', 'Bourbon, Lemon Juice, Sugar, Egg White')
ON CONFLICT DO NOTHING;
