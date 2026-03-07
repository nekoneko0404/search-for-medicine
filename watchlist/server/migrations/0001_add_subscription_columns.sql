-- Migration: Add subscription columns to stores
ALTER TABLE stores ADD COLUMN usage_limit INTEGER DEFAULT 30;
