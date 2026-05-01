import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import ImageUploader from '@/components/admin/ImageUploader';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200),
  slug: z.string().min(1, 'Slug không được để trống').max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  category: z.string().max(100).optional(),
  author: z.string().max(100).optional(),
  read_time: z.string().max(50).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean(),
  published: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'Đảo Xanh Ecofarm',
    read_time: '5 phút đọc',
    image_url: '',
    is_featured: false,
    published: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('editor');

  // Fetch existing post if editing
  const { data: existingPost, isLoading: loadingPost } = useQuery({
    queryKey: ['admin-blog-post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title || '',
        slug: existingPost.slug || '',
        excerpt: existingPost.excerpt || '',
        content: existingPost.content || '',
        category: existingPost.category || '',
        author: existingPost.author || 'Đảo Xanh Ecofarm',
        read_time: existingPost.read_time || '5 phút đọc',
        image_url: existingPost.image_url || '',
        is_featured: existingPost.is_featured || false,
        published: existingPost.published || false,
      });
    }
  }, [existingPost]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || null,
            content: data.content || null,
            category: data.category || null,
            author: data.author || null,
            read_time: data.read_time || null,
            image_url: data.image_url || null,
            is_featured: data.is_featured,
            published: data.published,
          })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || null,
            content: data.content || null,
            category: data.category || null,
            author: data.author || null,
            read_time: data.read_time || null,
            image_url: data.image_url || null,
            is_featured: data.is_featured,
            published: data.published,
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({
        title: isEditing ? 'Đã cập nhật' : 'Đã tạo bài viết',
        description: isEditing 
          ? 'Bài viết đã được cập nhật thành công.'
          : 'Bài viết mới đã được tạo.',
      });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message?.includes('duplicate key') 
          ? 'Slug này đã tồn tại. Vui lòng chọn slug khác.'
          : 'Không thể lưu bài viết. Vui lòng thử lại.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      blogPostSchema.parse(formData);
      setErrors({});
      saveMutation.mutate(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  if (loadingPost) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/blog')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isEditing ? 'Cập nhật nội dung bài viết' : 'Tạo bài viết mới cho blog'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {formData.published && formData.slug && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`/tin-tuc/${formData.slug}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Xem trước
              </Button>
            )}
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu bài viết
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nội dung chính</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Nhập tiêu đề bài viết"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-cua-bai-viet"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    URL: /tin-tuc/{formData.slug || 'slug-cua-ban'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Mô tả ngắn về bài viết (hiển thị trong danh sách)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung bài viết</Label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, content: prev.content + '\n\n**Tiêu đề**\n\nNội dung đoạn văn...' }))}
                    >
                      Thêm mẫu
                    </Button>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      variant={viewMode === 'editor' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('editor')}
                      className="text-xs"
                    >
                      Soạn thảo
                    </Button>
                    <Button
                      type="button"
                      variant={viewMode === 'preview' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('preview')}
                      className="text-xs"
                    >
                      Xem trước
                    </Button>
                    <Button
                      type="button"
                      variant={viewMode === 'split' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('split')}
                      className="text-xs"
                    >
                      Chia đôi
                    </Button>
                  </div>

                  {viewMode === 'editor' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="content" className="text-sm font-medium">Nội dung (Markdown)</Label>
                        <div className="flex gap-1">
                          {['**B**', '*I*', '# H1', '## H2', '- List', '`Code`'].map((format) => (
                            <Button
                              key={format}
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs px-2 py-1 h-auto"
                              onClick={() => setFormData((prev) => ({ 
                                ...prev, 
                                content: prev.content + (prev.content ? '\n\n' : '') + format 
                              }))}
                            >
                              {format}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                        placeholder="Viết nội dung bài viết ở đây... (hỗ trợ Markdown)"
                        rows={15}
                        className="font-mono text-sm bg-background border border-input rounded-lg p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          Hỗ trợ định dạng Markdown. Mỗi đoạn văn cách nhau bằng dòng trống.
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formData.content.length} ký tự
                        </span>
                      </div>
                    </div>
                  )}

                  {viewMode === 'preview' && (
                    <div className="border border-border rounded-lg p-4 bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-muted-foreground">Xem trước</span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={() => window.open(`/tin-tuc/${formData.slug || 'preview'}`, '_blank')}
                          >
                            Mở rộng
                          </Button>
                        </div>
                      </div>
                      <div className="prose prose-lg max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                          {formData.content || 'Nội dung sẽ hiển thị ở đây...'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {viewMode === 'split' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="content" className="text-sm font-medium">Nội dung (Markdown)</Label>
                          <div className="flex gap-1">
                            {['**B**', '*I*', '# H1', '## H2', '- List', '`Code`'].map((format) => (
                              <Button
                                key={format}
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs px-2 py-1 h-auto"
                                onClick={() => setFormData((prev) => ({ 
                                  ...prev, 
                                  content: prev.content + (prev.content ? '\n\n' : '') + format 
                                }))}
                              >
                                {format}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Viết nội dung bài viết ở đây... (hỗ trợ Markdown)"
                          rows={15}
                          className="font-mono text-sm bg-background border border-input rounded-lg p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            Hỗ trợ định dạng Markdown. Mỗi đoạn văn cách nhau bằng dòng trống.
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formData.content.length} ký tự
                          </span>
                        </div>
                      </div>
                      <div className="border border-border rounded-lg p-4 bg-muted/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">Xem trước</span>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs px-2 py-1 h-auto"
                              onClick={() => window.open(`/tin-tuc/${formData.slug || 'preview'}`, '_blank')}
                            >
                              Mở rộng
                            </Button>
                          </div>
                        </div>
                        <div className="prose prose-sm max-h-96 overflow-y-auto border border-border/50 rounded-lg p-4 bg-background">
                          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {formData.content || 'Nội dung sẽ hiển thị ở đây...'}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Xuất bản</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => 
                      setFormData((prev) => ({ ...prev, published: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Bài viết nổi bật</Label>
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => 
                      setFormData((prev) => ({ ...prev, is_featured: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ảnh bìa</CardTitle>
                <CardDescription>Ảnh hiển thị trong danh sách bài viết</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                  folder="blog"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin bổ sung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="VD: Du lịch, Ẩm thực, Trải nghiệm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read_time">Thời gian đọc</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, read_time: e.target.value }))}
                    placeholder="VD: 5 phút đọc"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
