-- Thêm cột note (ghi chú) vào các bảng gói dịch vụ
ALTER TABLE combo_packages ADD COLUMN IF NOT EXISTS note text;
ALTER TABLE day_trip_packages ADD COLUMN IF NOT EXISTS note text;

-- Cập nhật nội dung ghi chú theo bảng giá mới 2026
-- 1. Combo áp dụng từ 4 khách
UPDATE combo_packages SET note = 'ÁP DỤNG TỪ 4 KHÁCH TRỞ LÊN' WHERE name ILIKE 'Gói A%';

-- 2. Set BBQ áp dụng từ 4 khách (Giả định theo vị trí cột ghi chú trong ảnh)
UPDATE day_trip_packages SET note = 'ÁP DỤNG TỪ 4 KHÁCH TRỞ LÊN' WHERE name ILIKE 'Set BBQ%';

-- 3. Cano áp dụng từ 6 khách
UPDATE day_trip_packages SET note = 'ÁP DỤNG TỪ 6 KHÁCH TRỞ LÊN' WHERE name ILIKE 'Cano%';
