import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, GripVertical, Save, Pencil } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { useGalleryImages, GalleryImage } from '@/hooks/useGallery';

const categories = ["Cảnh quan", "Lưu trú", "Dịch vụ", "Hoạt động", "Ẩm thực", "Nông trại"];

export default function GalleryManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: images, isLoading } = useGalleryImages();

  const [formData, setFormData] = useState({
    src: '',
    alt: '',
    category: 'Cảnh quan',
    display_order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('gallery_images')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      setFormData({ src: '', alt: '', category: 'Cảnh quan', display_order: 0 });
      toast({ title: 'Đã thêm ảnh', description: 'Hình ảnh đã được thêm vào thư viện.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', title: 'Lỗi', description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({
          src: data.src,
          alt: data.alt,
          category: data.category,
          display_order: data.display_order
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      setFormData({ src: '', alt: '', category: 'Cảnh quan', display_order: 0 });
      setEditingId(null);
      toast({ title: 'Đã cập nhật', description: 'Thông tin hình ảnh đã được cập nhật thành công.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', title: 'Lỗi', description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast({ title: 'Đã xóa', description: 'Hình ảnh đã được xóa khỏi thư viện.' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src) {
      toast({ variant: 'destructive', title: 'Thiếu thông tin', description: 'Vui lòng upload hoặc nhập URL ảnh.' });
      return;
    }
    
    if (editingId) {
      updateMutation.mutate({ ...formData, id: editingId });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setFormData({
      src: image.src,
      alt: image.alt || '',
      category: image.category,
      display_order: image.display_order || 0,
    });
    // Cuộn lên form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ src: '', alt: '', category: 'Cảnh quan', display_order: 0 });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thư viện ảnh</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý hình ảnh hiển thị trong trang Thư viện ảnh của website
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Add New Image Form */}
          <Card className="lg:col-span-1 h-fit sticky top-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Chỉnh sửa ảnh' : 'Thêm ảnh mới'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Hình ảnh</Label>
                  <ImageUploader
                    value={formData.src}
                    onChange={(url) => setFormData(prev => ({ ...prev, src: url }))}
                    folder="gallery"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt">Mô tả ảnh</Label>
                  <Input
                    id="alt"
                    value={formData.alt}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Ví dụ: Kayaking trên sông"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={addMutation.isPending || updateMutation.isPending}>
                    {addMutation.isPending || updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : editingId ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {editingId ? 'Cập nhật' : 'Thêm vào thư viện'}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Hủy
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Image List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách hình ảnh ({images?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : images && images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="group relative border rounded-xl overflow-hidden bg-card">
                        <div className="aspect-video relative">
                          <img
                            src={image.src}
                            alt={image.alt || ''}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-white/80 hover:bg-white text-black"
                              onClick={() => handleEdit(image)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteMutation.mutate(image.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-1 bg-black/60 text-white text-[10px] rounded backdrop-blur-sm">
                              {image.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate">{image.alt || 'Không có mô tả'}</p>
                          <p className="text-xs text-muted-foreground">Thứ tự: {image.display_order}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">Chưa có hình ảnh nào trong thư viện.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
