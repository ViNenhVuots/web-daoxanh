-- Add gallery column to accommodations table
ALTER TABLE public.accommodations ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}'::TEXT[];
