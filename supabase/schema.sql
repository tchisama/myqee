-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  company_name TEXT DEFAULT '',
  logo_url TEXT,
  template TEXT DEFAULT 'modern',
  primary_color TEXT DEFAULT '#3435FF',
  show_order_line_images BOOLEAN DEFAULT true
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  level TEXT,
  category TEXT,
  duration TEXT
);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, video_id)
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Allow public read access to courses" 
  ON public.courses FOR SELECT USING (true);

-- Videos policies
CREATE POLICY "Allow public read access to videos" 
  ON public.videos FOR SELECT USING (true);

-- User progress policies
CREATE POLICY "Allow users to read their own progress" 
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own progress" 
  ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own progress" 
  ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
