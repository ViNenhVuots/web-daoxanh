import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({ value, onChange, folder = 'images' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'File không hợp lệ',
        description: 'Vui lòng chọn file hình ảnh (JPG, PNG, GIF, WebP)',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File quá lớn',
        description: 'Kích thước file tối đa là 5MB',
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('content-images')
        .getPublicUrl(data.path);

      onChange(urlData.publicUrl);
      
      toast({
        title: 'Upload thành công',
        description: 'Hình ảnh đã được tải lên.',
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

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    try {
      new URL(urlInput);
      onChange(urlInput.trim());
      setUrlInput('');
      toast({
        title: 'Đã thêm URL',
        description: 'URL hình ảnh đã được cập nhật.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'URL không hợp lệ',
        description: 'Vui lòng nhập URL hợp lệ.',
      });
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
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
                    Click để chọn ảnh
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF, WebP (tối đa 5MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="image-url">URL hình ảnh</Label>
              <Input
                id="image-url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleUrlSubmit}
            >
              Sử dụng URL này
            </Button>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
