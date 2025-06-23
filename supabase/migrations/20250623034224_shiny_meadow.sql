/*
  # Initial Schema for Social Crisis Guardian

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (enum: admin, manager, analyst)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `social_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `platform` (enum: facebook, twitter)
      - `account_name` (text)
      - `account_id` (text)
      - `access_token` (text, encrypted)
      - `is_active` (boolean)
      - `last_sync` (timestamp)
      - `followers_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `comments`
      - `id` (uuid, primary key)
      - `social_account_id` (uuid, foreign key)
      - `platform` (enum: facebook, twitter)
      - `post_id` (text)
      - `content` (text)
      - `author` (text)
      - `author_id` (text)
      - `timestamp` (timestamp)
      - `sentiment` (enum: positive, neutral, negative)
      - `hate_speech_risk` (enum: none, low, medium, high)
      - `confidence` (decimal)
      - `gemini_analysis` (jsonb)
      - `created_at` (timestamp)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (enum: high_hate_speech, sentiment_spike, volume_spike)
      - `severity` (enum: low, medium, high, critical)
      - `title` (text)
      - `description` (text)
      - `social_account_id` (uuid, foreign key)
      - `related_comments` (text array)
      - `is_read` (boolean)
      - `is_resolved` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `notification_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `email_enabled` (boolean)
      - `line_enabled` (boolean)
      - `line_token` (text, optional)
      - `discord_enabled` (boolean)
      - `discord_webhook_url` (text, optional)
      - `real_time_alerts` (boolean)
      - `daily_summary` (boolean)
      - `hate_speech_threshold` (enum: low, medium, high)
      - `sentiment_threshold` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for admin users to access all data
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'analyst');
CREATE TYPE platform_type AS ENUM ('facebook', 'twitter');
CREATE TYPE sentiment_type AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE risk_level AS ENUM ('none', 'low', 'medium', 'high');
CREATE TYPE alert_type AS ENUM ('high_hate_speech', 'sentiment_spike', 'volume_spike');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE threshold_level AS ENUM ('low', 'medium', 'high');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role DEFAULT 'analyst',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Social accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  account_name text NOT NULL,
  account_id text NOT NULL,
  access_token text NOT NULL,
  is_active boolean DEFAULT true,
  last_sync timestamptz DEFAULT now(),
  followers_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id uuid REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  post_id text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  author_id text NOT NULL,
  timestamp timestamptz NOT NULL,
  sentiment sentiment_type NOT NULL,
  hate_speech_risk risk_level DEFAULT 'none',
  confidence decimal(3,2) DEFAULT 0.5,
  gemini_analysis jsonb,
  created_at timestamptz DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  severity severity_level NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  social_account_id uuid REFERENCES social_accounts(id) ON DELETE CASCADE,
  related_comments text[] DEFAULT '{}',
  is_read boolean DEFAULT false,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notification settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  email_enabled boolean DEFAULT true,
  line_enabled boolean DEFAULT false,
  line_token text,
  discord_enabled boolean DEFAULT false,
  discord_webhook_url text,
  real_time_alerts boolean DEFAULT true,
  daily_summary boolean DEFAULT true,
  hate_speech_threshold threshold_level DEFAULT 'medium',
  sentiment_threshold integer DEFAULT 70,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_comments_social_account_id ON comments(social_account_id);
CREATE INDEX IF NOT EXISTS idx_comments_timestamp ON comments(timestamp);
CREATE INDEX IF NOT EXISTS idx_comments_sentiment ON comments(sentiment);
CREATE INDEX IF NOT EXISTS idx_comments_hate_speech_risk ON comments(hate_speech_risk);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_is_resolved ON alerts(is_resolved);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for social_accounts table
CREATE POLICY "Users can manage own social accounts"
  ON social_accounts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for comments table
CREATE POLICY "Users can read comments from own accounts"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    social_account_id IN (
      SELECT id FROM social_accounts WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for alerts table
CREATE POLICY "Users can manage own alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for notification_settings table
CREATE POLICY "Users can manage own notification settings"
  ON notification_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to update updated_at timestamp
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

CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();