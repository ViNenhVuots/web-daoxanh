import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Accommodation {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  long_description: string | null;
  image_url: string | null;
  capacity: string | null;
  price_original: number | null;
  price_discounted: number | null;
  unit: string | null;
  amenities: string[];
  highlights: string[];
  location: string | null;
  rating: number | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useAccommodations() {
  return useQuery({
    queryKey: ['accommodations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Accommodation[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAccommodation(slug: string | undefined) {
  return useQuery({
    queryKey: ['accommodation', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as Accommodation | null;
    },
    enabled: !!slug,
  });
}
