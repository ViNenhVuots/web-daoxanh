import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Package,
  Tent,
  Home,
  Building,
  Sparkles,
  Loader2,
  UtensilsCrossed,
  TreePine,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAccommodations } from "@/hooks/useAccommodations";
import { useComboPackages, useDayTripPackages } from "@/hooks/usePackages";
import { PageSEO, getServicesSchema } from "@/components/seo/PageSEO";

import accommodationImage from "@/assets/services/nghi-duong.jpg";
import cuisineImage from "@/assets/services/am-thuc.jpg";
import teambuilding from "@/assets/services/ngoai-troi.jpg"
import ecofarmImage from "@/assets/hero-resort.jpg";

// Import hình ảnh từng loại lưu trú (for fallback)
import lanLaHanhNgoImage from "@/assets/accommodation/lan-la-hanh-ngo.jpg";
import homestayAnYenImage from "@/assets/accommodation/homestay-an-yen.jpg";
import bungalowAnBinhImage from "@/assets/accommodation/bungalow-an-binh.jpg";
import nhaThanhThoiImage from "@/assets/accommodation/nha-thanh-thoi.jpg";
import nhaAnHoaImage from "@/assets/accommodation/nha-an-hoa.jpg";
import leuSerepokImage from "@/assets/accommodation/leu-serepok.jpg";

// Static fallback data
const staticAccommodations = [
  {
    name: "Lán lá Hạnh Ngộ",
    description: "Cắm trại lều trong lán, view sông, gắn kết thiên nhiên",
    image_url: lanLaHanhNgoImage,
    slug: "lan-la-hanh-ngo",
  },
  {
    name: "Homestay An Yên",
    description: "Nhà sàn, vách gỗ, mái cọ, view sông dưới tán dừa",
    image_url: homestayAnYenImage,
    slug: "homestay-an-yen",
  },
  {
    name: "Bungalow An Bình",
    description: "Nhà gỗ độc đáo, view sông, yên tĩnh, sang trọng",
    image_url: bungalowAnBinhImage,
    slug: "bungalow-an-binh",
  },
  {
    name: "Nhà Thảnh Thơi",
    description: "Family hotel, view vườn thoáng mát, 18-20 khách",
    image_url: nhaThanhThoiImage,
    slug: "nha-thanh-thoi",
  },
  {
    name: "Nhà An Hòa",
    description: "Phong cách tân cổ điển, tiện nghi, gần trung tâm",
    image_url: nhaAnHoaImage,
    slug: "nha-an-hoa",
  },
  {
    name: "Lều Sê Rê Pôk",
    description: "Glamping cao cấp, như khách sạn 4 sao, lãng mạn",
    image_url: leuSerepokImage,
    slug: "leu-serepok",
  },
];

const staticComboPackages = [
  {
    name: "Gói A",
    slug: "goi-a",
    subtitle: "Cắm trại glamping lều đơn tại lán lá Hạnh Ngộ",
    price_adult: 454000,
    price_child: 314000,
    includes: [
      "Lưu trú 1 đêm",
      "Bữa sáng",
      "Trải nghiệm nông trại",
      "Tham quan vườn",
    ],
    img_url: ecofarmImage,
  },
  {
    name: "Gói A1",
    slug: "goi-a1",
    subtitle: "Tùy chọn lưu trú",
    price_adult: 524000,
    price_child: 384000,
    includes: [
      "Lưu trú tùy chọn",
      "Bữa sáng",
      "Bữa trưa",
      "Trải nghiệm nông trại",
    ],
    img_url: ecofarmImage,
  },
  {
    name: "Gói A2",
    slug: "goi-a2",
    subtitle: "Nhà gỗ Bungalow cao cấp An Bình",
    price_adult: 734000,
    price_child: 594000,
    includes: [
      "Bungalow cao cấp",
      "Bữa sáng + trưa",
      "Trải nghiệm VIP",
      "BBQ tối",
    ],
    img_url: ecofarmImage,
  },
];

