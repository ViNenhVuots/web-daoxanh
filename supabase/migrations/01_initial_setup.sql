
-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for admin access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    category TEXT,
    author TEXT DEFAULT 'Đảo Xanh Ecofarm',
    read_time TEXT DEFAULT '5 phút đọc',
    content TEXT,
    is_featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_posts
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all blog posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create accommodations table
CREATE TABLE public.accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    long_description TEXT,
    image_url TEXT,
    capacity TEXT,
    price_original INTEGER,
    price_discounted INTEGER,
    unit TEXT DEFAULT 'đêm',
    amenities JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    location TEXT,
    rating NUMERIC(2,1) DEFAULT 4.5,
    published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on accommodations
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

-- RLS policies for accommodations
CREATE POLICY "Anyone can view published accommodations"
ON public.accommodations
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all accommodations"
ON public.accommodations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert accommodations"
ON public.accommodations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update accommodations"
ON public.accommodations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete accommodations"
ON public.accommodations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create combo_packages table
CREATE TABLE public.combo_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    price_adult INTEGER NOT NULL,
    price_child INTEGER,
    includes JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on combo_packages
ALTER TABLE public.combo_packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for combo_packages
CREATE POLICY "Anyone can view published combo packages"
ON public.combo_packages
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all combo packages"
ON public.combo_packages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert combo packages"
ON public.combo_packages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update combo packages"
ON public.combo_packages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete combo packages"
ON public.combo_packages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create day_trip_packages table
CREATE TABLE public.day_trip_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price_adult INTEGER NOT NULL,
    price_child INTEGER,
    includes JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on day_trip_packages
ALTER TABLE public.day_trip_packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for day_trip_packages
CREATE POLICY "Anyone can view published day trip packages"
ON public.day_trip_packages
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all day trip packages"
ON public.day_trip_packages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert day trip packages"
ON public.day_trip_packages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update day trip packages"
ON public.day_trip_packages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete day trip packages"
ON public.day_trip_packages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate unique slug for combo packages
CREATE OR REPLACE FUNCTION public.generate_combo_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    counter INTEGER := 1;
    candidate_slug TEXT;
    existing_count INTEGER;
BEGIN
    -- Generate base slug from name
    base_slug := '2d1n-' || LOWER(
        TRANSLATE(
            REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'),
            ' ',
            ''
        )
    );
    
    candidate_slug := base_slug;
    
    -- Check if slug already exists and find unique one
    LOOP
        SELECT COUNT(*) INTO existing_count
        FROM public.combo_packages
        WHERE slug = candidate_slug;
        
        IF existing_count = 0 THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
        candidate_slug := base_slug || counter::text;
    END LOOP;
    
    NEW.slug := candidate_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Function to generate unique slug for day trip packages
CREATE OR REPLACE FUNCTION public.generate_daytrip_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    counter INTEGER := 1;
    candidate_slug TEXT;
    existing_count INTEGER;
BEGIN
    -- Generate base slug from name
    base_slug := 'daytrip-' || LOWER(
        TRANSLATE(
            REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'),
            ' ',
            ''
        )
    );
    
    candidate_slug := base_slug;
    
    -- Check if slug already exists and find unique one
    LOOP
        SELECT COUNT(*) INTO existing_count
        FROM public.day_trip_packages
        WHERE slug = candidate_slug;
        
        IF existing_count = 0 THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
        candidate_slug := base_slug || counter::text;
    END LOOP;
    
    NEW.slug := candidate_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accommodations_updated_at
BEFORE UPDATE ON public.accommodations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add slug generation triggers for combo packages
CREATE TRIGGER generate_combo_slug_trigger
BEFORE INSERT ON public.combo_packages
FOR EACH ROW
EXECUTE FUNCTION public.generate_combo_slug();

CREATE TRIGGER update_combo_packages_updated_at
BEFORE UPDATE ON public.combo_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add slug generation triggers for day trip packages
CREATE TRIGGER generate_daytrip_slug_trigger
BEFORE INSERT ON public.day_trip_packages
FOR EACH ROW
EXECUTE FUNCTION public.generate_daytrip_slug();

CREATE TRIGGER update_day_trip_packages_updated_at
BEFORE UPDATE ON public.day_trip_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for content images
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Storage policies for content-images bucket
CREATE POLICY "Anyone can view content images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'content-images');

CREATE POLICY "Admins can upload content images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));
