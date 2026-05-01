import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, ArrowLeft, User, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import heroImage from "@/assets/hero-resort.jpg";
import farmImage from "@/assets/services/nong-trai.jpg";
import activitiesImage from "@/assets/services/ngoai-troi.jpg";
import cuisineImage from "@/assets/services/am-thuc.jpg";

// Static fallback data
const staticBlogPostsData: Record<string, {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
  read_time: string;
  author: string;
  content: string;
}> = {
  "5-ly-do-nen-chon-du-lich-sinh-thai": {
    id: "1",
    slug: "5-ly-do-nen-chon-du-lich-sinh-thai",
    title: "5 lý do nên chọn du lịch sinh thái cho kỳ nghỉ sắp tới",
    excerpt: "Khám phá những lợi ích tuyệt vời của du lịch sinh thái - từ sức khỏe tinh thần đến việc bảo vệ môi trường.",
    image_url: heroImage,
    category: "Du lịch sinh thái",
    created_at: "2024-01-15",
    read_time: "5 phút đọc",
    author: "Đảo Xanh Ecofarm",
    content: `Du lịch sinh thái đang trở thành xu hướng được nhiều người lựa chọn, không chỉ bởi vẻ đẹp thiên nhiên mà còn vì những giá trị bền vững mà nó mang lại. Tại Đảo Xanh Ecofarm, chúng tôi tin rằng mỗi chuyến đi đều có thể tạo ra sự khác biệt tích cực.

**1. Tái tạo năng lượng và sức khỏe tinh thần**

Sống giữa thiên nhiên trong lành, xa rời những ồn ào của phố thị giúp bạn thư giãn hoàn toàn. Tiếng chim hót, gió mát từ rừng cây, và không khí trong lành của Tây Nguyên sẽ giúp bạn tái tạo năng lượng một cách tự nhiên nhất.

**2. Kết nối với thiên nhiên**

Du lịch sinh thái mang đến cơ hội để bạn hiểu hơn về môi trường sống xung quanh. Tại Đảo Xanh, bạn có thể tham gia các hoạt động như trồng cây, chăm sóc vườn hữu cơ, hay đơn giản là đi dạo trong rừng thông để cảm nhận sự kỳ diệu của tự nhiên.

**3. Trải nghiệm văn hóa địa phương authentic**

Khác với du lịch đại trà, du lịch sinh thái cho phép bạn hòa mình vào cuộc sống của người dân địa phương.

**4. Góp phần bảo vệ môi trường**

Mỗi khi chọn du lịch sinh thái, bạn đang trực tiếp đóng góp cho việc bảo tồn thiên nhiên.

**5. Tạo kỷ niệm đáng nhớ cho gia đình**

Du lịch sinh thái là lựa chọn tuyệt vời cho các gia đình có trẻ nhỏ.

Hãy để kỳ nghỉ tiếp theo của bạn không chỉ là một chuyến đi, mà còn là một hành trình ý nghĩa!`
  },
  "trai-nghiem-nong-trai-huu-co": {
    id: "2",
    slug: "trai-nghiem-nong-trai-huu-co",
    title: "Trải nghiệm nông trại hữu cơ: Từ vườn đến bàn ăn",
    excerpt: "Tìm hiểu quy trình canh tác hữu cơ và cách chúng tôi mang đến những bữa ăn tươi ngon nhất.",
    image_url: farmImage,
    category: "Nông trại",
    created_at: "2024-01-10",
    read_time: "4 phút đọc",
    author: "Đảo Xanh Ecofarm",
    content: `Tại Đảo Xanh Ecofarm, chúng tôi tự hào mang đến trải nghiệm 'từ vườn đến bàn ăn' độc đáo.

**Quy trình canh tác hữu cơ**

Nông trại của chúng tôi tuân thủ nghiêm ngặt các nguyên tắc canh tác hữu cơ.

**Đa dạng cây trồng**

Vườn rau hữu cơ của Đảo Xanh có hơn 30 loại rau củ quả theo mùa.

**Trải nghiệm thu hoạch**

Khách đến Đảo Xanh có thể trực tiếp tham gia vào quá trình thu hoạch.

Hãy đến Đảo Xanh Ecofarm để trải nghiệm một ngày làm nông dân thực thụ!`
  },
  "top-10-hoat-dong-ngoai-troi": {
    id: "3",
    slug: "top-10-hoat-dong-ngoai-troi",
    title: "Top 10 hoạt động ngoài trời không thể bỏ lỡ tại Đảo Xanh",
    excerpt: "Danh sách các hoạt động thú vị nhất để tận hưởng thiên nhiên Tây Nguyên.",
    image_url: activitiesImage,
    category: "Hoạt động",
    created_at: "2024-01-05",
    read_time: "6 phút đọc",
    author: "Đảo Xanh Ecofarm",
    content: `Đảo Xanh Ecofarm nằm giữa thiên nhiên hùng vĩ của Tây Nguyên, mang đến vô vàn hoạt động ngoài trời thú vị.

**1. Đạp xe khám phá cà phê**

Đạp xe xuyên qua những rẫy cà phê bạt ngàn.

**2. Đi bộ trong rừng thông**

Con đường mòn xuyên rừng thông mang đến không khí trong lành.

**3. Câu cá thư giãn**

Hồ nước trong khuôn viên Đảo Xanh là nơi lý tưởng để thả câu.

Mỗi hoạt động tại Đảo Xanh đều được thiết kế để bạn kết nối sâu hơn với thiên nhiên!`
  },
  "song-xanh-thoi-quen-nho-tac-dong-lon": {
    id: "4",
    slug: "song-xanh-thoi-quen-nho-tac-dong-lon",
    title: "Sống xanh: Những thói quen nhỏ, tác động lớn",
    excerpt: "Bắt đầu lối sống bền vững với những thay đổi đơn giản trong cuộc sống hàng ngày.",
    image_url: cuisineImage,
    category: "Lối sống xanh",
    created_at: "2023-12-28",
    read_time: "5 phút đọc",
    author: "Đảo Xanh Ecofarm",
    content: `Sống xanh không nhất thiết phải là những thay đổi lớn lao.

**Giảm thiểu rác thải nhựa**

Bắt đầu từ những điều đơn giản nhất: mang theo bình nước cá nhân.

**Tiết kiệm năng lượng**

Tắt đèn và các thiết bị điện khi không sử dụng.

Hãy bắt đầu từ hôm nay với một thói quen nhỏ!`
  }
};

