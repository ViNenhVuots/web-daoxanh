import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Critical path - load immediately
import Index from "./pages/Index";

// Lazy load non-critical pages for better initial load
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Blog = lazy(() => import("./pages/Blog"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ComboPackageDetail = lazy(() => import("./pages/ComboPackageDetail"));
const DayTripPackageDetail = lazy(() => import("./pages/DayTripPackageDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const Directions = lazy(() => import("./pages/Directions"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages - always lazy load
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const BlogList = lazy(() => import("./pages/admin/BlogList"));
const BlogEditor = lazy(() => import("./pages/admin/BlogEditor"));
const AccommodationList = lazy(() => import("./pages/admin/AccommodationList"));
const AccommodationEditor = lazy(() => import("./pages/admin/AccommodationEditor"));
const PackageManager = lazy(() => import("./pages/admin/PackageManager"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Optimized QueryClient with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 30 * 60 * 1000, // 30 minutes - cache retention (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      retry: 1, // Only retry once on failure
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/gioi-thieu" element={<About />} />
              <Route path="/dich-vu" element={<Services />} />
              <Route path="/thu-vien" element={<Gallery />} />
              <Route path="/tin-tuc" element={<Blog />} />
              <Route path="/tin-tuc/:slug" element={<BlogPost />} />
              <Route path="/luu-tru/:slug" element={<ArticleDetail />} />
              <Route path="/combo/:slug" element={<ComboPackageDetail />} />
              <Route path="/trai-nghiem/:slug" element={<DayTripPackageDetail />} />
              <Route path="/dat-phong" element={<Booking />} />
              <Route path="/chi-duong" element={<Directions />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/blog" element={<BlogList />} />
            <Route path="/admin/blog/new" element={<BlogEditor />} />
            <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
            <Route path="/admin/accommodations" element={<AccommodationList />} />
            <Route path="/admin/accommodations/new" element={<AccommodationEditor />} />
            <Route path="/admin/accommodations/edit/:id" element={<AccommodationEditor />} />
            <Route path="/admin/packages" element={<PackageManager />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
