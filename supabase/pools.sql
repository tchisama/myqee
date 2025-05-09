-- Create pools table
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

-- Add pool_id column to instances table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'instances'
    AND column_name = 'pool_id'
  ) THEN
    ALTER TABLE public.instances ADD COLUMN pool_id BIGINT REFERENCES public.pools(id);
  END IF;
END $$;

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
