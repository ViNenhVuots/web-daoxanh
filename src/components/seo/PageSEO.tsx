import { Helmet } from "react-helmet-async";

interface PageSEOProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: "website" | "article" | "product";
  keywords?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  structuredData?: object;
}

const BASE_URL = "https://daoxanh.com.vn";
const DEFAULT_IMAGE = "/og-default.jpg";
const SITE_NAME = "Đảo Xanh Ecofarm";

export const PageSEO = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  keywords,
  breadcrumbs = [],
  structuredData,
}: PageSEOProps) => {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  // Breadcrumb schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* Custom Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Organization schema for homepage
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/logo-dao-xanh.png`,
  description: "Khu nghỉ dưỡng sinh thái hàng đầu Tây Nguyên, mang đến trải nghiệm du lịch xanh độc đáo.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buôn Ma Thuột",
    addressRegion: "Đắk Lắk",
    addressCountry: "VN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+84-96-189-89-72",
    contactType: "customer service",
    availableLanguage: ["Vietnamese", "English"],
  },
  sameAs: [
    "https://facebook.com/daoxanhecofarm",
  ],
});

// LocalBusiness schema for about/services pages
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: SITE_NAME,
  url: BASE_URL,
  image: `${BASE_URL}/og-default.jpg`,
  description: "Đảo Xanh Ecofarm - Khu nghỉ dưỡng sinh thái tại Đắk Lắk với các hoạt động nông trại, lưu trú độc đáo và ẩm thực địa phương.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Xã Ea Tu",
    addressLocality: "Buôn Ma Thuột",
    addressRegion: "Đắk Lắk",
    postalCode: "630000",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.6667,
    longitude: 108.0500,
  },
  telephone: "+84-96-189-89-72",
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "07:00",
    closes: "22:00",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Nông trại hữu cơ", value: true },
    { "@type": "LocationFeatureSpecification", name: "Lưu trú sinh thái", value: true },
    { "@type": "LocationFeatureSpecification", name: "Ẩm thực địa phương", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hoạt động ngoài trời", value: true },
  ],
});

// Services/Product schema
export const getServicesSchema = (services: Array<{ name: string; description: string; price?: string }>) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Dịch vụ tại Đảo Xanh Ecofarm",
  description: "Danh sách các dịch vụ du lịch sinh thái tại Đảo Xanh Ecofarm",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service.name,
      description: service.description,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      ...(service.price && {
        offers: {
          "@type": "Offer",
          price: service.price,
          priceCurrency: "VND",
        },
      }),
    },
  })),
});
