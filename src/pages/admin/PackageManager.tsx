import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash2, Loader2, X, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/admin/ImageUploader';

interface ComboPackage {
  id: string;
  name: string;
  subtitle: string | null;
  slug: string | null;
  price_adult: number;
  price_child: number | null;
  includes: string[];
  image_url: string | null;
  display_order: number;
  published: boolean;
}

interface DayTripPackage {
  id: string;
  name: string;
  slug: string | null;
  price_adult: number;
  price_child: number | null;
  includes: string[];
  image_url: string | null;
  display_order: number;
  published: boolean;
}

export default function PackageManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Combo packages
  const { data: comboPackages, isLoading: loadingCombo } = useQuery({
    queryKey: ['admin-combo-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combo_packages')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as ComboPackage[];
    },
  });

  // Day trip packages
  const { data: dayTripPackages, isLoading: loadingDayTrip } = useQuery({
    queryKey: ['admin-daytrip-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('day_trip_packages')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as DayTripPackage[];
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gói dịch vụ</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các gói combo và tour trong ngày
          </p>
        </div>

        <Tabs defaultValue="combo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="combo">Combo 2N1Đ</TabsTrigger>
            <TabsTrigger value="daytrip">Tour trong ngày</TabsTrigger>
          </TabsList>

          <TabsContent value="combo">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <PackageTable
                title="Gói Combo 2 Ngày 1 Đêm"
                description="Các gói nghỉ dưỡng combo"
                packages={comboPackages || []}
                isLoading={loadingCombo}
                type="combo"
                formatPrice={formatPrice}
                queryClient={queryClient}
                toast={toast}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="daytrip">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <PackageTable
                title="Tour Trong Ngày"
                description="Các gói tham quan trong ngày"
                packages={dayTripPackages || []}
                isLoading={loadingDayTrip}
                type="daytrip"
                formatPrice={formatPrice}
                queryClient={queryClient}
                toast={toast}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

interface PackageTableProps {
  title: string;
  description: string;
  packages: (ComboPackage | DayTripPackage)[];
  isLoading: boolean;
  type: 'combo' | 'daytrip';
  formatPrice: (price: number) => string;
  queryClient: any;
  toast: any;
}

function PackageTable({ 
  title, 
  description, 
  packages, 
  isLoading, 
  type, 
  formatPrice,
  queryClient,
  toast
}: PackageTableProps) {
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tableName = type === 'combo' ? 'combo_packages' : 'day_trip_packages';
  const queryKey = type === 'combo' ? 'admin-combo-packages' : 'admin-daytrip-packages';

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: 'Đã xóa', description: 'Gói dịch vụ đã được xóa.' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể xóa.' });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from(tableName).update({ published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description} ({packages.length} gói)</CardDescription>
        </div>
        <PackageDialog
          type={type}
          package={null}
          isOpen={isDialogOpen && !editingPackage}
          setIsOpen={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingPackage(null);
          }}
          queryClient={queryClient}
          toast={toast}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : packages.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên gói</TableHead>
                <TableHead>Giá người lớn</TableHead>
                <TableHead>Giá trẻ em</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">
                    <div>
                      {pkg.name}
                      {'subtitle' in pkg && pkg.subtitle && (
                        <p className="text-xs text-muted-foreground">{pkg.subtitle}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(pkg.price_adult)}</TableCell>
                  <TableCell>{pkg.price_child ? formatPrice(pkg.price_child) : '-'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={pkg.published}
                      onCheckedChange={(checked) => 
                        togglePublishMutation.mutate({ id: pkg.id, published: checked })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <PackageDialog
                        type={type}
                        package={pkg}
                        isOpen={editingPackage?.id === pkg.id}
                        setIsOpen={(open) => {
                          if (open) setEditingPackage(pkg);
                          else setEditingPackage(null);
                        }}
                        queryClient={queryClient}
                        toast={toast}
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa gói dịch vụ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa "{pkg.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(pkg.id)}
                              className="bg-destructive text-destructive-foreground"
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
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có gói dịch vụ nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PackageDialogProps {
  type: 'combo' | 'daytrip';
  package: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  queryClient: any;
  toast: any;
  trigger?: React.ReactNode;
}

function PackageDialog({ type, package: pkg, isOpen, setIsOpen, queryClient, toast, trigger }: PackageDialogProps) {
  const isEditing = !!pkg;
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    subtitle: pkg?.subtitle || '',
    price_adult: pkg?.price_adult || 0,
    price_child: pkg?.price_child || 0,
    includes: pkg?.includes || [],
    image_url: pkg?.image_url || '',
    display_order: pkg?.display_order || 0,
    published: pkg?.published ?? true,
  });
  const [newInclude, setNewInclude] = useState('');

  const tableName = type === 'combo' ? 'combo_packages' : 'day_trip_packages';
  const queryKey = type === 'combo' ? 'admin-combo-packages' : 'admin-daytrip-packages';

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: formData.name,
        price_adult: formData.price_adult,
        price_child: formData.price_child || null,
        includes: formData.includes,
        display_order: formData.display_order,
        published: formData.published,
        ...(type === 'combo' ? { subtitle: formData.subtitle || null } : {}),
      };

      if (isEditing) {
        const { error } = await supabase.from(tableName).update(payload).eq('id', pkg.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: isEditing ? 'Đã cập nhật' : 'Đã tạo' });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Không thể lưu.' });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      subtitle: '',
      price_adult: 0,
      price_child: 0,
      includes: [],
      image_url: '',
      display_order: 0,
      published: true,
    });
    setNewInclude('');
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData((prev) => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()],
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_: any, i: number) => i !== index),
    }));
  };

  // Update form when package changes
  useState(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        subtitle: pkg.subtitle || '',
        price_adult: pkg.price_adult || 0,
        price_child: pkg.price_child || 0,
        includes: pkg.includes || [],
        image_url: pkg.image_url || '',
        display_order: pkg.display_order || 0,
        published: pkg.published ?? true,
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm gói mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
          </DialogTitle>
          <DialogDescription>
            {type === 'combo' ? 'Gói combo 2 ngày 1 đêm' : 'Tour trong ngày'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 max-h-[60vh] pr-4">
          <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pkg-name">Tên gói *</Label>
            <Input
              id="pkg-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="VD: Gói Tiêu Chuẩn"
            />
          </div>
          {type === 'combo' && (
            <div className="space-y-2">
              <Label htmlFor="pkg-subtitle">Phụ đề</Label>
              <Input
                id="pkg-subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="VD: Lựa chọn phổ biến nhất"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pkg-price-adult">Giá người lớn (VNĐ)</Label>
              <Input
                id="pkg-price-adult"
                type="number"
                min="0"
                value={formData.price_adult}
                onChange={(e) => setFormData((prev) => ({ 
                  ...prev, 
                  price_adult: parseInt(e.target.value) || 0 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-price-child">Giá trẻ em (VNĐ)</Label>
              <Input
                id="pkg-price-child"
                type="number"
                min="0"
                value={formData.price_child}
                onChange={(e) => setFormData((prev) => ({ 
                  ...prev, 
                  price_child: parseInt(e.target.value) || 0 
                }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bao gồm</Label>
            <div className="flex gap-2">
              <Input
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                placeholder="VD: Bữa sáng, Tour tham quan..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
              />
              <Button type="button" variant="secondary" onClick={addInclude}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.includes.map((item: string, index: number) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {item}
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <ImageUploader
              value={formData.image_url || ''}
              onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
              folder="packages"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pkg-published">Hiển thị</Label>
            <Switch
              id="pkg-published"
              checked={formData.published}
              onCheckedChange={(checked) => 
                setFormData((prev) => ({ ...prev, published: checked }))
              }
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={() => saveMutation.mutate()} 
            disabled={!formData.name || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Lưu'
            )}
          </Button>
        </DialogFooter>
        </ScrollArea>
        
      </DialogContent>
    </Dialog>
  );
}
