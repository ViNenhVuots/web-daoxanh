import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImage from "@/assets/hero-resort.jpg";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Preload hero image on mount
  useEffect(() => {
    const img = new Image();
    img.src = heroImage;
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <>
      <section ref={ref} className="relative h-screen min-h-[1000px] max-h-[1200px] overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ scale, y }} className="absolute inset-0">
          {/* Skeleton placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60 animate-pulse" />
          )}
          <img 
            src={heroImage} 
            alt="Đảo Xanh Resort" 
            className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </motion.div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <motion.div style={{ opacity }} className="container-wide">
            <div className="max-w-4xl mx-auto text-center">
              {/* Location Badge - Links to Directions */}
              <Link to="/chi-duong">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full mb-8 cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <MapPin size={16} className="text-accent" />
                  <span className="text-white/90 text-sm font-medium tracking-wide">{t.hero.location}</span>
                </motion.div>
              </Link>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-white mb-6 leading-[1.1]"
              >
                {t.hero.title}
                <span className="block text-accent mt-2">{t.hero.subtitle}</span>
                <span className="block text-accent">{t.hero.subtitle2}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl text-white/80 font-light mb-10 max-w-xl mx-auto leading-relaxed"
              >
                {t.hero.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link to="/dat-phong">
                  <Button variant="default" size="lg" className="rounded-full px-10 h-14 bg-accent text-accent-foreground hover:bg-accent/90">
                    {t.hero.bookNow}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/gioi-thieu">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-10 h-14 text-white bg-transparent border-white/30 hover:bg-white/10 hover:border-white/50"
                  >
                    <Play size={18} className="mr-2" />
                    {t.hero.explore}
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="relative pt-16"
              >
                <div className="container-wide">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                      <div className="p-5 md:p-6 text-center">
                        <div className="text-3xl md:text-4xl font-serif font-semibold text-white mb-1">14+</div>
                        <div className="text-white/60 text-xs md:text-sm tracking-wide">{t.hero.stats.area}</div>
                      </div>
                      <div className="p-5 md:p-6 text-center">
                        <div className="text-3xl md:text-4xl font-serif font-semibold text-white mb-1">10K+</div>
                        <div className="text-white/60 text-xs md:text-sm tracking-wide">{t.hero.stats.rooms}</div>
                      </div>
                      <div className="p-5 md:p-6 text-center">
                        <div className="text-3xl md:text-4xl font-serif font-semibold text-accent mb-1">5.0</div>
                        <div className="text-white/60 text-xs md:text-sm tracking-wide">{t.hero.stats.rating}</div>
                      </div>
                      <div className="p-5 md:p-6 text-center">
                        <div className="text-3xl md:text-4xl font-serif font-semibold text-white mb-1">2018</div>
                        <div className="text-white/60 text-xs md:text-sm tracking-wide">{t.hero.scrollDown}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
