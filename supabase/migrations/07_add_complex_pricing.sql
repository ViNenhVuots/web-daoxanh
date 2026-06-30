-- Thêm các cột cho bảng giá chi tiết
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS price_day integer;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS price_3_guests integer;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS price_4_guests integer;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS price_5_guests integer;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS surcharge_adult integer;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS surcharge_child integer;
