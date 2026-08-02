import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, Save, Pencil, Pin, PinOff } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { useGalleryImages, GalleryImage } from '@/hooks/useGallery';
import { Switch } from '@/components/ui/switch';

const categories = [
  "Lều Độc Cư", 
  "Bungalow An Bình", 
  "Nhà Thảnh Thơi 1", 
  "Nhà Thảnh Thơi 2-3", 
  "Nhà Thảnh Thơi 4-5", 
  "Lều Sê Rê Pốk"
];

export default function GalleryManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: images, isLoading } = useGalleryImages();

  const [formData, setFormData] = useState({
    src: '',
    alt: '',
    category: 'Lều Độc Cư',
    display_order: 0,
    is_pinned: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Tự động sắp xếp lại thứ tự nếu có trùng lặp hoặc khoảng trống
    if (images && images.length > 0) {
      const isPerfectlySequential = images.every((img, i) => img.display_order === i);
      if (!isPerfectlySequential) {
        const fixOrders = async () => {
          const updates = images.map((img, index) => ({
            id: img.id,
            src: img.src,
            alt: img.alt,
            category: img.category,
            created_at: img.created_at,
            display_order: index,
            is_pinned: img.is_pinned || false
          }));
          const { error } = await supabase.from('gallery_images').upsert(updates);
          if (!error) {
            queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
            toast({ title: 'Đã tự động sắp xếp', description: `Thứ tự hình ảnh đã được chuẩn hóa từ 0 đến ${images.length - 1}` });
          }
        };
        fixOrders();
      }
    }
  }, [images, queryClient, toast]);

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // 1. Thêm ảnh mới vào DB trước để lấy ID
      const { data: newImg, error: insertError } = await supabase
        .from('gallery_images')
        .insert([{ ...data }])
        .select()
        .single();
        
      if (insertError) throw insertError;

      // 2. Chèn vào danh sách hiện tại và cập nhật lại thứ tự toàn bộ từ 0 đến N
      if (images) {
        let sorted = [...images];
        const insertIndex = Math.max(0, Math.min(data.display_order, sorted.length));
        
        sorted.splice(insertIndex, 0, newImg);
        
        const updates = sorted.map((img, i) => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          category: img.category,
          created_at: img.created_at,
          display_order: i,
          is_pinned: img.is_pinned || false
        }));
        
        await supabase.from('gallery_images').upsert(updates);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      setFormData({ src: '', alt: '', category: 'Lều Độc Cư', display_order: 0, is_pinned: false });
      toast({ title: 'Đã thêm ảnh', description: 'Hình ảnh đã được thêm vào thư viện và tự động điều chỉnh thứ tự.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', title: 'Lỗi', description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      if (!images) return;

      let sorted = [...images];
      const oldIndex = sorted.findIndex(img => img.id === data.id);
      
      if (oldIndex === -1) return;
      
      const oldOrder = sorted[oldIndex].display_order;
      const newOrder = data.display_order;
      
      if (oldOrder !== newOrder) {
        // Lấy phần tử ra khỏi mảng
        const [item] = sorted.splice(oldIndex, 1);
        
        // Chèn vào vị trí mới
        const insertIndex = Math.max(0, Math.min(newOrder, sorted.length));
        sorted.splice(insertIndex, 0, { ...item, ...data, display_order: insertIndex });
        
        // Cập nhật lại thứ tự từ 0 đến N
        const updates = sorted.map((img, i) => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          category: img.category,
          created_at: img.created_at,
          display_order: i,
          is_pinned: img.is_pinned || false
        }));
        
        const { error } = await supabase.from('gallery_images').upsert(updates);
        if (error) throw error;
      } else {
        // Chỉ cập nhật thông tin nếu không đổi thứ tự
        const { error } = await supabase
          .from('gallery_images')
          .update({
            src: data.src,
            alt: data.alt,
            category: data.category,
            is_pinned: data.is_pinned
          })
          .eq('id', data.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      setFormData({ src: '', alt: '', category: 'Lều Độc Cư', display_order: 0, is_pinned: false });
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

  const togglePinMutation = useMutation({
    mutationFn: async ({ id, is_pinned }: { id: string, is_pinned: boolean }) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_pinned })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast({ title: variables.is_pinned ? 'Đã ghim ảnh' : 'Đã bỏ ghim ảnh', description: 'Trạng thái ghim đã được cập nhật.' });
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
      is_pinned: image.is_pinned || false,
    });
    // Cuộn lên form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ src: '', alt: '', category: 'Lều Độc Cư', display_order: 0, is_pinned: false });
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
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="is_pinned"
                    checked={formData.is_pinned}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_pinned: checked }))}
                  />
                  <Label htmlFor="is_pinned" className="cursor-pointer">Ghim ảnh này lên đầu</Label>
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
                              className={`h-8 w-8 ${image.is_pinned ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/80 hover:bg-white text-black'}`}
                              onClick={() => togglePinMutation.mutate({ id: image.id, is_pinned: !image.is_pinned })}
                            >
                              {image.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                            </Button>
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
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <span className="px-2 py-1 bg-black/60 text-white text-[10px] rounded backdrop-blur-sm">
                              {image.category}
                            </span>
                            {image.is_pinned && (
                              <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-medium rounded backdrop-blur-sm flex items-center gap-1">
                                <Pin className="h-3 w-3" />
                                Đã ghim
                              </span>
                            )}
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
