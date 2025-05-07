-- This file contains all the necessary SQL to set up the Supabase database for the QEE application

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  img_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a function to check if a user exists and create them if not
CREATE OR REPLACE FUNCTION create_user_if_not_exists(
  p_email TEXT,
  p_name TEXT,
  p_img_url TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM public.users WHERE email = p_email) INTO user_exists;
  
  -- If user doesn't exist, create them
  IF NOT user_exists THEN
    INSERT INTO public.users (email, name, img_url)
    VALUES (p_email, p_name, p_img_url);
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
