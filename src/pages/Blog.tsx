import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useBlogPosts, BlogPost as BlogPostType } from "@/hooks/useBlogPosts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { BlogSEO } from "@/components/seo/BlogSEO";

import heroImage from "@/assets/hero-resort.jpg";
import farmImage from "@/assets/services/nong-trai.jpg";
import activitiesImage from "@/assets/services/ngoai-troi.jpg";
import cuisineImage from "@/assets/services/am-thuc.jpg";

// Image mapping by slug for consistent fallbacks
const BLOG_IMAGE_MAP: Record<string, string> = {
  "5-ly-do-nen-chon-du-lich-sinh-thai": heroImage,
  "trai-nghiem-nong-trai-huu-co": farmImage,
  "top-10-hoat-dong-ngoai-troi": activitiesImage,
  "song-xanh-thoi-quen-nho-tac-dong-lon": cuisineImage,
};

// Fallback static data
const staticBlogPosts = [
  {
    id: "1",
    slug: "5-ly-do-nen-chon-du-lich-sinh-thai",
    title: "5 lý do nên chọn du lịch sinh thái cho kỳ nghỉ sắp tới",
    excerpt: "Khám phá những lợi ích tuyệt vời của du lịch sinh thái - từ sức khỏe tinh thần đến việc bảo vệ môi trường.",
    image_url: heroImage,
    category: "Du lịch sinh thái",
    created_at: "2024-01-15",
    read_time: "5 phút đọc",
    is_featured: true,
  },
  {
    id: "2",
    slug: "trai-nghiem-nong-trai-huu-co",
    title: "Trải nghiệm nông trại hữu cơ: Từ vườn đến bàn ăn",
    excerpt: "Tìm hiểu quy trình canh tác hữu cơ và cách chúng tôi mang đến những bữa ăn tươi ngon nhất.",
    image_url: farmImage,
    category: "Nông trại",
    created_at: "2024-01-10",
    read_time: "4 phút đọc",
    is_featured: false,
  },
  {
    id: "3",
    slug: "top-10-hoat-dong-ngoai-troi",
    title: "Top 10 hoạt động ngoài trời không thể bỏ lỡ tại Đảo Xanh",
    excerpt: "Danh sách các hoạt động thú vị nhất để tận hưởng thiên nhiên Tây Nguyên.",
    image_url: activitiesImage,
    category: "Hoạt động",
    created_at: "2024-01-05",
    read_time: "6 phút đọc",
    is_featured: false,
  },
  {
    id: "4",
    slug: "song-xanh-thoi-quen-nho-tac-dong-lon",
    title: "Sống xanh: Những thói quen nhỏ, tác động lớn",
    excerpt: "Bắt đầu lối sống bền vững với những thay đổi đơn giản trong cuộc sống hàng ngày.",
    image_url: cuisineImage,
    category: "Lối sống xanh",
    created_at: "2023-12-28",
    read_time: "5 phút đọc",
    is_featured: false,
  },
];

const Blog = () => {
  const { data: dbPosts, isLoading } = useBlogPosts();
  
  // Use database posts if available, otherwise fallback to static
  const blogPosts = dbPosts && dbPosts.length > 0 ? dbPosts : staticBlogPosts;
  
  const featuredPost = blogPosts.find((post) => post.is_featured);
  const regularPosts = blogPosts.filter((post) => !post.is_featured);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d 'Tháng' M, yyyy", { locale: vi });
    } catch {
      return dateStr;
    }
  };

  // Improved image URL resolver with slug-based mapping
  const getImageUrl = (post: typeof blogPosts[0]): string => {
    // 1. Check for valid external URL
    if (post.image_url?.startsWith('http')) return post.image_url;
    // 2. Check for valid local path
    if (post.image_url?.startsWith('/')) return post.image_url;
    // 3. Use slug-based mapping for consistency
    if (post.slug && BLOG_IMAGE_MAP[post.slug]) return BLOG_IMAGE_MAP[post.slug];
    // 4. Category-based fallback (case-insensitive)
    const category = post.category?.toLowerCase() || '';
    if (category.includes('sinh thái') || category.includes('du lịch')) return heroImage;
    if (category.includes('nông trại') || category.includes('hữu cơ')) return farmImage;
    if (category.includes('hoạt động') || category.includes('ngoài trời')) return activitiesImage;
    // 5. Default fallback
    return cuisineImage;
  };

  // Prepare SEO data
  const seoPostsData = useMemo(() => 
    blogPosts.map(post => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      image: getImageUrl(post),
      created_at: post.created_at,
      author: 'author' in post ? (post as any).author : 'Đảo Xanh Ecofarm',
    })), [blogPosts]
  );

  const featuredImage = featuredPost ? getImageUrl(featuredPost) : heroImage;

  return (
    <>
      <BlogSEO 
        posts={seoPostsData}
        image={featuredImage}
      />
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
              <span className="label-elegant text-accent mb-5 block">Blog</span>
              <h1 className="heading-hero text-foreground mb-8">
                Tin tức & <span className="italic text-primary">Cảm hứng</span>
              </h1>
              <div className="w-16 h-0.5 bg-accent mx-auto mb-8" />
              <p className="body-large text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Khám phá những bài viết về du lịch sinh thái, lối sống xanh 
                và các hoạt động tại Đảo Xanh Ecofarm.
              </p>
            </motion.div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="py-12 md:py-16">
                <div className="container-wide">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Link to={`/tin-tuc/${featuredPost.slug}`} className="group block">
                      <div className="grid lg:grid-cols-2 gap-0 items-stretch bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500">
                        <div className="relative h-72 lg:h-auto min-h-[400px] overflow-hidden">
                          <img
                            src={getImageUrl(featuredPost)}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-6 left-6">
                            <span className="px-5 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-medium shadow-soft">
                              Nổi bật
                            </span>
                          </div>
                        </div>
                        <div className="p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                          <span className="label-elegant text-accent mb-5 block">
                            {featuredPost.category}
                          </span>
                          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl font-semibold text-foreground mb-5 group-hover:text-primary transition-colors leading-tight">
                            {featuredPost.title}
                          </h2>
                          <p className="body-regular text-muted-foreground mb-8 leading-relaxed">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                            <span className="flex items-center gap-2">
                              <Calendar size={16} />
                              {formatDate(featuredPost.created_at)}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock size={16} />
                              {featuredPost.read_time || '5 phút đọc'}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                            Đọc tiếp
                            <ArrowRight size={18} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </section>
            )}

            {/* Blog Grid */}
            <section className="py-16 md:py-20 lg:py-24">
              <div className="container-wide">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.8 }}
                  className="mb-12 lg:mb-16"
                >
                  <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground">Bài viết mới nhất</h2>
                  <div className="w-12 h-0.5 bg-accent mt-4" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                  {regularPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                    >
                      <Link to={`/tin-tuc/${post.slug}`} className="group block h-full">
                        <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 h-full flex flex-col border border-border/50 hover:border-accent/30">
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={getImageUrl(post)}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="p-6 lg:p-8 flex-1 flex flex-col">
                            <span className="text-xs text-accent uppercase tracking-wider mb-3">
                              {post.category}
                            </span>
                            <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {formatDate(post.created_at)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {post.read_time || '5 phút đọc'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
      </div>
    </>
  );
};

export default Blog;
