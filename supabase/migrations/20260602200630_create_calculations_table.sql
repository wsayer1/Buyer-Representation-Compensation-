/*
  # Create calculations table

  1. New Tables
    - `calculations`
      - `id` (uuid, primary key) - unique identifier for each calculation
      - `sale_price` (numeric) - the property sale price
      - `commission_rate` (numeric) - total commission rate percentage
      - `buyer_agent_split` (numeric) - buyer agent split percentage
      - `seller_concession` (numeric) - seller concession percentage
      - `buyer_credit` (numeric) - additional buyer credit amount in dollars
      - `total_compensation` (numeric) - calculated total compensation amount
      - `notes` (text) - optional notes about the calculation
      - `created_at` (timestamptz) - timestamp when the record was created

  2. Security
    - Enable RLS on `calculations` table
    - Add policy for anonymous users to insert calculations (public tool)
    - Add policy for anonymous users to read calculations (public tool)
*/

CREATE TABLE IF NOT EXISTS calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_price numeric NOT NULL DEFAULT 0,
  commission_rate numeric NOT NULL DEFAULT 0,
  buyer_agent_split numeric NOT NULL DEFAULT 0,
  seller_concession numeric NOT NULL DEFAULT 0,
  buyer_credit numeric NOT NULL DEFAULT 0,
  total_compensation numeric NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert calculations"
  ON calculations
  FOR INSERT
  TO anon
  WITH CHECK (
    sale_price >= 0
    AND commission_rate >= 0
    AND buyer_agent_split >= 0
    AND seller_concession >= 0
    AND buyer_credit >= 0
  );

CREATE POLICY "Anyone can read calculations"
  ON calculations
  FOR SELECT
  TO anon
  USING (created_at > now() - interval '30 days');
