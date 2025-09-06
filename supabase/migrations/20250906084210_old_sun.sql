/*
  # Travel Planner Database Schema

  1. New Tables
    - `users` - User profiles and authentication data
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `itineraries` - Travel itineraries created by users
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `destination` (text)
      - `duration_days` (integer)
      - `luxury_level` (text: budget, moderate, luxury, premium)
      - `comfort_level` (text: backpacker, standard, comfort, luxury)
      - `is_public` (boolean, default false)
      - `itinerary_data` (jsonb - stores the full itinerary details)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `itinerary_ratings` - User ratings and reviews for itineraries
      - `id` (uuid, primary key)
      - `itinerary_id` (uuid, foreign key to itineraries)
      - `user_id` (uuid, foreign key to users)
      - `rating` (integer, 1-5)
      - `review` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Views
    - `itinerary_summary` - Aggregated view with average ratings

  3. Security
    - Enable RLS on all tables
    - Users can read public itineraries
    - Users can only modify their own data
    - Anyone can read ratings, only authenticated users can create ratings
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  destination text NOT NULL,
  duration_days integer NOT NULL DEFAULT 1,
  luxury_level text NOT NULL DEFAULT 'moderate' CHECK (luxury_level IN ('budget', 'moderate', 'luxury', 'premium')),
  comfort_level text NOT NULL DEFAULT 'standard' CHECK (comfort_level IN ('backpacker', 'standard', 'comfort', 'luxury')),
  is_public boolean DEFAULT false,
  itinerary_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create itinerary_ratings table
CREATE TABLE IF NOT EXISTS itinerary_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(itinerary_id, user_id) -- Prevent duplicate ratings from same user
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_is_public ON itineraries(is_public);
CREATE INDEX IF NOT EXISTS idx_itinerary_ratings_itinerary_id ON itinerary_ratings(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_ratings_user_id ON itinerary_ratings(user_id);

-- Create itinerary summary view with average ratings
CREATE OR REPLACE VIEW itinerary_summary AS
SELECT 
  i.id,
  i.user_id,
  i.title,
  i.destination,
  i.duration_days,
  i.luxury_level,
  i.comfort_level,
  i.is_public,
  i.created_at,
  i.updated_at,
  u.full_name as author_name,
  u.avatar_url as author_avatar,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.rating) as total_ratings
FROM itineraries i
LEFT JOIN users u ON i.user_id = u.id
LEFT JOIN itinerary_ratings r ON i.id = r.itinerary_id
GROUP BY i.id, i.user_id, i.title, i.destination, i.duration_days, 
         i.luxury_level, i.comfort_level, i.is_public, i.created_at, 
         i.updated_at, u.full_name, u.avatar_url;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_ratings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Itineraries table policies
CREATE POLICY "Anyone can read public itineraries"
  ON itineraries
  FOR SELECT
  TO authenticated, anon
  USING (is_public = true);

CREATE POLICY "Users can read own itineraries"
  ON itineraries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own itineraries"
  ON itineraries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries"
  ON itineraries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries"
  ON itineraries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Itinerary ratings table policies
CREATE POLICY "Anyone can read ratings"
  ON itinerary_ratings
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create ratings"
  ON itinerary_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON itinerary_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON itinerary_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_ratings_updated_at
  BEFORE UPDATE ON itinerary_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();