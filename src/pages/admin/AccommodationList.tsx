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
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Home, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Accommodation {
  id: string;
  slug: string;
  name: string;
  capacity: string | null;
  price_original: number | null;
  published: boolean;
  display_order: number;
}

// Sortable Row Component
function SortableAccommodationRow({ 
  item, 
  onTogglePublish, 
  onDelete, 
  formatPrice 
}: { 
  item: Accommodation; 
  onTogglePublish: (id: string, published: boolean) => void;
  onDelete: (id: string) => void;
  formatPrice: (price: number | null) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? 'relative' as const : undefined,
    backgroundColor: isDragging ? 'var(--muted)' : undefined,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[40px] px-2 text-center">
        <button
          type="button"
          className="cursor-grab hover:text-primary active:cursor-grabbing text-muted-foreground p-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>
        {item.capacity && (
          <Badge variant="outline">{item.capacity}</Badge>
        )}
      </TableCell>
      <TableCell>{formatPrice(item.price_original)}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTogglePublish(item.id, !item.published)}
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
                  onClick={() => onDelete(item.id)}
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
  );
}

export default function AccommodationList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accommodations, isLoading } = useQuery({
    queryKey: ['admin-accommodations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accommodations')
        .select('id, slug, name, capacity, price_original, published, display_order')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Accommodation[];
    },
  });

  const [items, setItems] = useState<Accommodation[]>([]);

  useEffect(() => {
    if (accommodations) {
      setItems(accommodations);
    }
  }, [accommodations]);

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

  const updateOrderMutation = useMutation({
    mutationFn: async (updates: { id: string; display_order: number }[]) => {
      const promises = updates.map((update) =>
        supabase
          .from('accommodations')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-accommodations'] });
      toast({
        title: 'Đã cập nhật',
        description: 'Thứ tự hiển thị đã được cập nhật thành công.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể cập nhật thứ tự. Vui lòng thử lại.',
      });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const updates = newItems.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));
      updateOrderMutation.mutate(updates);
    }
  };

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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Sức chứa</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={items.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {items.map((item) => (
                        <SortableAccommodationRow
                          key={item.id}
                          item={item}
                          formatPrice={formatPrice}
                          onTogglePublish={(id, published) =>
                            togglePublishMutation.mutate({ id, published })
                          }
                          onDelete={(id) => deleteMutation.mutate(id)}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
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
