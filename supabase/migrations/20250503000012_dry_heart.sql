/*
  # Create Fan Profiles Schema

  1. New Tables
    - `fan_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `cpf` (text)
      - `birth_date` (date)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `gender` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `gaming_interests`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references fan_profiles)
      - `favorite_games` (text[])
      - `gaming_platforms` (text[])
      - `gaming_hours_weekly` (text)
      - `esports_since` (text)
      - `watching_preference` (text)
      - `created_at` (timestamptz)
    
    - `furia_fandom`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references fan_profiles)
      - `favorite_teams` (text[])
      - `fan_since` (text)
      - `favorite_players` (text)
      - `purchased_merchandise` (text)
      - `attended_events` (text)
      - `why_furia` (text)
      - `created_at` (timestamptz)
    
    - `documents`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references fan_profiles)
      - `document_url` (text)
      - `document_type` (text)
      - `verification_status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create fan_profiles table
CREATE TABLE fan_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text NOT NULL,
  cpf text UNIQUE NOT NULL,
  birth_date date NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  gender text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gaming_interests table
CREATE TABLE gaming_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES fan_profiles ON DELETE CASCADE NOT NULL,
  favorite_games text[],
  gaming_platforms text[],
  gaming_hours_weekly text,
  esports_since text,
  watching_preference text,
  created_at timestamptz DEFAULT now()
);

-- Create furia_fandom table
CREATE TABLE furia_fandom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES fan_profiles ON DELETE CASCADE NOT NULL,
  favorite_teams text[],
  fan_since text,
  favorite_players text,
  purchased_merchandise text,
  attended_events text,
  why_furia text,
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES fan_profiles ON DELETE CASCADE NOT NULL,
  document_url text NOT NULL,
  document_type text NOT NULL,
  verification_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE fan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE furia_fandom ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own profile"
  ON fan_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own gaming interests"
  ON gaming_interests
  FOR ALL
  TO authenticated
  USING (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own fandom data"
  ON furia_fandom
  FOR ALL
  TO authenticated
  USING (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ));