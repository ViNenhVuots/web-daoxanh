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
import { ArrowLeft, Loader2, Save, Eye, Plus, X } from 'lucide-react';
import { z } from 'zod';
import ImageUploader from '@/components/admin/ImageUploader';
import { Badge } from '@/components/ui/badge';

const accommodationSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(200),
  slug: z.string().min(1, 'Slug không được để trống').max(200),
  subtitle: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  long_description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  capacity: z.string().max(100).optional(),
  price_original: z.number().min(0).optional(),
  price_discounted: z.number().min(0).optional(),
  unit: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  rating: z.number().min(0).max(5).optional(),
  amenities: z.array(z.string()),
  highlights: z.array(z.string()),
  published: z.boolean(),
  display_order: z.number().min(0),
});

type AccommodationFormData = z.infer<typeof accommodationSchema>;

export default function AccommodationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<AccommodationFormData>({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    long_description: '',
    image_url: '',
    capacity: '',
    price_original: 0,
    price_discounted: 0,
    unit: 'đêm',
    location: 'Đảo Xanh Ecofarm',
    rating: 4.5,
    amenities: [],
    highlights: [],
    published: false,
    display_order: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAmenity, setNewAmenity] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  // Fetch existing accommodation if editing
  const { data: existingData, isLoading: loadingData } = useQuery({
    queryKey: ['admin-accommodation', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingData) {
      setFormData({
        name: existingData.name || '',
        slug: existingData.slug || '',
        subtitle: existingData.subtitle || '',
        description: existingData.description || '',
        long_description: existingData.long_description || '',
        image_url: existingData.image_url || '',
        capacity: existingData.capacity || '',
        price_original: existingData.price_original || 0,
        price_discounted: existingData.price_discounted || 0,
        unit: existingData.unit || 'đêm',
        location: existingData.location || 'Đảo Xanh Ecofarm',
        rating: existingData.rating || 4.5,
        amenities: (existingData.amenities as string[]) || [],
        highlights: (existingData.highlights as string[]) || [],
        published: existingData.published || false,
        display_order: existingData.display_order || 0,
      });
    }
  }, [existingData]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async (data: AccommodationFormData) => {
      const payload = {
        name: data.name,
        slug: data.slug,
        subtitle: data.subtitle || null,
        description: data.description || null,
        long_description: data.long_description || null,
        image_url: data.image_url || null,
        capacity: data.capacity || null,
        price_original: data.price_original,
        price_discounted: data.price_discounted,
        unit: data.unit || null,
        location: data.location || null,
        rating: data.rating,
        amenities: data.amenities,
        highlights: data.highlights,
        published: data.published,
        display_order: data.display_order,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('accommodations')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('accommodations')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
      toast({
        title: isEditing ? 'Đã cập nhật' : 'Đã tạo',
        description: isEditing 
          ? 'Loại lưu trú đã được cập nhật.'
          : 'Loại lưu trú mới đã được tạo.',
      });
      navigate('/admin/accommodations');
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message?.includes('duplicate key') 
          ? 'Slug này đã tồn tại.'
          : 'Không thể lưu. Vui lòng thử lại.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      accommodationSchema.parse(formData);
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

  if (loadingData) {
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
              onClick={() => navigate('/admin/accommodations')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Chỉnh sửa lưu trú' : 'Thêm loại lưu trú'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isEditing ? 'Cập nhật thông tin' : 'Tạo loại lưu trú mới'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {formData.published && formData.slug && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`/luu-tru/${formData.slug}`, '_blank')}
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
                  Lưu
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
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="VD: Nhà An Hòa"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="nha-an-hoa"
                    />
                    {errors.slug && (
                      <p className="text-sm text-destructive">{errors.slug}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Phụ đề</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="VD: Không gian yên bình giữa thiên nhiên"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả ngắn</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả ngắn gọn về loại lưu trú"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long_description">Mô tả chi tiết</Label>
                  <Textarea
                    id="long_description"
                    value={formData.long_description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, long_description: e.target.value }))}
                    placeholder="Mô tả đầy đủ về loại lưu trú, tiện nghi, trải nghiệm..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiện nghi</CardTitle>
                <CardDescription>Các tiện nghi có sẵn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="VD: Wifi, Điều hòa, Bếp..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" variant="secondary" onClick={addAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Điểm nổi bật</CardTitle>
                <CardDescription>Những điểm đặc biệt của loại lưu trú</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="VD: View đẹp, Gần sông, Yên tĩnh..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  />
                  <Button type="button" variant="secondary" onClick={addHighlight}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {highlight}
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
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
                  <Label htmlFor="published">Hiển thị</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => 
                      setFormData((prev) => ({ ...prev, published: checked }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      display_order: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                  folder="accommodations"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giá & Sức chứa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Sức chứa</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                    placeholder="VD: 2-4 người"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_original">Giá gốc (VNĐ)</Label>
                  <Input
                    id="price_original"
                    type="number"
                    min="0"
                    value={formData.price_original}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      price_original: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_discounted">Giá khuyến mãi (VNĐ)</Label>
                  <Input
                    id="price_discounted"
                    type="number"
                    min="0"
                    value={formData.price_discounted}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      price_discounted: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Đơn vị</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                    placeholder="VD: đêm, giờ"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin khác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Vị trí</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Đánh giá (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData((prev) => ({ 
                      ...prev, 
                      rating: parseFloat(e.target.value) || 0 
                    }))}
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
