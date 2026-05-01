import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();

  const testimonials = t.testimonials.items;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="py-20 md:py-28 lg:py-36 bg-muted/40 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-border to-transparent" />
      
      <div className="container-wide relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="label-elegant text-accent mb-5 block">{t.testimonials.badge}</span>
          <h2 className="heading-section text-foreground mb-6">
            {t.testimonials.title}
            <span className="block text-primary italic font-normal">{t.testimonials.subtitle}</span>
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto" />
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-elevated p-8 md:p-12 lg:p-16 relative border border-border/50">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 lg:top-14 lg:right-14">
              <Quote className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-accent/15" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {/* Stars */}
                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 md:w-6 md:h-6 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif text-foreground leading-relaxed mb-10">
                  "{testimonials[activeIndex].content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif text-xl md:text-2xl">
                    {testimonials[activeIndex].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-base md:text-lg">
                      {testimonials[activeIndex].name}
                    </div>
                    <div className="text-muted-foreground text-sm md:text-base">
                      {testimonials[activeIndex].role} • {testimonials[activeIndex].location}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    index === activeIndex
                      ? "w-10 bg-accent"
                      : "w-2.5 bg-border hover:bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-muted-foreground/30 transition-all"
              >
                <ChevronLeft size={22} className="text-muted-foreground" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-muted-foreground/30 transition-all"
              >
                <ChevronRight size={22} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
