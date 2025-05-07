-- Enable RLS on users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert into users table
CREATE POLICY "Allow service role to insert users" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow public read access to users
CREATE POLICY "Allow public read access to users" 
  ON public.users 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to update their own record
CREATE POLICY "Allow authenticated users to update their own record" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid()::text = id::text);
