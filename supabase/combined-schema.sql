-- This file contains the combined schema for instances and pools

-- Create pools table first
CREATE TABLE IF NOT EXISTS public.pools (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  server_url TEXT,
  max_instances INTEGER DEFAULT 10,
  instances_number INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create instances table with reference to pools
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

-- Enable RLS on pools table
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert into pools table
CREATE POLICY "Allow service role to insert pools"
  ON public.pools
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public read access to pools
CREATE POLICY "Allow public read access to pools"
  ON public.pools
  FOR SELECT
  USING (true);

-- Create policy to allow admin to update pools
CREATE POLICY "Allow admin to update pools"
  ON public.pools
  FOR UPDATE
  USING (auth.email() = 'pro.tchisama@gmail.com');

-- Create policy to allow admin to delete pools
CREATE POLICY "Allow admin to delete pools"
  ON public.pools
  FOR DELETE
  USING (auth.email() = 'pro.tchisama@gmail.com');

-- Create function to assign an instance to a pool
CREATE OR REPLACE FUNCTION assign_instance_to_pool(
  p_instance_id BIGINT,
  p_pool_id BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
  current_pool_id BIGINT;
  max_instances INTEGER;
  instances_number INTEGER;
BEGIN
  -- Get the maximum number of instances allowed in the pool and current count
  SELECT
    pools.max_instances,
    pools.instances_number
  INTO
    max_instances,
    instances_number
  FROM public.pools
  WHERE id = p_pool_id;

  -- Check if pool has reached maximum capacity
  IF instances_number >= max_instances THEN
    RETURN FALSE;
  END IF;

  -- Get current pool_id of the instance if any
  SELECT pool_id INTO current_pool_id
  FROM public.instances
  WHERE id = p_instance_id;

  -- If instance is already in a pool, decrement that pool's count
  IF current_pool_id IS NOT NULL THEN
    UPDATE public.pools
    SET
      instances_number = instances_number - 1,
      updated_at = now()
    WHERE id = current_pool_id;
  END IF;

  -- Assign instance to pool
  UPDATE public.instances
  SET pool_id = p_pool_id
  WHERE id = p_instance_id;

  -- Increment the instances_number in the pool
  IF FOUND THEN
    UPDATE public.pools
    SET
      instances_number = instances_number + 1,
      updated_at = now()
    WHERE id = p_pool_id;
  END IF;

  RETURN FOUND;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get available pools with capacity
CREATE OR REPLACE FUNCTION get_available_pools() RETURNS TABLE (
  id BIGINT,
  name TEXT,
  description TEXT,
  server_url TEXT,
  max_instances INTEGER,
  current_instances INTEGER,
  available_slots INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.server_url,
    p.max_instances,
    p.instances_number AS current_instances,
    (p.max_instances - p.instances_number)::INTEGER AS available_slots,
    p.status
  FROM
    public.pools p
  WHERE
    p.status = 'active' AND
    p.instances_number < p.max_instances
  ORDER BY
    available_slots DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get instances in a pool
CREATE OR REPLACE FUNCTION get_pool_instances(p_pool_id BIGINT) RETURNS TABLE (
  instance_id BIGINT,
  instance_name TEXT,
  owner_id BIGINT,
  owner_name TEXT,
  owner_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id AS instance_id,
    i.name AS instance_name,
    i.owner_id,
    u.name AS owner_name,
    u.email AS owner_email
  FROM
    public.instances i
  JOIN
    public.users u ON i.owner_id = u.id
  WHERE
    i.pool_id = p_pool_id
  ORDER BY
    i.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to find or create an available pool and assign an instance to it
CREATE OR REPLACE FUNCTION find_or_create_pool_for_instance(
  p_instance_id BIGINT,
  p_pool_name_prefix TEXT DEFAULT 'Production Pool'
) RETURNS BIGINT AS $$
DECLARE
  available_pool_id BIGINT;
  new_pool_id BIGINT;
  pool_count INTEGER;
  threshold INTEGER := 8; -- Threshold for creating a new pool (80% of max_instances)
BEGIN
  -- First, try to find an available pool with capacity below threshold
  SELECT id INTO available_pool_id
  FROM public.pools
  WHERE
    status = 'active' AND
    instances_number < threshold
  ORDER BY instances_number ASC
  LIMIT 1;

  -- If an available pool is found, assign the instance to it
  IF available_pool_id IS NOT NULL THEN
    PERFORM assign_instance_to_pool(p_instance_id, available_pool_id);
    RETURN available_pool_id;
  END IF;

  -- No available pool found, create a new one
  -- Get count of existing pools for naming
  SELECT COUNT(*) INTO pool_count FROM public.pools;

  -- Insert new pool
  INSERT INTO public.pools (
    name,
    description,
    server_url,
    max_instances,
    instances_number,
    status
  ) VALUES (
    p_pool_name_prefix || ' ' || (pool_count + 1),
    'Automatically created pool',
    'https://odoo-server-' || (pool_count + 1) || '.example.com',
    10,
    0,
    'active'
  ) RETURNING id INTO new_pool_id;

  -- Assign instance to the new pool
  PERFORM assign_instance_to_pool(p_instance_id, new_pool_id);

  RETURN new_pool_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
