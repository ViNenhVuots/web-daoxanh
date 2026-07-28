-- =============================================
-- Seed gallery images: Lưu trú & Dịch vụ
-- Dán vào Supabase SQL Editor để chạy
-- =============================================

-- Album: Lưu trú (6 ảnh)
INSERT INTO public.gallery_images (src, alt, category, display_order) VALUES
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/accommodation/lan-la-hanh-ngo.jpg',
  'Lán lá Hạnh Ngộ - Nhà sàn bên bờ sông Serepok',
  'Lưu trú',
  1
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/accommodation/bungalow-an-binh.jpg',
  'Bungalow An Bình - Nhà gỗ cao cấp giữa thiên nhiên',
  'Lưu trú',
  2
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/accommodation/nha-thanh-thoi.jpg',
  'Nhà Thảnh Thơi - Family Hotel ấm cúng',
  'Lưu trú',
  3
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/accommodation/leu-serepok.jpg',
  'Lều Sê Rê Pôk - Glamping đẳng cấp bên sông',
  'Lưu trú',
  4
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/accommodation/homestay-an-yen.jpg',
  'Homestay An Yên - Không gian nghỉ dưỡng yên bình',
  'Lưu trú',
  5
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/accommodation/nha-an-hoa.jpg',
  'Nhà An Hòa - Không gian lưu trú tiện nghi',
  'Lưu trú',
  6
);

-- Album: Dịch vụ (4 ảnh - bỏ nghi-duong.jpg vì quá lớn 18MB)
INSERT INTO public.gallery_images (src, alt, category, display_order) VALUES
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/services/ngoai-troi.jpg',
  'Hoạt động ngoài trời - Team building & thể thao',
  'Dịch vụ',
  1
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/services/am-thuc.jpg',
  'Ẩm thực Tây Nguyên - BBQ & lẩu đặc sản',
  'Dịch vụ',
  2
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/services/nong-trai.jpg',
  'Trải nghiệm nông trại hữu cơ Đảo Xanh',
  'Dịch vụ',
  3
),
(
  'https://raw.githubusercontent.com/ViNenhVuots/web-daoxanh/main/src/assets/hero-resort.jpg',
  'Toàn cảnh khu nghỉ dưỡng Đảo Xanh Ecofarm',
  'Dịch vụ',
  4
);
