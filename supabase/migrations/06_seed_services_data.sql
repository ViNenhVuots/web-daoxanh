-- Insert Day Trip Packages
INSERT INTO public.day_trip_packages (name, slug, price_adult, price_child, includes, published, display_order)
VALUES 
  ('Gói A - Nông trại tiêu chuẩn', 'goi-a-nong-trai-tieu-chuan', 120000, 0, '["Thoải mái tham quan vui chơi", "Sân cỏ thiếu nhi - thanh niên", "Sân chơi nước trẻ em", "Thử thách Tazan"]'::jsonb, true, 1),
  ('Gói A1 - Nông trại 5 sao', 'goi-a1-nong-trai-5-sao', 195000, 0, '["Gói A", "Thể thao mặt nước (Chèo thuyền, chèo Súp, cầu Lắc, đu dây Zipline)", "Hoặc Cano sinh thái tốc độ cao thưởng ngoạn sông SêRêPôk, ngã 6 sông vợ chồng và vòng quanh đảo 15 phút"]'::jsonb, true, 2),
  ('Gói A1 + BBQ lẩu nướng - Nông trại 5 sao', 'goi-a1-bbq-nong-trai-5-sao', 369000, 0, '["Gói A", "Thể thao mặt nước (Chèo thuyền, chèo Súp, cầu Lắc, đu dây Zipline)", "Hoặc Cano sinh thái tốc độ cao thưởng ngoạn sông SêRêPôk, ngã 6 sông vợ chồng và vòng quanh đảo 15 phút", "BBQ lẩu nướng"]'::jsonb, true, 3),
  ('Gói A2 - Nông trại 5 sao+', 'goi-a2-nong-trai-5-sao-plus', 270000, 0, '["Trải nghiệm tất cả các dịch vụ", "Thể thao mặt nước", "Tour Cano sinh thái cao tốc", "Chưa bao gồm vé hồ bơi resort"]'::jsonb, true, 4),
  ('Gói A2 + BBQ lẩu nướng - Nông trại 5 sao+', 'goi-a2-bbq-nong-trai-5-sao-plus', 449000, 0, '["Trải nghiệm tất cả các dịch vụ", "Thể thao mặt nước", "Tour Cano sinh thái cao tốc", "Chưa bao gồm vé hồ bơi resort", "BBQ lẩu nướng"]'::jsonb, true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert Combo Packages
INSERT INTO public.combo_packages (name, slug, subtitle, price_adult, price_child, includes, published, display_order)
VALUES
  ('Gói A', 'goi-a', 'Cắm trại glambing lều đơn tại lán lá Hạnh Ngộ', 649000, 449000, '["Trải nghiệm nông trại cao cấp", "Hồ bơi resort", "Phà đưa đón qua sông, giữ xe", "Trà thảo mộc và nước lọc miễn phí", "Xe bus điện và xe đạp quanh đảo, nhân viên hướng dẫn tại các khu trải nghiệm, vui chơi và điểm tham quan", "Thể thao mặt nước: Chèo thuyền, chèo Súp, cầu Lắc, đu dây Zipline", "Hoặc Cano sinh thái tốc độ cao thưởng ngoạn sông SêRêPôk, ngã 6 sông vợ chồng và vòng quanh đảo 15 phút", "BBQ và lẩu tối"]'::jsonb, true, 1),
  ('Gói A1', 'goi-a1', 'Tùy chọn lưu trú', 749000, 549000, '["Bao gồm các dịch vụ của Gói A", "Tùy chọn lưu trú: Nhà Thảnh Thơi, Homestay An Yên, Phòng khách sạn An Hòa, Lều SêRêPôk"]'::jsonb, true, 2),
  ('Gói A2', 'goi-a2', 'Nghỉ dưỡng cao cấp', 1049000, 849000, '["Trải nghiệm tất cả các dịch vụ", "Thể thao mặt nước", "Tour Cano sinh thái cao tốc", "Lưu trú tại nhà gỗ cao cấp Bungalow An Bình"]'::jsonb, true, 3)
ON CONFLICT (slug) DO NOTHING;
