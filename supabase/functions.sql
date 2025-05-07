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
