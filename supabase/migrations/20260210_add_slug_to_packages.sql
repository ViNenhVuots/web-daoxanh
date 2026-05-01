-- Add slug field to combo_packages
ALTER TABLE public.combo_packages ADD COLUMN IF NOT EXISTS slug text;

-- Add slug field to day_trip_packages  
ALTER TABLE public.day_trip_packages ADD COLUMN IF NOT EXISTS slug text;

-- Create unique indexes for slug fields
CREATE UNIQUE INDEX IF NOT EXISTS idx_combo_packages_slug ON public.combo_packages(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_day_trip_packages_slug ON public.day_trip_packages(slug);

-- Update existing packages with default slugs
UPDATE public.combo_packages SET slug = 'goi-a' WHERE name = 'Gói A' AND slug IS NULL;
UPDATE public.combo_packages SET slug = 'goi-a1' WHERE name = 'Gói A1' AND slug IS NULL;
UPDATE public.combo_packages SET slug = 'goi-a2' WHERE name = 'Gói A2' AND slug IS NULL;

UPDATE public.day_trip_packages SET slug = 'goi-a-nong-trai-tieu-chuan' WHERE name LIKE 'Gói A - Nông trại tiêu chuẩn%' AND slug IS NULL;
UPDATE public.day_trip_packages SET slug = 'goi-a1-nong-trai-5-sao' WHERE name LIKE 'Gói A1 - Nông trại 5 sao%' AND slug IS NULL;
UPDATE public.day_trip_packages SET slug = 'goi-a2-nong-trai-5-sao-plus' WHERE name LIKE 'Gói A2 - Nông trại 5 sao+%' AND slug IS NULL;