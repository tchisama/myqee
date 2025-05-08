-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  instance_id BIGINT NOT NULL REFERENCES public.instances(id) ON DELETE CASCADE,
  owner_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'pro',
  amount DECIMAL(10, 2) NOT NULL DEFAULT 79.00,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert into subscriptions table
CREATE POLICY "Allow service role to insert subscriptions"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public read access to subscriptions
CREATE POLICY "Allow public read access to subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to update their own subscriptions
CREATE POLICY "Allow authenticated users to update their own subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.instances i
    WHERE i.id = instance_id AND i.owner_id = auth.uid()::bigint
  ));
