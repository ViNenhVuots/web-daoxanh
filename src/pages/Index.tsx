import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { PageSEO, getOrganizationSchema, getLocalBusinessSchema } from "@/components/seo/PageSEO";

const Index = () => {
  const organizationSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <>
      <PageSEO
        title="Đảo Xanh Ecofarm - Khu nghỉ dưỡng sinh thái Tây Nguyên"
        description="Trải nghiệm du lịch sinh thái độc đáo tại Đảo Xanh Ecofarm - Nông trại hữu cơ, lưu trú xanh, ẩm thực địa phương giữa thiên nhiên Đắk Lắk."
        url="/"
        keywords="đảo xanh ecofarm, du lịch sinh thái, nghỉ dưỡng đắk lắk, nông trại hữu cơ, homestay tây nguyên, glamping việt nam"
        structuredData={organizationSchema}
        breadcrumbs={[{ name: "Trang chủ", url: "/" }]}
      />
      <PageSEO
        title=""
        description=""
        url="/"
        structuredData={localBusinessSchema}
      />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <ServicesSection />
          <ExperienceSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
