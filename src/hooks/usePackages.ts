import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ComboPackage {
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
  created_at: string;
  updated_at: string;
}

export interface DayTripPackage {
  id: string;
  name: string;
  slug: string | null;
  price_adult: number;
  price_child: number | null;
  includes: string[];
  image_url: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export function useComboPackages() {
  return useQuery({
    queryKey: ['combo-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combo_packages')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as ComboPackage[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useDayTripPackages() {
  return useQuery({
    queryKey: ['daytrip-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('day_trip_packages')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as DayTripPackage[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useComboPackageBySlug(slug: string) {
  return useQuery({
    queryKey: ['combo-package', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combo_packages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data as ComboPackage;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDayTripPackageBySlug(slug: string) {
  return useQuery({
    queryKey: ['daytrip-package', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('day_trip_packages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data as DayTripPackage;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}
