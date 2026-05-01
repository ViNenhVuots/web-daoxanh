import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Home, Package, Plus, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Dashboard() {
  const { data: blogCount, isLoading: loadingBlog } = useQuery({
    queryKey: ['admin-blog-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: accommodationCount, isLoading: loadingAccommodation } = useQuery({
    queryKey: ['admin-accommodation-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('accommodations')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: packageCount, isLoading: loadingPackages } = useQuery({
    queryKey: ['admin-package-count'],
    queryFn: async () => {
      const { count: comboCount, error: comboError } = await supabase
        .from('combo_packages')
        .select('*', { count: 'exact', head: true });
      if (comboError) throw comboError;

      const { count: dayTripCount, error: dayTripError } = await supabase
        .from('day_trip_packages')
        .select('*', { count: 'exact', head: true });
      if (dayTripError) throw dayTripError;

      return (comboCount || 0) + (dayTripCount || 0);
    },
  });

  const stats = [
    {
      title: 'Bài viết',
      count: blogCount,
      loading: loadingBlog,
      icon: FileText,
      href: '/admin/blog',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Loại lưu trú',
      count: accommodationCount,
      loading: loadingAccommodation,
      icon: Home,
      href: '/admin/accommodations',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Gói dịch vụ',
      count: packageCount,
      loading: loadingPackages,
      icon: Package,
      href: '/admin/packages',
      color: 'bg-purple-500/10 text-purple-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý nội dung website Đảo Xanh Ecofarm
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stat.loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stat.count
                    )}
                  </div>
                  <Link
                    to={stat.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Xem chi tiết →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Tạo nội dung mới cho website</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <a href="/admin/blog/new" className="block">
              <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Viết bài mới
              </Button>
              </a>
            <a href="/admin/accommodations/new" className="block">
              <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm loại lưu trú
              </Button>
            </a>
            <a href="/admin/packages" className="block">
              <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Quản lý gói dịch vụ
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Bắt đầu sử dụng CMS</CardTitle>
            <CardDescription>
              Hướng dẫn quản lý nội dung website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p>
                <strong className="text-foreground">Bài viết:</strong> Tạo và quản lý các bài viết blog, 
                tin tức về Đảo Xanh Ecofarm. Hỗ trợ rich text editor và upload hình ảnh.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p>
                <strong className="text-foreground">Lưu trú:</strong> Quản lý các loại phòng, nhà nghỉ 
                với thông tin chi tiết về giá, tiện nghi và hình ảnh.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p>
                <strong className="text-foreground">Gói dịch vụ:</strong> Thiết lập các combo nghỉ dưỡng 
                và tour trong ngày với giá và các dịch vụ đi kèm.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
