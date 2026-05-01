import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Leaf, Users, Globe, Heart } from "lucide-react";
import { PageSEO, getLocalBusinessSchema } from "@/components/seo/PageSEO";
import heroImage from "@/assets/hero-resort.jpg";
import farmImage from "@/assets/ve-chung-toi.jpeg";
import founderKhanhMinh from "@/assets/founder-khanh-minh.webp";
import founderHongHanh from "@/assets/founder-hong-hanh.webp";

const founders = [
  {
    name: "Khánh Minh",
    role: "Đồng sáng lập",
    image: founderKhanhMinh,
  },
  {
    name: "Hồng Hạnh",
    role: "Đồng sáng lập",
    image: founderHongHanh,
  },
];

const values = [
  {
    icon: Leaf,
    title: "Bền vững",
    description: "Cam kết bảo vệ môi trường và phát triển du lịch xanh, tôn trọng hệ sinh thái địa phương.",
  },
  {
    icon: Users,
    title: "Cộng đồng",
    description: "Hỗ trợ và phát triển cùng cộng đồng địa phương, tạo sinh kế bền vững cho người dân.",
  },
  {
    icon: Globe,
    title: "Đẳng cấp",
    description: "Mang tiêu chuẩn quốc tế vào dịch vụ, kết hợp hài hòa với bản sắc văn hóa Việt Nam.",
  },
  {
    icon: Heart,
    title: "Tận tâm",
    description: "Mỗi dịch vụ đều được chăm chút tỉ mỉ, mang đến trải nghiệm đáng nhớ cho khách hàng.",
  },
];

