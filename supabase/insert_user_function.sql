-- Create a function to insert a user with service role privileges
CREATE OR REPLACE FUNCTION insert_user(
  user_email TEXT,
  user_name TEXT,
  user_img_url TEXT
) RETURNS VOID AS $$
BEGIN
  -- Insert the user directly, bypassing RLS
  INSERT INTO public.users (email, name, img_url)
  VALUES (user_email, user_name, user_img_url);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
