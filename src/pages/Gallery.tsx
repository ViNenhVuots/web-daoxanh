import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import heroImage from "@/assets/hero-resort.jpg";
import accommodationImage from "@/assets/accommodation/homestay-an-yen.jpg";
import activitiesImage from "@/assets/services/ngoai-troi.jpg";
import cuisineImage from "@/assets/services/am-thuc.jpg";
import farmImage from "@/assets/services/nong-trai.jpg";

const galleryImages = [
  { src: heroImage, alt: "Toàn cảnh khu nghỉ dưỡng", category: "Cảnh quan" },
  { src: accommodationImage, alt: "Phòng nghỉ sang trọng", category: "Lưu trú" },
  { src: activitiesImage, alt: "Kayaking trên hồ", category: "Hoạt động" },
  { src: cuisineImage, alt: "Ẩm thực địa phương", category: "Ẩm thực" },
  { src: farmImage, alt: "Trải nghiệm nông trại", category: "Nông trại" },
  { src: heroImage, alt: "Hoàng hôn tại resort", category: "Cảnh quan" },
  { src: accommodationImage, alt: "View từ phòng nghỉ", category: "Lưu trú" },
  { src: activitiesImage, alt: "Team building", category: "Hoạt động" },
];

const categories = ["Tất cả", "Cảnh quan", "Lưu trú", "Hoạt động", "Ẩm thực", "Nông trại"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === "Tất cả"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
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
              <span className="label-elegant text-accent mb-5 block">Khoảnh khắc</span>
              <h1 className="heading-hero text-foreground mb-8">
                Thư viện <span className="italic text-primary">ảnh</span>
              </h1>
              <div className="w-16 h-0.5 bg-accent mx-auto mb-8" />
              <p className="body-large text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Khám phá vẻ đẹp Đảo Xanh Ecofarm qua những hình ảnh sống động.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border/50">
          <div className="container-wide">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container-wide">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={`${image.alt}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-shadow duration-500">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-xs text-accent uppercase tracking-wider block mb-1">{image.category}</span>
                        <h3 className="text-primary-foreground font-serif text-lg font-medium">{image.alt}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-6 w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-6 w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              >
                <ChevronRight size={28} />
              </button>

              {/* Image */}
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Caption */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
                <span className="text-xs text-accent uppercase tracking-wider block mb-2">
                  {filteredImages[selectedImage].category}
                </span>
                <h3 className="text-primary-foreground text-xl font-serif font-medium mb-2">
                  {filteredImages[selectedImage].alt}
                </h3>
                <span className="text-primary-foreground/60 text-sm">
                  {selectedImage + 1} / {filteredImages.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
