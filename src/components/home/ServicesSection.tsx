import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bed, UtensilsCrossed, TreePine, Waves } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

import accommodationImage from "@/assets/services/nghi-duong.jpg";
import cuisineImage from "@/assets/services/am-thuc.jpg";
import activitiesImage from "@/assets/services/ngoai-troi.jpg";
import farmImage from "@/assets/services/nong-trai.jpg";

// Memoized service image component for better performance
const ServiceImage = memo(({ 
  src, 
  alt, 
  isActive 
}: { 
  src: string; 
  alt: string; 
  isActive: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {!loaded && isActive && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </motion.div>
  );
});

ServiceImage.displayName = 'ServiceImage';

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();

  const services = [
    {
      icon: Bed,
      title: t.services.items.accommodation.title,
      subtitle: t.services.items.accommodation.subtitle,
      description: t.services.items.accommodation.description,
      image: accommodationImage,
      href: "/dich-vu#luu-tru",
    },
    {
      icon: Waves,
      title: t.services.items.activities.title,
      subtitle: t.services.items.activities.subtitle,
      description: t.services.items.activities.description,
      image: activitiesImage,
      href: "/dich-vu#trai-nghiem",
    },
    {
      icon: UtensilsCrossed,
      title: t.services.items.cuisine.title,
      subtitle: t.services.items.cuisine.subtitle,
      description: t.services.items.cuisine.description,
      image: cuisineImage,
      href: "/dich-vu#am-thuc",
    },
    {
      icon: TreePine,
      title: t.services.items.farming.title,
      subtitle: t.services.items.farming.subtitle,
      description: t.services.items.farming.description,
      image: farmImage,
      href: "/dich-vu#nong-trai",
    },
  ];

  // Preload adjacent images for smoother transitions
  useEffect(() => {
    if (isInView) {
      const nextIndex = (activeIndex + 1) % services.length;
      const prevIndex = (activeIndex - 1 + services.length) % services.length;
      
      [nextIndex, prevIndex].forEach(idx => {
        const img = new Image();
        img.src = services[idx].image;
      });
    }
  }, [activeIndex, isInView, services]);

  return (
    <section ref={ref} className="py-20 md:py-28 lg:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container-wide relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="label-elegant text-accent mb-4 block">{t.services.badge}</span>
          <h2 className="heading-section text-foreground mb-5">
            {t.services.title}{" "}
            <span className="text-primary italic">{t.services.subtitle}</span>
          </h2>
          <div className="w-12 h-0.5 bg-accent mx-auto" />
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated bg-muted">
              {services.map((service, index) => (
                <ServiceImage
                  key={service.title}
                  src={service.image}
                  alt={service.title}
                  isActive={activeIndex === index}
                />
              ))}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              
              {/* Active service info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-white/70 text-sm uppercase tracking-wider mb-2 block">
                    {services[activeIndex].subtitle}
                  </span>
                  <h3 className="font-serif text-2xl lg:text-3xl text-white font-semibold mb-2">
                    {services[activeIndex].title}
                  </h3>
                  <p className="text-white/80 text-sm lg:text-base max-w-md leading-relaxed">
                    {services[activeIndex].description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Image navigation dots */}
            <div className="flex justify-center gap-2 mt-5">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`View service ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right - Service List */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-3"
          >
            {services.map((service, index) => (
              <Link
                key={service.title}
                to={service.href}
                onMouseEnter={() => setActiveIndex(index)}
                className="group block"
              >
                <div
                  className={`p-5 lg:p-6 rounded-xl transition-all duration-300 border ${
                    activeIndex === index
                      ? "bg-card border-primary/30 shadow-soft"
                      : "bg-transparent border-transparent hover:bg-card/50 hover:border-border"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                        activeIndex === index
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary group-hover:bg-primary/10"
                      }`}
                    >
                      <service.icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {service.subtitle}
                          </span>
                          <h3
                            className={`font-serif text-lg lg:text-xl font-semibold transition-colors ${
                              activeIndex === index ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {service.title}
                          </h3>
                        </div>
                        <ArrowRight
                          className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                            activeIndex === index
                              ? "text-primary translate-x-0 opacity-100"
                              : "text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-sm text-muted-foreground mt-1.5 line-clamp-2 transition-opacity ${
                          activeIndex === index ? "opacity-100" : "opacity-70"
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* View all button */}
            <div className="pt-4">
              <Link
                to="/dich-vu"
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                {t.services.learnMore}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
