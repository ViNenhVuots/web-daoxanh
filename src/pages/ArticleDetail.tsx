import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Bed,
  Wifi,
  Wind,
  Bath,
  Coffee,
  Check,
  MapPin,
  Star,
  Loader2,
} from "lucide-react";
import { useAccommodation, useAccommodations } from "@/hooks/useAccommodations";

// Import hình ảnh lưu trú (for fallback)
import lanLaHanhNgoImage from "@/assets/accommodation/lan-la-hanh-ngo.jpg";
import homestayAnYenImage from "@/assets/accommodation/homestay-an-yen.jpg";
import bungalowAnBinhImage from "@/assets/accommodation/bungalow-an-binh.jpg";
import nhaThanhThoiImage from "@/assets/accommodation/nha-thanh-thoi.jpg";
import nhaAnHoaImage from "@/assets/accommodation/nha-an-hoa.jpg";
import leuSerepokImage from "@/assets/accommodation/leu-serepok.jpg";

// Static fallback data
const staticAccommodations: Record<
  string,
  {
    name: string;
    subtitle: string;
    description: string;
    long_description: string;
    image_url: string;
    capacity: string;
    price_original: number;
    price_discounted: number;
    unit: string;
    amenities: string[];
    highlights: string[];
    location: string;
    rating: number;
  }
