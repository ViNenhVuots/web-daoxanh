-- Add image_url field to combo_packages
ALTER TABLE public.combo_packages ADD COLUMN IF NOT EXISTS image_url text;

-- Add image_url field to day_trip_packages  
ALTER TABLE public.day_trip_packages ADD COLUMN IF NOT EXISTS image_url text;

-- Update existing packages with default images
UPDATE public.combo_packages SET image_url = 'https://example.com/combo-a.jpg' WHERE name = 'Gói A' AND image_url IS NULL;
UPDATE public.combo_packages SET image_url = 'https://example.com/combo-a1.jpg' WHERE name = 'Gói A1' AND image_url IS NULL;
UPDATE public.combo_packages SET image_url = 'https://example.com/combo-a2.jpg' WHERE name = 'Gói A2' AND image_url IS NULL;

UPDATE public.day_trip_packages SET image_url = 'https://example.com/daytrip-a.jpg' WHERE name LIKE 'Gói A - Nông trại tiêu chuẩn%' AND image_url IS NULL;
UPDATE public.day_trip_packages SET image_url = 'https://example.com/daytrip-a1.jpg' WHERE name LIKE 'Gói A1 - Nông trại 5 sao%' AND image_url IS NULL;
UPDATE public.day_trip_packages SET image_url = 'https://example.com/daytrip-a2.jpg' WHERE name LIKE 'Gói A2 - Nông trại 5 sao+%' AND image_url IS NULL;