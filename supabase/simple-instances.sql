-- Create instances table
CREATE TABLE IF NOT EXISTS public.instances (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  logo_url TEXT,
  language TEXT DEFAULT 'en',
  owner_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pool_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
