import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  published: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function BlogList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, category, published, is_featured, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({
        title: 'Đã xóa bài viết',
        description: 'Bài viết đã được xóa thành công.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa bài viết. Vui lòng thử lại.',
      });
      console.error('Delete error:', error);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bài viết</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý các bài viết blog và tin tức
            </p>
          </div>
          <a href="/admin/blog/new">
              <Button >
                  <Plus className="h-4 w-4 mr-2" />
                  Viết bài mới
              </Button>
            </a>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
            <CardDescription>
              Tất cả các bài viết đã tạo ({posts?.length || 0} bài)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : posts && posts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {post.title}
                          {post.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              Nổi bật
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.category && (
                          <Badge variant="outline">{post.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublishMutation.mutate({
                            id: post.id,
                            published: !post.published
                          })}
                          className="gap-2"
                        >
                          {post.published ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Đã xuất bản</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Nháp</span>
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href={`/admin/blog/edit/${post.id}`}>
                            <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                            </Button>
                            </a>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa bài viết "{post.title}"? 
                                  Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(post.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có bài viết nào</p>
                <a href="/admin/blog/new">
                  <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Viết bài đầu tiên
                  </Button>
                  </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

// Add missing import
import { FileText } from 'lucide-react';
