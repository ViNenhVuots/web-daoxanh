-- Add slug field to combo_packages
ALTER TABLE public.combo_packages ADD COLUMN IF NOT EXISTS slug text;

-- Add slug field to day_trip_packages  
ALTER TABLE public.day_trip_packages ADD COLUMN IF NOT EXISTS slug text;

-- Update existing combo packages with slugs
UPDATE public.combo_packages SET slug = 'goi-a' WHERE name = 'Gói A' AND slug IS NULL;
UPDATE public.combo_packages SET slug = 'goi-a1' WHERE name = 'Gói A1' AND slug IS NULL;
UPDATE public.combo_packages SET slug = 'goi-a2' WHERE name = 'Gói A2' AND slug IS NULL;

-- Update existing day trip packages with slugs
UPDATE public.day_trip_packages SET slug = 'goi-a-nong-trai-tieu-chuan' WHERE name LIKE 'Gói A - Nông trại tiêu chuẩn%' AND slug IS NULL;
UPDATE public.day_trip_packages SET slug = 'goi-a1-nong-trai-5-sao' WHERE name LIKE 'Gói A1 - Nông trại 5 sao%' AND slug IS NULL;
UPDATE public.day_trip_packages SET slug = 'goi-a2-nong-trai-5-sao-plus' WHERE name LIKE 'Gói A2 - Nông trại 5 sao+%' AND slug IS NULL;

-- Create unique index on slugs
CREATE UNIQUE INDEX IF NOT EXISTS combo_packages_slug_unique ON public.combo_packages(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS day_trip_packages_slug_unique ON public.day_trip_packages(slug) WHERE slug IS NOT NULL;