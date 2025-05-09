-- Create instances table
CREATE TABLE IF NOT EXISTS public.instances (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  logo_url TEXT,
  language TEXT DEFAULT 'en',
  owner_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pool_id BIGINT REFERENCES public.pools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on instances table
ALTER TABLE public.instances ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert into instances table
CREATE POLICY "Allow service role to insert instances"
  ON public.instances
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public read access to instances
CREATE POLICY "Allow public read access to instances"
  ON public.instances
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to update their own instances
CREATE POLICY "Allow authenticated users to update their own instances"
  ON public.instances
  FOR UPDATE
  USING (owner_id = auth.uid()::bigint);

-- Create policy to allow authenticated users to delete their own instances
CREATE POLICY "Allow authenticated users to delete their own instances"
  ON public.instances
  FOR DELETE
  USING (owner_id = auth.uid()::bigint);

-- Create function to create a new instance
CREATE OR REPLACE FUNCTION create_instance(
  p_name TEXT,
  p_logo_url TEXT,
  p_language TEXT,
  p_owner_id BIGINT,
  p_auto_assign_pool BOOLEAN DEFAULT true
) RETURNS BIGINT AS $$
DECLARE
  new_instance_id BIGINT;
  pool_id BIGINT;
BEGIN
  -- Insert the new instance
  INSERT INTO public.instances (
    name,
    logo_url,
    language,
    owner_id
  ) VALUES (
    p_name,
    p_logo_url,
    p_language,
    p_owner_id
  ) RETURNING id INTO new_instance_id;
  
  -- If auto-assign pool is enabled, find or create a pool for this instance
  IF p_auto_assign_pool THEN
    SELECT find_or_create_pool_for_instance(new_instance_id) INTO pool_id;
  END IF;
  
  RETURN new_instance_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
