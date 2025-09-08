/*
  # Fix user signup trigger

  1. New Functions
    - `handle_new_user()` - Creates a user profile automatically when a new user signs up
  
  2. New Triggers
    - Trigger on `auth.users` table to call `handle_new_user()` function
  
  3. Security
    - Function runs with security definer privileges to bypass RLS
    - Only creates profile for newly inserted users
*/

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    first_name,
    last_name,
    phone,
    address,
    city,
    postal_code,
    newsletter_subscribed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();