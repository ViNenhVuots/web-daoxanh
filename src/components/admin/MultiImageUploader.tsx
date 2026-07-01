import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface MultiImageUploaderProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}

export default function MultiImageUploader({ value = [], onChange, folder = 'images' }: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'File không hợp lệ',
          description: `File ${file.name} không phải là hình ảnh`,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File quá lớn',
          description: `File ${file.name} vượt quá 5MB`,
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      const newUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('content-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('content-images')
          .getPublicUrl(data.path);

        newUrls.push(urlData.publicUrl);
      }

      onChange([...value, ...newUrls]);
      
      toast({
        title: 'Upload thành công',
        description: `Đã tải lên ${newUrls.length} hình ảnh.`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi upload',
        description: error.message || 'Không thể tải lên hình ảnh.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newValues = value.filter((_, index) => index !== indexToRemove);
    onChange(newValues);
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Đang tải lên...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click để chọn nhiều ảnh
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, GIF, WebP (tối đa 5MB/ảnh)
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
