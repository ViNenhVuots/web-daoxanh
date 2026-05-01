import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Leaf, Mountain, Heart, Sun } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const features = [
    {
      icon: Leaf,
      value: t.experience.stats.organic.value,
      label: t.experience.stats.organic.label,
      description: t.experience.stats.organic.description,
    },
    {
      icon: Mountain,
      value: t.experience.stats.area.value,
      label: t.experience.stats.area.label,
      description: t.experience.stats.area.description,
    },
    {
      icon: Heart,
      value: t.experience.stats.guests.value,
      label: t.experience.stats.guests.label,
      description: t.experience.stats.guests.description,
    },
    {
      icon: Sun,
      value: t.experience.stats.days.value,
      label: t.experience.stats.days.label,
      description: t.experience.stats.days.description,
    },
  ];

  return (
    <section ref={ref} className="relative py-20 md:py-28 lg:py-36 bg-primary overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="label-elegant text-accent mb-5 block">{t.experience.badge}</span>
          <h2 className="heading-section text-primary-foreground mb-6">
            {t.experience.title}
            <span className="block font-normal italic opacity-80">{t.experience.subtitle}</span>
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-16 lg:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 h-full border border-white/10 hover:bg-white/15 transition-all duration-500 group">
                {/* Icon */}
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                  <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-accent" />
                </div>

                {/* Value */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-white mb-2">
                  {feature.value}
                </div>

                {/* Label */}
                <div className="text-accent font-medium uppercase tracking-wider text-xs lg:text-sm mb-2">
                  {feature.label}
                </div>
                <p className="text-white/60 text-sm hidden md:block">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center border-t border-white/10 pt-14 lg:pt-16"
        >
          <div className="w-16 h-0.5 bg-accent/60 mx-auto mb-10" />
          <blockquote className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif text-white/90 max-w-xl mx-auto leading-relaxed italic px-4">
            "{t.experience.quote}{" "}
            <span className="text-accent not-italic font-semibold">{t.experience.quoteHighlight}</span>"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
