-- ─── ADD STATUS COLUMN TO WAITLIST ─────────────────────────────────────────
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This adds a status column to support the admin panel's toggle feature.

ALTER TABLE waitlist 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
  CHECK (status IN ('active', 'removed'));

-- Mark all existing entries as active
UPDATE waitlist SET status = 'active' WHERE status IS NULL;