// Map old ID-based URLs to slug
const idToSlugMap: Record<string, string> = {
  "1": "5-ly-do-nen-chon-du-lich-sinh-thai",
  "2": "trai-nghiem-nong-trai-huu-co",
  "3": "top-10-hoat-dong-ngoai-troi",
  "4": "song-xanh-thoi-quen-nho-tac-dong-lon"
};

const BlogPost = () => {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  
  // Support old ID-based URLs
  const slug = rawSlug && idToSlugMap[rawSlug] ? idToSlugMap[rawSlug] : rawSlug;
  
  const { data: dbPost, isLoading } = useBlogPost(slug);
  const { data: allPosts } = useBlogPosts();
  
  // Use database post if available, otherwise fallback to static
  const post = dbPost || (slug ? staticBlogPostsData[slug] : null);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d 'Tháng' M, yyyy", { locale: vi });
    } catch {
      return dateStr;
    }
  };

  const getImageUrl = (imageUrl: string | null | undefined, category?: string | null) => {
    if (imageUrl?.startsWith('http')) return imageUrl;
    if (imageUrl?.startsWith('/')) return imageUrl;
    // Import-based images (from static data)
    if (imageUrl) return imageUrl;
    // Fallback by category
    if (category?.includes('sinh thái')) return heroImage;
    if (category?.includes('Nông trại')) return farmImage;
    if (category?.includes('Hoạt động')) return activitiesImage;
    return cuisineImage;
  };

  // Get related posts
  const relatedPosts = allPosts 
    ? allPosts.filter(p => p.slug !== slug).slice(0, 3)
    : Object.values(staticBlogPostsData).filter(p => p.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container-wide text-center">
            <h1 className="heading-hero text-foreground mb-6">Không tìm thấy bài viết</h1>
            <p className="body-large text-muted-foreground mb-8">
              Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button>
              <Link to="/tin-tuc">
                <ArrowLeft className="mr-2" size={18} />
                Quay lại Tin tức
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse content - handle both markdown-like format and plain text
  const renderContent = (content: string | null) => {
    if (!content) return null;
    
    return content.split('\n\n').map((paragraph, index) => {
      const lines = paragraph.split('\n');
      return (
        <div key={index} className="mb-6">
          {lines.map((line, lineIndex) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              const headingText = line.replace(/\*\*/g, '');
              return (
                <h2 key={lineIndex} className="font-serif text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
                  {headingText}
                </h2>
              );
            } else if (line.trim()) {
              return (
                <p key={lineIndex} className="text-muted-foreground leading-relaxed mb-4">
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Image */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(post.image_url, post.category)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        </section>

        {/* Article Content */}
        <section className="relative -mt-32 pb-16 md:pb-24">
          <div className="container-wide max-w-4xl">
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-card rounded-3xl shadow-elevated p-8 md:p-12 lg:p-16"
            >
              {/* Back Button */}
              <Link 
                to="/tin-tuc" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                <span>Quay lại Tin tức</span>
              </Link>

              {/* Category */}
              <div className="flex items-center gap-2 mb-6">
                <Tag size={16} className="text-accent" />
                <span className="label-elegant text-accent">{post.category}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-10 pb-10 border-b border-border">
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {post.author || 'Đảo Xanh Ecofarm'}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(post.created_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {post.read_time || '5 phút đọc'}
                </span>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {post.content || ''}
                </ReactMarkdown>
              </div>

              {/* CTA */}
              <div className="mt-12 pt-10 border-t border-border text-center">
                <p className="text-muted-foreground mb-6">
                  Bạn muốn trải nghiệm những điều tuyệt vời này?
                </p>
                <Button>
                  <Link to="/dat-phong">
                    Đặt phòng ngay
                  </Link>
                </Button>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container-wide">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">
                Bài viết liên quan
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/tin-tuc/${relatedPost.slug}`}
                    className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={getImageUrl(relatedPost.image_url, relatedPost.category)}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-accent uppercase tracking-wide">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-serif text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
