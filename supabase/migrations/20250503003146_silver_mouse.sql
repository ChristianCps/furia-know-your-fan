/*
  # Add Social Media Integration

  1. New Tables
    - `social_media_accounts`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references fan_profiles)
      - `platform` (text) - e.g., 'twitter', 'instagram', etc.
      - `username` (text)
      - `platform_user_id` (text)
      - `access_token` (text)
      - `refresh_token` (text)
      - `token_expires_at` (timestamptz)
      - `last_synced_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `social_media_interactions`
      - `id` (uuid, primary key)
      - `account_id` (uuid, references social_media_accounts)
      - `interaction_type` (text) - e.g., 'follow', 'like', 'comment'
      - `target_type` (text) - e.g., 'post', 'user', 'page'
      - `target_id` (text)
      - `content` (text)
      - `interaction_date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create social_media_accounts table
CREATE TABLE social_media_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES fan_profiles ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  username text NOT NULL,
  platform_user_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, platform)
);

-- Create social_media_interactions table
CREATE TABLE social_media_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES social_media_accounts ON DELETE CASCADE NOT NULL,
  interaction_type text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  content text,
  interaction_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own social media accounts"
  ON social_media_accounts
  FOR ALL
  TO authenticated
  USING (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (profile_id IN (
    SELECT id FROM fan_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own social media interactions"
  ON social_media_interactions
  FOR ALL
  TO authenticated
  USING (account_id IN (
    SELECT id FROM social_media_accounts
    WHERE profile_id IN (
      SELECT id FROM fan_profiles WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM social_media_accounts
    WHERE profile_id IN (
      SELECT id FROM fan_profiles WHERE user_id = auth.uid()
    )
  ));