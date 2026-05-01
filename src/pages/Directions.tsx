import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, ArrowLeft, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import signageImage from "@/assets/signage-direction.jpg";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d108.0!3d12.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f33c0b0000001%3A0x1!2sFXWM%2BGV+Kr%C3%B4ng+Ana+District%2C+Dak+Lak!5e0!3m2!1svi!2s!4v1234567890";
const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/Ng%C3%A3+ba+Duy+Ho%C3%A0,+E+Rang,+Kh%C3%A1nh+Xu%C3%A2n,+Tp.+Bu%C3%B4n+Ma+Thu%E1%BB%99t,+%C4%90%E1%BA%AFk+L%E1%BA%AFk,+Vietnam/12.5152457,108.009273/12.5126973,108.0066554/%C4%90%E1%BA%A2O+XANH+ECOFARM,+Ea+Na,+Kr%C3%B4ng+A+Na,+%C4%90%E1%BA%AFk+L%E1%BA%AFk,+Vietnam/@12.5108521,107.9853783,2832m/data=!3m1!1e3!4m16!4m15!1m5!1m1!1s0x31721e7d8e2aa263:0xf3fdf44ca204318!2m2!1d108.001332!2d12.630912!1m0!1m0!1m5!1m1!1s0x317221c6f98ea9f7:0x4faf6c9f38fa8084!2m2!1d107.9852518!2d12.4957791!3e0!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDExOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D";

export default function Directions() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-wide">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link to="/">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft size={18} />
                {t.directions.backHome}
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <MapPin size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">{t.directions.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-4">
              {t.directions.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.directions.subtitle}</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Address & Directions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Address Card */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <MapPin size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{t.directions.addressTitle}</h3>
                    <p className="text-muted-foreground">Thôn Quỳnh Ngọc 1, Xã Ea Na, Tỉnh Đắk Lắk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Phone size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{t.directions.contactTitle}</h3>
                    <a href="tel:0961898972" className="text-accent hover:underline">
                      096 189 89 72
                    </a>
                  </div>
                </div>
              </div>

              {/* Detailed Directions */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Navigation size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{t.directions.howToGet}</h3>
                </div>

                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  <p>{t.directions.step1}</p>
                  <p className="mt-4">{t.directions.step2}</p>
                  <p className="mt-4 text-primary font-medium">{t.directions.welcome}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Signage & Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Signage Image */}
              {/* <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Image size={18} className="text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">{t.directions.signageTitle}</h3>
                </div>
                <img src={signageImage} alt="Biển chỉ dẫn Đảo Xanh Ecofarm" className="w-full h-auto object-cover" />
              </div>  */}

              {/* Map Embed */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
                <iframe
                  src={GOOGLE_MAPS_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Đảo Xanh Ecofarm Location"
                  className="w-full h-full"
                />
              </div>
              {/* CTA Button */}
              <a href={GOOGLE_MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" size="lg" className="w-full rounded-xl h-14 gap-3 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Navigation size={20} />
                  {t.directions.openMaps}
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
