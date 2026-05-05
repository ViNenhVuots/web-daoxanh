import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImage from "@/assets/hero-resort.jpg";

const offerIcons = [Gift, Calendar, Check];

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/50" />
      </div>

      {/* Content */}
      <div className="container-wide relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <span className="label-elegant text-accent mb-6 block">{t.cta.badge}</span>

            <h2 className="heading-section text-white mb-8">
              {t.cta.title}
              <span className="block text-accent italic font-normal">{t.cta.subtitle}</span>
            </h2>

            <p className="text-white/70 text-base md:text-lg mb-10 max-w-2xl leading-relaxed">
              {t.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dat-phong">
                <Button variant="default" size="lg" className="h-14 bg-accent text-accent-foreground hover:bg-accent/90">
                  {t.cta.bookNow}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/gioi-thieu">
                <Button variant="outline" size="lg" className="h-14 text-white border-white/30 hover:bg-white/10 bg-transparent">
                  {t.cta.learnMore}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