const About = () => {
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const foundersRef = useRef(null);
  const isStoryInView = useInView(storyRef, { once: true, margin: "-100px" });
  const isValuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const isFoundersInView = useInView(foundersRef, { once: true, margin: "-100px" });

  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <>
      <PageSEO
        title="Giới thiệu về Đảo Xanh Ecofarm"
        description="Đảo Xanh Ecofarm - Một hòn đảo biệt lập yên bình với hệ sinh thái trong lành, xanh mát. Khám phá câu chuyện và giá trị cốt lõi của chúng tôi."
        url="/gioi-thieu"
        keywords="giới thiệu đảo xanh, ecofarm đắk lắk, du lịch sinh thái tây nguyên, khu nghỉ dưỡng xanh"
        structuredData={localBusinessSchema}
        breadcrumbs={[
          { name: "Trang chủ", url: "/" },
          { name: "Giới thiệu", url: "/gioi-thieu" },
        ]}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
        {/* Hero - Refined with better overlay and spacing */}
        <section className="relative h-[65vh] min-h-[550px] overflow-hidden">
          <img 
            src={heroImage} 
            alt="Đảo Xanh Ecofarm" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/30" />

          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="label-elegant text-accent mb-6 block"
              >
                Về chúng tôi
              </motion.span>
              <h1 className="heading-hero text-primary-foreground mb-6">
                Câu chuyện <span className="italic font-medium">Đảo Xanh</span>
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="w-24 h-0.5 bg-accent mx-auto"
              />
            </motion.div>
          </div>
        </section>

        {/* Story Section - Better spacing and typography */}
        <section ref={storyRef} className="py-20 md:py-28 lg:py-36">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
                className="order-2 lg:order-1"
              >
                <span className="label-elegant text-accent mb-5 block">Khởi nguồn</span>
                <h2 className="heading-section text-foreground mb-8">
                  Giấc mơ <span className="italic text-primary">xanh</span> giữa núi rừng
                </h2>
                <div className="space-y-5 text-muted-foreground body-regular leading-relaxed">
                  <p className="text-lg font-serif italic text-foreground/80">
                    Km số 0 - Nơi tình yêu bắt đầu
                  </p>
                  <p className="text-primary font-medium">Đảo Xanh… hùng vĩ.</p>
                  <p>
                    Nằm trong khu vực vùng đất trường ca của lửa và nước, Đảo Xanh Ecofarm rộng đến 14ha, chu vi 2,3km.
                    Điểm đầu tiên của Đảo là Km0 sông Sêrepok, nơi hợp lưu của 2 dòng sông vợ chồng (Sông vợ Krong Ana
                    và sông chồng Krong Nô).
                  </p>
                  <p>
                    Tinh thần sống biết ơn, hòa thuận, bảo vệ và yêu quý thiên nhiên đã thấm
                    nhuần đến từng con người, cảnh vật và kiến trúc nơi đây.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="relative order-1 lg:order-2"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                  <img 
                    src={farmImage} 
                    alt="Trải nghiệm nông trại" 
                    className="w-full h-[450px] lg:h-[550px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isStoryInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -bottom-8 -left-4 lg:-left-8 bg-primary text-primary-foreground p-6 lg:p-8 rounded-2xl shadow-elevated"
                >
                  <div className="font-serif text-4xl lg:text-5xl font-bold">2018</div>
                  <div className="text-sm lg:text-base opacity-90">Năm thành lập</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founders Section - Refined with better card design */}
        <section ref={foundersRef} className="py-20 md:py-28 bg-muted/40">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isFoundersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 lg:mb-20"
            >
              <span className="label-elegant text-accent mb-5 block">Nhà sáng lập</span>
              <h2 className="heading-section text-foreground mb-6">
                Những người <span className="italic text-primary">kiến tạo</span>
              </h2>
              <div className="w-16 h-0.5 bg-accent mx-auto" />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-8 lg:gap-16 max-w-2xl lg:max-w-3xl mx-auto">
              {founders.map((founder, index) => (
                <motion.div
                  key={founder.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isFoundersInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center group"
                >
                  <div className="relative w-52 h-72 lg:w-60 lg:h-80 mx-auto mb-8 rounded-2xl overflow-hidden shadow-elevated group-hover:shadow-2xl transition-shadow duration-500">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-2">{founder.name}</h3>
                  <p className="text-muted-foreground text-sm lg:text-base tracking-wide">{founder.role}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isFoundersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-3xl mx-auto mt-16 lg:mt-20"
            >
              <div className="relative px-8 lg:px-12">
                <span className="absolute left-0 top-0 text-6xl lg:text-7xl text-accent/30 font-serif leading-none">"</span>
                <p className="text-center text-muted-foreground body-large italic leading-relaxed pt-6">
                  Tinh thần sống biết ơn luôn được thực tập nên mỗi nhân viên, quản lý tại đây đều tận tâm, hồn hậu, 
                  dễ mến, dễ gần, đề cao tinh thần học hỏi mong muốn hoàn thiện bản thân để phục vụ du khách 
                  ngày một chuyên nghiệp hơn.
                </p>
                <span className="absolute right-0 bottom-0 text-6xl lg:text-7xl text-accent/30 font-serif leading-none">"</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values - Better card design with subtle backgrounds */}
        <section ref={valuesRef} className="py-20 md:py-28 lg:py-36">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 lg:mb-20"
            >
              <span className="label-elegant text-accent mb-5 block">Giá trị cốt lõi</span>
              <h2 className="heading-section text-foreground mb-6">
                Đến là khách <span className="italic text-primary">về thành bạn</span>
              </h2>
              <div className="w-16 h-0.5 bg-accent mx-auto" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group text-center p-8 lg:p-10 rounded-2xl bg-card border border-border/50 hover:border-accent/30 hover:shadow-elevated transition-all duration-500"
                >
                  <div className="w-18 h-18 lg:w-20 lg:h-20 rounded-full bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mx-auto mb-6 transition-colors duration-500">
                    <value.icon className="w-8 h-8 lg:w-9 lg:h-9 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement - Refined with better typography */}
        <section className="py-24 md:py-32 lg:py-40 bg-gradient-nature relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(155_35%_35%_/_0.4)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(38_70%_50%_/_0.15)_0%,_transparent_40%)]" />
          
          <div className="container-narrow text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="label-elegant text-accent mb-8 block">Sứ mệnh</span>
              <div className="w-12 h-0.5 bg-accent/60 mx-auto mb-10" />
              <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-primary-foreground leading-relaxed lg:leading-snug italic px-4">
                "Mang thiên nhiên đến gần hơn với mỗi người, tạo nên những kỳ nghỉ đáng nhớ và góp phần bảo vệ hành tinh xanh"
              </blockquote>
              <div className="w-12 h-0.5 bg-accent/60 mx-auto mt-10" />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      </div>
    </>
  );
};

export default About;
