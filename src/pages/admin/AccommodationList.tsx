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
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Accommodation {
  id: string;
  slug: string;
  name: string;
  capacity: string | null;
  price_discounted: number | null;
  published: boolean;
}

export default function AccommodationList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accommodations, isLoading } = useQuery({
    queryKey: ['admin-accommodations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accommodations')
        .select('id, slug, name, capacity, price_discounted, published')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Accommodation[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accommodations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
      toast({
        title: 'Đã xóa',
        description: 'Loại lưu trú đã được xóa thành công.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa. Vui lòng thử lại.',
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from('accommodations')
        .update({ published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
    },
  });

  const formatPrice = (price: number | null) => {
    if (!price) return '-';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lưu trú</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý các loại phòng và nhà nghỉ
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/accommodations/new">
              <Plus className="h-4 w-4 mr-2" />
              Thêm loại lưu trú
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách lưu trú</CardTitle>
            <CardDescription>
              Tất cả các loại phòng và nhà nghỉ ({accommodations?.length || 0} loại)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : accommodations && accommodations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Sức chứa</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accommodations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        {item.capacity && (
                          <Badge variant="outline">{item.capacity}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatPrice(item.price_discounted)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublishMutation.mutate({
                            id: item.id,
                            published: !item.published
                          })}
                          className="gap-2"
                        >
                          {item.published ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Hiển thị</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Ẩn</span>
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/accommodations/edit/${item.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xóa loại lưu trú?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa "{item.name}"? 
                                  Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(item.id)}
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
                <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có loại lưu trú nào</p>
                <Button asChild className="mt-4">
                  <Link to="/admin/accommodations/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm loại lưu trú đầu tiên
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
