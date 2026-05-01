import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Package, Users, Calendar, Sparkles, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useComboPackageBySlug, useComboPackages } from "@/hooks/usePackages";
import { PageSEO } from "@/components/seo/PageSEO";

import accommodationImage from "@/assets/services/nghi-duong.jpg";

const ComboPackageDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading, error } = useComboPackageBySlug(slug || '');
  const { data: allPackages } = useComboPackages();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-serif">Không tìm thấy gói combo</h1>
          <Link to="/dich-vu#combo">
            <Button variant="default">
              <ArrowLeft className="mr-2" size={16} />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const otherPackages = allPackages?.filter(p => p.slug !== slug) || [];

  return (
    <>
      <PageSEO
        title={`${pkg.name} - Combo 2 Ngày 1 Đêm | Đảo Xanh Ecofarm`}
        description={pkg.subtitle || `Gói combo nghỉ dưỡng ${pkg.name} tại Đảo Xanh Ecofarm với đầy đủ tiện nghi và trải nghiệm nông trại.`}
        url={`/combo/${slug}`}
        keywords={`combo nghỉ dưỡng, ${pkg.name}, đảo xanh ecofarm, 2 ngày 1 đêm`}
        breadcrumbs={[
          { name: "Trang chủ", url: "/" },
          { name: "Dịch vụ", url: "/dich-vu" },
          { name: pkg.name, url: `/combo/${slug}` },
        ]}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
          {/* Hero */}
          <section className="pt-32 pb-16 bg-muted/40">
            <div className="container-wide">
              <Link to="/dich-vu#combo" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                <ArrowLeft size={18} />
                <span>Xem tất cả gói combo</span>
              </Link>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Package size={24} className="text-primary" />
                    <span className="label-elegant text-accent">Combo 2 ngày 1 đêm</span>
                  </div>
                  <h1 className="heading-hero text-foreground mb-4">{pkg.name}</h1>
                  <p className="body-large text-muted-foreground mb-8">{pkg.subtitle}</p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={16} className="text-primary" />
                      <span>2 ngày 1 đêm</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users size={16} className="text-primary" />
                      <span>Phù hợp mọi lứa tuổi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles size={16} className="text-accent" />
                      <span>Giảm đến 30%</span>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-6 border border-border/50">
                    <div className="flex items-end gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Người lớn</span>
                        <div className="text-3xl font-serif font-bold text-primary">
                          {formatPrice(pkg.price_adult)}đ
                        </div>
                      </div>
                      <div className="pb-1">
                        <span className="text-sm text-muted-foreground">Trẻ em</span>
                        <div className="text-xl font-semibold text-foreground">
                          {formatPrice(pkg.price_child || 0)}đ
                        </div>
                      </div>
                    </div>
                    <Link to="/dat-phong">
                      <Button variant="default" size="lg" className="w-full">
                        Đặt gói này ngay
                        <ArrowRight className="ml-2" size={18} />
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="rounded-3xl overflow-hidden shadow-elevated">
                    <img 
                      src={pkg.image_url || accommodationImage} 
                      alt={pkg.name}
                      className="w-full h-[400px] lg:h-[500px] object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = accommodationImage;
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Package Details */}
          <section className="py-20">
            <div className="container-wide">
              <div className="max-w-3xl">
                <h2 className="heading-section text-foreground mb-8">
                  Gói bao gồm
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pkg.includes.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <Check size={16} className="text-secondary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Other Packages */}
          {otherPackages.length > 0 && (
            <section className="py-20 bg-muted/40">
              <div className="container-wide">
                <h2 className="heading-section text-foreground mb-8">
                  Các gói khác
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {otherPackages.map((otherPkg) => (
                    <Link
                      key={otherPkg.id}
                      to={`/combo/${otherPkg.slug}`}
                      className="group bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all hover:shadow-soft"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Package size={18} className="text-primary" />
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {otherPkg.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{otherPkg.subtitle}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-semibold">{formatPrice(otherPkg.price_adult)}đ</span>
                        <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
    </>
  );
};

export default ComboPackageDetail;