> = {
  "lan-la-hanh-ngo": {
    name: "Lán lá Hạnh Ngộ",
    subtitle: "Cắm trại lều trong lán, view sông, gắn kết thiên nhiên",
    description:
      "Trải nghiệm cắm trại độc đáo trong lán lá truyền thống với view sông thơ mộng.",
    long_description:
      "Lán lá Hạnh Ngộ là không gian cắm trại độc đáo được thiết kế theo phong cách truyền thống của đồng bào Tây Nguyên. Mái lán được lợp bằng lá cọ tự nhiên, tạo nên không gian mát mẻ và gần gũi với thiên nhiên.\n\nNằm bên bờ sông Sê Rê Pôk, bạn sẽ được đắm mình trong tiếng nước chảy róc rách, tiếng chim hót và không khí trong lành của núi rừng.",
    image_url: lanLaHanhNgoImage,
    capacity: "1-2 khách/lều",
    price_original: 480000,
    price_discounted: 336000,
    unit: "lều/đêm",
    amenities: ["1-2 khách", "Lều + nệm êm", "WC riêng gần đó", "Bữa sáng"],
    highlights: [
      "View sông Sê Rê Pôk tuyệt đẹp",
      "Không gian yên tĩnh",
      "Lều camping chất lượng cao",
      "Khu vực đốt lửa trại",
    ],
    location: "Khu vực bờ sông, Đảo Xanh Ecofarm",
    rating: 4.7,
  },
  "homestay-an-yen": {
    name: "Homestay An Yên",
    subtitle: "Nhà sàn, vách gỗ, mái cọ, view sông dưới tán dừa",
    description:
      "Nhà sàn truyền thống với vách gỗ và mái cọ, mang đến không gian an yên.",
    long_description:
      "Homestay An Yên là nhà sàn truyền thống được xây dựng theo lối kiến trúc dân gian Tây Nguyên. Vách gỗ tự nhiên, mái lợp lá cọ tạo nên không gian mộc mạc, ấm cúng.",
    image_url: homestayAnYenImage,
    capacity: "2 khách/phòng",
    price_original: 1000000,
    price_discounted: 700000,
    unit: "phòng/đêm",
    amenities: ["2 khách", "Giường đôi", "Quạt máy", "WC riêng", "Bữa sáng"],
    highlights: [
      "Nhà sàn truyền thống Tây Nguyên",
      "View sông và vườn dừa",
      "Không gian yên tĩnh",
    ],
    location: "Khu vực vườn dừa, Đảo Xanh Ecofarm",
    rating: 4.8,
  },
  "bungalow-an-binh": {
    name: "Bungalow An Bình",
    subtitle: "Nhà gỗ độc đáo, view sông, yên tĩnh, sang trọng",
    description:
      "Bungalow cao cấp với thiết kế gỗ độc đáo, mang đến không gian sang trọng.",
    long_description:
      "Bungalow An Bình là lựa chọn cao cấp nhất tại Đảo Xanh Ecofarm. Được xây dựng hoàn toàn bằng gỗ tự nhiên.",
    image_url: bungalowAnBinhImage,
    capacity: "2 khách/căn",
    price_original: 1900000,
    price_discounted: 1330000,
    unit: "căn/đêm",
    amenities: [
      "2 khách",
      "Giường King",
      "Máy lạnh",
      "Wifi miễn phí",
      "WC riêng + bồn tắm",
      "Minibar + Bữa sáng",
    ],
    highlights: [
      "Thiết kế gỗ cao cấp",
      "View sông panorama",
      "Tiện nghi 4 sao",
    ],
    location: "Khu vực VIP ven sông, Đảo Xanh Ecofarm",
    rating: 4.9,
  },
  "nha-thanh-thoi": {
    name: "Nhà Thảnh Thơi",
    subtitle: "Family hotel, view vườn thoáng mát, 18-20 khách",
    description: "Không gian rộng rãi phù hợp cho gia đình lớn hoặc nhóm bạn.",
    long_description:
      "Nhà Thảnh Thơi là khu nhà nghỉ dành riêng cho gia đình lớn hoặc nhóm bạn. Với sức chứa lên đến 18-20 khách.",
    image_url: nhaThanhThoiImage,
    capacity: "18-20 khách",
    price_original: 1300000,
    price_discounted: 910000,
    unit: "phòng/đêm",
    amenities: [
      "18-20 khách",
      "Nhiều giường",
      "Máy lạnh",
      "Wifi miễn phí",
      "WC riêng",
      "Bếp + Bữa sáng",
    ],
    highlights: [
      "Sức chứa lớn",
      "View vườn cây xanh mát",
      "Phòng khách chung rộng",
    ],
    location: "Khu vực vườn cây, Đảo Xanh Ecofarm",
    rating: 4.6,
  },
  "nha-an-hoa": {
    name: "Nhà An Hòa",
    subtitle: "Phong cách tân cổ điển, tiện nghi, gần trung tâm",
    description:
      "Nhà nghỉ phong cách tân cổ điển với đầy đủ tiện nghi hiện đại.",
    long_description:
      "Nhà An Hòa mang phong cách kiến trúc tân cổ điển, kết hợp giữa vẻ đẹp truyền thống và sự tiện nghi hiện đại.",
    image_url: nhaAnHoaImage,
    capacity: "2 khách/phòng",
    price_original: 1300000,
    price_discounted: 910000,
    unit: "phòng/đêm",
    amenities: [
      "2 khách",
      "Giường đôi",
      "Máy lạnh",
      "Wifi miễn phí",
      "WC riêng",
      "Minibar + Bữa sáng",
    ],
    highlights: [
      "Kiến trúc tân cổ điển",
      "Gần khu trung tâm",
      "Tiện nghi đầy đủ",
    ],
    location: "Khu trung tâm, Đảo Xanh Ecofarm",
    rating: 4.7,
  },
  "leu-serepok": {
    name: "Lều Sê Rê Pôk",
    subtitle: "Glamping cao cấp, như khách sạn 4 sao, lãng mạn",
    description:
      "Trải nghiệm glamping sang trọng với tiện nghi như khách sạn 4 sao.",
    long_description:
      "Lều Sê Rê Pôk là đỉnh cao của trải nghiệm glamping tại Đảo Xanh. Mỗi lều được thiết kế như một phòng khách sạn 4 sao di động.",
    image_url: leuSerepokImage,
    capacity: "2 khách/lều",
    price_original: 1200000,
    price_discounted: 840000,
    unit: "lều/đêm",
    amenities: [
      "2 khách",
      "Giường King",
      "Máy lạnh",
      "WC riêng",
      "Minibar + Bữa sáng",
    ],
    highlights: [
      "Glamping cao cấp 4 sao",
      "View cánh đồng và sao trời",
      "Không gian lãng mạn",
    ],
    location: "Khu vực cánh đồng, Đảo Xanh Ecofarm",
    rating: 4.9,
  },
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: dbArticle, isLoading } = useAccommodation(slug);
  const { data: allAccommodations } = useAccommodations();

  // Use database data if available, otherwise fallback to static
  const article = dbArticle || (slug ? staticAccommodations[slug] : null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const getImageUrl = (imageUrl: string | null | undefined, slug?: string) => {
    if (imageUrl?.startsWith("http")) return imageUrl;
    if (imageUrl) return imageUrl;
    // Fallback by slug
    if (slug && staticAccommodations[slug])
      return staticAccommodations[slug].image_url;
    return lanLaHanhNgoImage;
  };

  // Get other accommodations
  const otherAccommodations = allAccommodations
    ? allAccommodations.filter((a) => a.slug !== slug).slice(0, 3)
    : Object.entries(staticAccommodations)
        .filter(([key]) => key !== slug)
        .slice(0, 3)
        .map(([key, val]) => ({ ...val, slug: key }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container-wide text-center">
            <h1 className="heading-section text-foreground mb-6">
              Không tìm thấy bài viết
            </h1>
            <p className="body-regular text-muted-foreground mb-8">
              Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/dich-vu")}>
              <ArrowLeft className="mr-2" size={18} />
              Quay lại Dịch vụ
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const amenityIcons: Record<string, React.ReactNode> = {
    khách: <Users size={18} />,
    Giường: <Bed size={18} />,
    Lều: <Bed size={18} />,
    nệm: <Bed size={18} />,
    "Máy lạnh": <Wind size={18} />,
    Quạt: <Wind size={18} />,
    Wifi: <Wifi size={18} />,
    WC: <Bath size={18} />,
    "Bữa sáng": <Coffee size={18} />,
    Minibar: <Coffee size={18} />,
    Bếp: <Coffee size={18} />,
  };

  const getAmenityIcon = (amenity: string) => {
    for (const [key, icon] of Object.entries(amenityIcons)) {
      if (amenity.includes(key)) return icon;
    }
    return <Check size={18} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Image */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={getImageUrl(article.image_url, slug)}
            alt={article.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent pointer-events-none" />

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-28 left-6 md:left-12 z-20"
          >
            <Link to="/dich-vu#luu-tru" className="inline-block">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/40 hover:bg-white/10 hover:border-white/60 bg-transparent"
              >
                <ArrowLeft className="mr-2" size={16} />
                Quay lại
              </Button>
            </Link>
          </motion.div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="label-elegant text-accent mb-4 block">
                  Lưu trú
                </span>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
                  {article.name}
                </h1>
                <p className="text-white/80 text-lg max-w-2xl">
                  {article.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <span className="flex items-center gap-2 text-white/70 text-sm">
                    <MapPin size={16} />
                    {article.location}
                  </span>
                  <span className="flex items-center gap-2 text-accent text-sm">
                    <Star size={16} fill="currentColor" />
                    {article.rating}/5
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Main content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    Giới thiệu
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {(article.long_description || article.description || "")
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </motion.div>

                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-12"
                >
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    Điểm nổi bật
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {article.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-foreground"
                      >
                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                          <Check size={14} className="text-secondary" />
                        </div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Amenities */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mt-12"
                >
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    Tiện nghi
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {article.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl"
                      >
                        <div className="text-primary">
                          {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-sm text-foreground">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar - Pricing */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="sticky top-28"
                >
                  <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border/50">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-muted-foreground line-through text-lg">
                          {formatPrice(article.price_original || 0)}đ
                        </span>
                        <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded">
                          -30%
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(article.price_discounted || 0)}đ
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        / {article.unit}
                      </p>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sức chứa</span>
                        <span className="font-medium text-foreground">
                          {article.capacity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Đánh giá</span>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Star
                            size={14}
                            className="text-accent"
                            fill="currentColor"
                          />
                          {article.rating}/5
                        </span>
                      </div>
                    </div>

                    <Link to="/dat-phong">
                      <Button size="lg" className="w-full">
                        Đặt phòng ngay
                        <ArrowRight className="ml-2" size={18} />
                      </Button>
                    </Link>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Liên hệ hotline: 0901 234 567
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Accommodations */}
        {otherAccommodations.length > 0 && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container-wide">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">
                Các loại lưu trú khác
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {otherAccommodations.map((acc) => (
                  <Link
                    key={acc.slug}
                    to={`/luu-tru/${acc.slug}`}
                    className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={getImageUrl(acc.image_url, acc.slug)}
                        alt={acc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {acc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {acc.subtitle || acc.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
