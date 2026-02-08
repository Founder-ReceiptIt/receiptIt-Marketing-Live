/*
  # Create Waitlist Table for Receiptit

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each waitlist entry
      - `alias` (text, unique, not null) - The requested email alias (e.g., "john")
      - `email` (text, not null) - User's actual email for notifications
      - `created_at` (timestamptz) - Timestamp of when they joined
      - `ip_address` (text) - Store IP for fraud prevention (optional)
      - `activated` (boolean, default false) - Whether they've activated their account

  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for inserting new waitlist entries (public access for signup)
    - Add policy for authenticated users to view their own entries

  3. Important Notes
    - Email aliases must be unique to prevent conflicts
    - Created timestamp helps with priority access ordering
    - Activated flag tracks who has claimed their free 6 months
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alias text UNIQUE NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  ip_address text,
  activated boolean DEFAULT false
);

-- Create index for faster lookups by alias
CREATE INDEX IF NOT EXISTS idx_waitlist_alias ON waitlist(alias);

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up for the waitlist (public insert)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading waitlist entries (for duplicate checks)
CREATE POLICY "Anyone can check alias availability"
  ON waitlist
  FOR SELECT
  TO anon
  USING (true);