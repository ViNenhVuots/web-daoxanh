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

  const offers = t.cta.offers.map((offer, index) => ({
    ...offer,
    icon: offerIcons[index],
  }));

  return (
    <section ref={ref} className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/50" />
      </div>

      {/* Content */}
      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="label-elegant text-accent mb-6 block">{t.cta.badge}</span>

            <h2 className="heading-section text-white mb-8">
              {t.cta.title}
              <span className="block text-accent italic font-normal">{t.cta.subtitle}</span>
            </h2>

            <p className="text-white/70 text-base md:text-lg mb-10 max-w-md leading-relaxed">
              {t.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
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

          {/* Right - Offers Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20">
              <h3 className="text-2xl font-serif text-white mb-10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                {t.cta.specialOffers}
              </h3>

              <div className="space-y-5">
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.15 }}
                    className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/30 transition-colors">
                      <offer.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-lg">{offer.title}</div>
                      <div className="text-white/60 text-sm mt-0.5">{offer.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/50 text-sm text-center">{t.cta.offerNote}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
