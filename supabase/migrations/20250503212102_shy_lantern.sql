/*
  # Add verification_details column to documents table

  1. Changes
    - Add `verification_details` column to `documents` table
      - Type: jsonb
      - Nullable
      - No default value
  
  2. Notes
    - This column will store the verification results and metadata
    - Using JSONB type to allow flexible storage of verification details
*/

ALTER TABLE documents
ADD COLUMN IF NOT EXISTS verification_details jsonb;