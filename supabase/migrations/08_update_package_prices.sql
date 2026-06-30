-- Cập nhật giá cho các Gói Combo 2N1Đ
UPDATE combo_packages 
SET price_adult = 699000, price_child = 599000 
WHERE name ILIKE 'Gói A' OR name ILIKE 'Gói A - Cắm trại%';

UPDATE combo_packages 
SET price_adult = 849000, price_child = 719000 
WHERE name ILIKE 'Gói A1' OR name ILIKE 'Gói A1 - Tùy chọn%';

UPDATE combo_packages 
SET price_adult = 1149000, price_child = 999000 
WHERE name ILIKE 'Gói A2' OR name ILIKE 'Gói A2 - Nghỉ dưỡng%';

-- Cập nhật giá cho các Tour Trong Ngày
UPDATE day_trip_packages 
SET price_adult = 120000, price_child = 85000 
WHERE name ILIKE 'Gói A - Nông trại tiêu chuẩn';

UPDATE day_trip_packages 
SET price_adult = 215000, price_child = 180000 
WHERE name ILIKE 'Gói A1 - Nông trại 5 sao';

UPDATE day_trip_packages 
SET price_adult = 409000, price_child = 379000 
WHERE name ILIKE 'Gói A1 + BBQ%';

UPDATE day_trip_packages 
SET price_adult = 310000, price_child = 275000 
WHERE name ILIKE 'Gói A2 - Nông trại 5 sao+';

UPDATE day_trip_packages 
SET price_adult = 499000, price_child = 469000 
WHERE name ILIKE 'Gói A2 + BBQ%';

-- Bổ sung các dịch vụ/gói mới còn thiếu trong bảng giá

-- 1. Gói A + BBQ
INSERT INTO day_trip_packages (name, slug, price_adult, price_child, published)
SELECT 'Gói A + BBQ lẩu nướng - Nông trại tiêu chuẩn', 'goi-a-bbq-nong-trai-tieu-chuan', 319000, 279000, true
WHERE NOT EXISTS (SELECT 1 FROM day_trip_packages WHERE name ILIKE 'Gói A + BBQ%');

-- 2. SET BBQ
INSERT INTO day_trip_packages (name, slug, price_adult, price_child, published)
SELECT 'Set BBQ - Lẩu Nướng', 'set-bbq-lau-nuong', 225000, 225000, true
WHERE NOT EXISTS (SELECT 1 FROM day_trip_packages WHERE name ILIKE 'Set BBQ%');

-- 3. CANO
INSERT INTO day_trip_packages (name, slug, price_adult, price_child, published)
SELECT 'Cano / Thể thao mặt nước', 'cano-the-thao-mat-nuoc', 120000, 120000, true
WHERE NOT EXISTS (SELECT 1 FROM day_trip_packages WHERE name ILIKE 'Cano%');
