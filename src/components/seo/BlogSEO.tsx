import { Helmet } from "react-helmet-async";

interface BlogSEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  posts?: Array<{
    title: string;
    slug: string;
    excerpt: string | null;
    image: string;
    created_at: string;
    author?: string | null;
  }>;
}

export const BlogSEO = ({
  title = "Tin tức & Cảm hứng | Đảo Xanh Ecofarm",
  description = "Khám phá những bài viết về du lịch sinh thái, lối sống xanh và các hoạt động tại Đảo Xanh Ecofarm - Khu nghỉ dưỡng sinh thái hàng đầu Tây Nguyên.",
  image = "/og-blog.jpg",
  url = "https://daoxanh-ecoo.lovable.app/tin-tuc",
  type = "website",
  publishedTime,
  author = "Đảo Xanh Ecofarm",
  posts = [],
}: BlogSEOProps) => {
  // Generate Blog structured data
  const blogListingSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Đảo Xanh Ecofarm Blog",
    description: description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: "Đảo Xanh Ecofarm",
      logo: {
        "@type": "ImageObject",
        url: "https://daoxanh-ecoo.lovable.app/logo-dao-xanh.png",
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || "",
      image: post.image,
      datePublished: post.created_at,
      author: {
        "@type": "Person",
        name: post.author || author,
      },
      url: `https://daoxanh-ecoo.lovable.app/tin-tuc/${post.slug}`,
    })),
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://daoxanh-ecoo.lovable.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tin tức",
        item: url,
      },
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Đảo Xanh Ecofarm" />
      <meta property="og:locale" content="vi_VN" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(blogListingSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};
