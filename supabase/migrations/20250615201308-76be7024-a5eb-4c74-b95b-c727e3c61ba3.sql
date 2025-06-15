
-- First, let's fix the handle_new_user function to handle potential errors
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Insert into profiles table with proper error handling
  INSERT INTO public.profiles (user_id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    role = COALESCE(EXCLUDED.role, profiles.role);
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Fix potential foreign key issues in existing tables
-- Update client_connections to reference user_id instead of profile id
ALTER TABLE public.client_connections 
DROP CONSTRAINT IF EXISTS client_connections_client_id_fkey,
DROP CONSTRAINT IF EXISTS client_connections_dietitian_id_fkey;

ALTER TABLE public.client_connections
ADD CONSTRAINT client_connections_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT client_connections_dietitian_id_fkey 
FOREIGN KEY (dietitian_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update client_messages to reference user_id properly
ALTER TABLE public.client_messages
DROP CONSTRAINT IF EXISTS client_messages_sender_id_fkey,
DROP CONSTRAINT IF EXISTS client_messages_recipient_id_fkey;

ALTER TABLE public.client_messages
ADD CONSTRAINT client_messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT client_messages_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update client_notes to reference user_id properly  
ALTER TABLE public.client_notes
DROP CONSTRAINT IF EXISTS client_notes_client_id_fkey,
DROP CONSTRAINT IF EXISTS client_notes_dietitian_id_fkey;

ALTER TABLE public.client_notes
ADD CONSTRAINT client_notes_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT client_notes_dietitian_id_fkey 
FOREIGN KEY (dietitian_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update daily_nutrition to reference user_id properly
ALTER TABLE public.daily_nutrition
DROP CONSTRAINT IF EXISTS daily_nutrition_user_id_fkey;

ALTER TABLE public.daily_nutrition
ADD CONSTRAINT daily_nutrition_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update diet_programs to reference user_id properly
ALTER TABLE public.diet_programs
DROP CONSTRAINT IF EXISTS diet_programs_dietitian_id_fkey;

ALTER TABLE public.diet_programs
ADD CONSTRAINT diet_programs_dietitian_id_fkey 
FOREIGN KEY (dietitian_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update message_threads to reference user_id properly
ALTER TABLE public.message_threads
DROP CONSTRAINT IF EXISTS message_threads_client_id_fkey,
DROP CONSTRAINT IF EXISTS message_threads_dietitian_id_fkey;

ALTER TABLE public.message_threads
ADD CONSTRAINT message_threads_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT message_threads_dietitian_id_fkey 
FOREIGN KEY (dietitian_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update program_assignments to reference user_id properly
ALTER TABLE public.program_assignments
DROP CONSTRAINT IF EXISTS program_assignments_client_id_fkey,
DROP CONSTRAINT IF EXISTS program_assignments_dietitian_id_fkey;

ALTER TABLE public.program_assignments
ADD CONSTRAINT program_assignments_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT program_assignments_dietitian_id_fkey 
FOREIGN KEY (dietitian_id) REFERENCES auth.users(id) ON DELETE CASCADE;