const staticDayTripPackages = [
  {
    name: "Gói A - Nông trại tiêu chuẩn",
    slug: "goi-a-nong-trai-tieu-chuan",
    price_adult: 84000,
    price_child: 59000,
    includes: [
      "Tham quan nông trại",
      "Hái rau",
      "Cho cá ăn",
      "Check-in cảnh đẹp",
    ],
    img_url: "@/assets/hero-resort.jpg",
  },
  {
    name: "Gói A1 - Nông trại 5 sao",
    slug: "goi-a1-nong-trai-5-sao",
    price_adult: 137000,
    price_child: 112000,
    includes: [
      "Tất cả gói A",
      "Đi xe trâu",
      "Bắt cá suối",
      "Nướng BBQ (tùy chọn)",
    ],
  },
  {
    name: "Gói A2 - Nông trại 5 sao+",
    slug: "goi-a2-nong-trai-5-sao-plus",
    price_adult: 189000,
    price_child: 165000,
    includes: [
      "Tất cả gói A1",
      "Kayak đạp vịt",
      "Tắm suối",
      "BBQ đặc biệt (tùy chọn)",
    ],
  },
];

const Services = () => {
  const { t } = useLanguage();
  const accommodationRef = useRef(null);
  const comboRef = useRef(null);
  const dayTripRef = useRef(null);
  const cuisineRef = useRef(null);
  const farmRef = useRef(null);

  const isAccommodationInView = useInView(accommodationRef, {
    once: true,
    margin: "-100px",
  });
  const isComboInView = useInView(comboRef, { once: true, margin: "-100px" });
  const isDayTripInView = useInView(dayTripRef, {
    once: true,
    margin: "-100px",
  });
  const isCuisineInView = useInView(cuisineRef, {
    once: true,
    margin: "-100px",
  });
  const isFarmInView = useInView(farmRef, { once: true, margin: "-100px" });

  // Fetch from database
  const { data: dbAccommodations, isLoading: loadingAccommodations } =
    useAccommodations();
  const { data: dbComboPackages, isLoading: loadingCombo } = useComboPackages();
  const { data: dbDayTripPackages, isLoading: loadingDayTrip } =
    useDayTripPackages();

  // Use database data if available, otherwise fallback to static
  const accommodations =
    dbAccommodations && dbAccommodations.length > 0
      ? dbAccommodations.map((acc) => ({
          name: acc.name,
          description: acc.subtitle || acc.description || "",
          image_url: acc.image_url,
          slug: acc.slug,
        }))
      : staticAccommodations;

  const comboPackages =
    dbComboPackages && dbComboPackages.length > 0
      ? dbComboPackages
      : staticComboPackages;

  const dayTripPackages =
    dbDayTripPackages && dbDayTripPackages.length > 0
      ? dbDayTripPackages
      : staticDayTripPackages;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // SEO services data
  const seoServicesData = useMemo(
    () => [
      {
        name: "Lưu trú sinh thái",
        description:
          "Các loại hình lưu trú độc đáo từ homestay đến glamping cao cấp",
      },
      {
        name: "Gói combo nghỉ dưỡng",
        description: "Trọn gói lưu trú, ăn uống và trải nghiệm nông trại",
      },
      {
        name: "Tour trong ngày",
        description: "Trải nghiệm nông trại và hoạt động ngoài trời trong ngày",
      },
      {
        name: "Trải nghiệm nông trại",
        description:
          "Hái rau, cho cá ăn, đi xe trâu và các hoạt động thú vị khác",
      },
    ],
    [],
  );

  const servicesSchema = getServicesSchema(seoServicesData);

  const getImageUrl = (
    imageUrl: string | null | undefined,
    fallbackSlug?: string,
  ) => {
    if (imageUrl?.startsWith("http")) return imageUrl;
    if (imageUrl) return imageUrl;
    // Fallback
    const staticItem = staticAccommodations.find(
      (a) => a.slug === fallbackSlug,
    );
    return staticItem?.image_url || lanLaHanhNgoImage;
  };

  return (
    <>
      <PageSEO
        title="Dịch vụ tại Đảo Xanh Ecofarm"
        description="Khám phá các dịch vụ du lịch sinh thái: lưu trú độc đáo từ homestay đến glamping, gói combo nghỉ dưỡng, tour trong ngày và trải nghiệm nông trại hữu cơ."
        url="/dich-vu"
        keywords="dịch vụ đảo xanh, homestay đắk lắk, glamping tây nguyên, combo nghỉ dưỡng, tour nông trại, lưu trú sinh thái"
        structuredData={servicesSchema}
        breadcrumbs={[
          { name: "Trang chủ", url: "/" },
          { name: "Dịch vụ", url: "/dich-vu" },
        ]}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
          {/* Hero */}
          <section className="pt-32 pb-20 md:pb-24 bg-muted/40">
            <div className="container-wide text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <span className="label-elegant text-accent mb-5 block">
                  {t.services.badge}
                </span>
                <h1 className="heading-hero text-foreground mb-8">
                  {t.services.title}{" "}
                  <span className="italic text-primary">
                    {t.services.subtitle}
                  </span>
                </h1>
                <div className="w-16 h-0.5 bg-accent mx-auto mb-8" />
                <p className="body-large text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t.services.description}
                </p>

                {/* Service Type Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mt-12">
                  <a
                    href="#luu-tru"
                    className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <Home size={18} className="text-primary" />
                    <span className="text-sm font-medium">Lưu trú</span>
                  </a>
                  <a
                    href="#combo"
                    className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <Package size={18} className="text-primary" />
                    <span className="text-sm font-medium">Combo 2N1Đ</span>
                  </a>
                  <a
                    href="#trai-nghiem"
                    className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <Tent size={18} className="text-primary" />
                    <span className="text-sm font-medium">Trong ngày</span>
                  </a>
                  <a
                    href="#am-thuc"
                    className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <UtensilsCrossed size={18} className="text-primary" />
                    <span className="text-sm font-medium">Ẩm thực</span>
                  </a>
                  <a
                    href="#nong-trai"
                    className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <TreePine size={18} className="text-primary" />
                    <span className="text-sm font-medium">Nông trại</span>
                  </a>
                  <a
                    href="#team-building"
                    className="flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <Building size={18} className="text-primary" />
                    <span className="text-sm font-medium">Team Building</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Accommodation Section */}
          <section
            ref={accommodationRef}
            id="luu-tru"
            className="py-20 md:py-28 lg:py-36 scroll-mt-24"
          >
            <div className="container-wide">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isAccommodationInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <span className="label-elegant text-accent mb-5 block">
                    Lưu trú
                  </span>
                  <h2 className="heading-section text-foreground mb-6">
                    6 loại hình{" "}
                    <span className="italic text-primary">lưu trú đặc sắc</span>
                  </h2>
                  <p className="body-regular text-muted-foreground max-w-2xl mx-auto">
                    Từ cắm trại glamping đến bungalow cao cấp, chọn không gian
                    phù hợp cho kỳ nghỉ của bạn
                  </p>
                </motion.div>
              </div>

              {loadingAccommodations ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {accommodations.map((room, index) => (
                    <motion.div
                      key={room.slug}
                      initial={{ opacity: 0, y: 50 }}
                      animate={
                        isAccommodationInView ? { opacity: 1, y: 0 } : {}
                      }
                      transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
                      className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={getImageUrl(room.image_url, room.slug)}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-serif text-xl font-semibold text-white mb-2">
                          {room.name}
                        </h3>
                        <p className="text-white/70 text-sm mb-4 leading-relaxed line-clamp-2">
                          {room.description}
                        </p>
                        <Link to={`/luu-tru/${room.slug}`}>
                          <Button
                            variant="default"
                            size="sm"
                            className="text-white border-white/40 hover:bg-white/10 hover:border-white/60"
                          >
                            Xem thêm
                            <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Combo 2N1Đ Section */}
          <section
            ref={comboRef}
            id="combo"
            className="py-20 md:py-28 lg:py-36 bg-muted/40 scroll-mt-24"
          >
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={isComboInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1 }}
                >
                  <span className="label-elegant text-accent mb-5 block">
                    Combo 2 ngày 1 đêm
                  </span>
                  <h2 className="heading-section text-foreground mb-8">
                    Trọn gói{" "}
                    <span className="italic text-primary">nghỉ dưỡng</span>
                  </h2>
                  <p className="body-regular text-muted-foreground mb-8 leading-relaxed">
                    Kết hợp hoàn hảo giữa lưu trú và trải nghiệm nông trại. Mỗi
                    gói đều bao gồm ăn uống, hoạt động và những kỷ niệm đáng
                    nhớ.
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
                    <Sparkles size={18} className="text-accent" />
                    <span>Giảm đến 30% so với giá lẻ</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isComboInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="rounded-3xl overflow-hidden shadow-elevated">
                    <img
                      src={accommodationImage}
                      alt="Combo nghỉ dưỡng"
                      className="w-full h-[400px] lg:h-[480px] object-cover"
                    />
                  </div>
                </motion.div>
              </div>

              {loadingCombo ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                  {comboPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.name}
                      initial={{ opacity: 0, y: 50 }}
                      animate={isComboInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-500 border border-border/50 hover:border-accent/30"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Package size={20} className="text-primary" />
                        <h3 className="font-serif text-xl font-semibold text-foreground">
                          {pkg.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6">
                        {pkg.subtitle}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {pkg.includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 text-sm text-foreground"
                          >
                            <Check
                              size={16}
                              className="text-secondary shrink-0"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-2 pt-6 border-t border-border/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Người lớn:
                          </span>
                          <span className="font-semibold text-foreground">
                            {formatPrice(pkg.price_adult)}đ
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Trẻ em:</span>
                          <span className="font-semibold text-foreground">
                            {formatPrice(pkg.price_child || 0)}đ
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        {pkg.slug && (
                          <Link to={`/combo/${pkg.slug}`} className="flex-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Chi tiết
                            </Button>
                          </Link>
                        )}
                        <Link to="/dat-phong" className="flex-1">
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                          >
                            Đặt gói
                            <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Day Trip Section */}
          <section
            ref={dayTripRef}
            id="trai-nghiem"
            className="py-20 md:py-28 lg:py-36 scroll-mt-24"
          >
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={isDayTripInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="order-2 lg:order-1"
                >
                  <div className="rounded-3xl overflow-hidden shadow-elevated">
                    <img
                      src={teambuilding}
                      alt="Trải nghiệm trong ngày"
                      className="w-full h-[450px] lg:h-[550px] object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isDayTripInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1 }}
                  className="order-1 lg:order-2"
                >
                  <span className="label-elegant text-accent mb-5 block">
                    Trải nghiệm trong ngày
                  </span>
                  <h2 className="heading-section text-foreground mb-8">
                    Khám phá{" "}
                    <span className="italic text-primary">trải nghiệm</span>
                  </h2>
                  <p className="body-regular text-muted-foreground mb-10 leading-relaxed">
                    Không cần nghỉ lại, vẫn có thể trải nghiệm đầy đủ cuộc sống
                    nông trại với các hoạt động thú vị từ sáng đến chiều.
                  </p>

                  {loadingDayTrip ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4 mb-10">
                      {dayTripPackages.map((pkg) => (
                        <Link
                          key={pkg.name}
                          to={
                            pkg.slug ? `/trai-nghiem/${pkg.slug}` : "/dat-phong"
                          }
                          className="block bg-muted/50 rounded-xl p-5 hover:bg-muted transition-colors group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {pkg.name}
                            </h4>
                            <div className="text-right flex items-center gap-3">
                              <div>
                                <span className="text-primary font-semibold">
                                  {formatPrice(pkg.price_adult)}đ
                                </span>
                                <span className="text-muted-foreground text-xs block">
                                  / người lớn
                                </span>
                              </div>
                              <ArrowRight
                                size={16}
                                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {pkg.includes.slice(0, 4).map((item) => (
                              <span
                                key={item}
                                className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link to="/dat-phong">
                    <Button variant="default" size="lg">
                      Đặt trải nghiệm
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Ẩm thực Section */}
          <section
            ref={cuisineRef}
            id="am-thuc"
            className="py-20 md:py-28 lg:py-36 bg-muted/40 scroll-mt-24"
          >
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={isCuisineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1 }}
                >
                  <span className="label-elegant text-accent mb-5 block">
                    Ẩm thực
                  </span>
                  <h2 className="heading-section text-foreground mb-8">
                    Hương vị{" "}
                    <span className="italic text-primary">Tây Nguyên</span>
                  </h2>
                  <p className="body-regular text-muted-foreground mb-8 leading-relaxed">
                    Thưởng thức các món ăn tươi ngon được chế biến từ nguyên
                    liệu hữu cơ tại nông trại. Từ rau củ vườn nhà đến đặc sản
                    địa phương, mỗi bữa ăn đều là một trải nghiệm ẩm thực đích
                    thực.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border/50">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <Check size={18} className="text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Buffet sáng đa dạng
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Phở, bún, cháo, bánh mì và nhiều món ăn sáng truyền
                          thống
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border/50">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <Check size={18} className="text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Đặc sản địa phương
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Gà nướng, cá suối, rau rừng và các món ăn đặc trưng
                          Tây Nguyên
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border/50">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <Check size={18} className="text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          BBQ lửa trại
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Tiệc nướng ngoài trời với không khí ấm cúng bên lửa
                          trại
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link to="/dat-phong">
                    <Button variant="default" size="lg">
                      Đặt bàn ngay
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isCuisineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="rounded-3xl overflow-hidden shadow-elevated">
                    <img
                      src={cuisineImage}
                      alt="Ẩm thực Đảo Xanh"
                      className="w-full h-[450px] lg:h-[550px] object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Nông trại Section */}
          <section
            id="nong-trai"
            className="py-20 md:py-28 lg:py-36 scroll-mt-24"
          >
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1 }}
                  className="order-2 lg:order-1"
                >
                  <div className="rounded-3xl overflow-hidden shadow-elevated">
                    <img
                      src={ecofarmImage}
                      alt="Nông trại Đảo Xanh"
                      className="w-full h-[450px] lg:h-[550px] object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="order-1 lg:order-2"
                >
                  <span className="label-elegant text-accent mb-5 block">
                    Trải nghiệm nông trại
                  </span>
                  <h2 className="heading-section text-foreground mb-8">
                    Sống cùng{" "}
                    <span className="italic text-primary">thiên nhiên</span>
                  </h2>
                  <p className="body-regular text-muted-foreground mb-8 leading-relaxed">
                    Hòa mình vào cuộc sống nhà nông với các hoạt động trải
                    nghiệm độc đáo. Từ hái rau vườn, cho cá ăn đến đi xe trâu -
                    mỗi hoạt động đều mang đến niềm vui và kỷ niệm đáng nhớ.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-serif font-bold text-primary mb-1">
                        14+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Hecta diện tích
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-serif font-bold text-primary mb-1">
                        100%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Hữu cơ
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-serif font-bold text-primary mb-1">
                        10+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Hoạt động
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-serif font-bold text-primary mb-1">
                        365
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ngày mở cửa
                      </div>
                    </div>
                  </div>

                  <Link to="/dich-vu#trai-nghiem">
                    <Button variant="default" size="lg">
                      Xem các gói trải nghiệm
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Team Building Section */}
          <section
            ref={farmRef}
            id="team-building"
            className="py-24 md:py-32 lg:py-40 bg-gradient-nature scroll-mt-24 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(155_35%_35%_/_0.4)_0%,_transparent_50%)]" />
            <div className="container-wide relative">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isFarmInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <span className="label-elegant text-accent mb-5 block">
                    Dịch vụ đặc biệt
                  </span>
                  <h2 className="heading-section text-white mb-6">
                    Team Building &{" "}
                    <span className="italic text-accent">Sự kiện</span>
                  </h2>
                  <p className="body-regular text-white/80 max-w-2xl mx-auto">
                    Tổ chức team building, workshop, tiệc công ty với không gian
                    thiên nhiên độc đáo
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isFarmInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <a href="tel:0901234567">
                  <Button variant="default" size="lg">
                    Liên hệ tư vấn
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </a>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Services;
