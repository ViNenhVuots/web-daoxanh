-- 1. Ẩn Homestay An Yên và Nhà An Hòa
UPDATE public.accommodations
SET published = false
WHERE name ILIKE '%An Yên%' OR name ILIKE '%An Hòa%';

-- 2. Cập nhật Lều Sê Rê Pôk thành 1 khách/lều và giá 550,000
UPDATE public.accommodations
SET capacity = '1 khách/lều',
    unit = '1 khách/lều',
    price_original = 550000
WHERE name ILIKE '%Lều%';

-- 3. Cập nhật Gói A1 để bỏ An Yên và An Hòa khỏi nội dung
UPDATE public.combo_packages
SET includes = '["Bao gồm các dịch vụ của Gói A", "Tùy chọn lưu trú: Nhà Thảnh Thơi, Lều SêRêPôk"]'::jsonb
WHERE slug = 'goi-a1';

-- 4. Thêm 2 dịch vụ mới vào day_trip_packages
INSERT INTO public.day_trip_packages (name, slug, price_adult, price_child, note, includes, published)
VALUES
  ('Hoàng hôn Đảo Xanh', 'hoang-hon-dao-xanh', 599000, 525000, 'Combo Chill Sunset (16h - 21h30)', '["Trải nghiệm xe điện, xe đạp", "Trải nghiệm hồ bơi vô cực", "Chèo Sup thư giãn", "Du ngoạn cano sông Sêrêpôk", "BBQ nướng và lẩu 6 món", "Xe đưa rước tận nơi BMT - ĐX - BMT"]'::jsonb, true),
  ('Làm đèn thủ công Mực Trà và Thi', 'lam-den-thu-cong', 285000, 285000, 'Giá trải nghiệm: 285.000 VNĐ/set', '["Thưởng trà Sơn Động", "Lựa chọn họa tiết & thư pháp", "Tạo thân đèn trên giấy xuyến chỉ và hạt nút dừa", "Hoàn thiện sản phẩm"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE 
SET price_adult = EXCLUDED.price_adult,
    price_child = EXCLUDED.price_child,
    includes = EXCLUDED.includes,
    note = EXCLUDED.note,
    published = EXCLUDED.published;
