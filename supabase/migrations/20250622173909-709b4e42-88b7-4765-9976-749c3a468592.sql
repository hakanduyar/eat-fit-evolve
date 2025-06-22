
-- Phase 1: Clean up redundant tables and consolidate data models (Fixed version)

-- Drop the redundant messaging system tables
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.message_threads CASCADE;

-- Drop the redundant nutrition system tables  
DROP TABLE IF EXISTS public.meal_foods CASCADE;
DROP TABLE IF EXISTS public.meals CASCADE;

-- Enable RLS on appointments if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'appointments' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Add missing foreign key constraints for appointments (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'appointments_client_fkey'
    ) THEN
        ALTER TABLE public.appointments 
        ADD CONSTRAINT appointments_client_fkey 
        FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'appointments_professional_fkey'
    ) THEN
        ALTER TABLE public.appointments 
        ADD CONSTRAINT appointments_professional_fkey 
        FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END
$$;

-- Add RLS policies only if they don't exist
DO $$
BEGIN
    -- Appointments policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'appointments' 
        AND policyname = 'Users can view their appointments'
    ) THEN
        CREATE POLICY "Users can view their appointments" ON public.appointments
        FOR SELECT USING (
          client_id = auth.uid() OR professional_id = auth.uid()
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'appointments' 
        AND policyname = 'Professionals can create appointments'
    ) THEN
        CREATE POLICY "Professionals can create appointments" ON public.appointments
        FOR INSERT WITH CHECK (
          professional_id = auth.uid()
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'appointments' 
        AND policyname = 'Users can update their appointments'
    ) THEN
        CREATE POLICY "Users can update their appointments" ON public.appointments
        FOR UPDATE USING (
          client_id = auth.uid() OR professional_id = auth.uid()
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'appointments' 
        AND policyname = 'Users can delete their appointments'
    ) THEN
        CREATE POLICY "Users can delete their appointments" ON public.appointments
        FOR DELETE USING (
          client_id = auth.uid() OR professional_id = auth.uid()
        );
    END IF;

    -- Client connections policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'client_connections' 
        AND policyname = 'Users can view their connections'
    ) THEN
        CREATE POLICY "Users can view their connections" ON public.client_connections
        FOR SELECT USING (auth.uid() = client_id OR auth.uid() = dietitian_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'client_connections' 
        AND policyname = 'Professionals can create connections'
    ) THEN
        CREATE POLICY "Professionals can create connections" ON public.client_connections
        FOR INSERT WITH CHECK (auth.uid() = dietitian_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'client_connections' 
        AND policyname = 'Users can update their connections'
    ) THEN
        CREATE POLICY "Users can update their connections" ON public.client_connections
        FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = dietitian_id);
    END IF;

    -- Client messages policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'client_messages' 
        AND policyname = 'Users can view messages in their connections'
    ) THEN
        CREATE POLICY "Users can view messages in their connections" ON public.client_messages
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.client_connections cc 
            WHERE cc.id = connection_id 
            AND (cc.client_id = auth.uid() OR cc.dietitian_id = auth.uid())
          )
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'client_messages' 
        AND policyname = 'Users can send messages in their connections'
    ) THEN
        CREATE POLICY "Users can send messages in their connections" ON public.client_messages
        FOR INSERT WITH CHECK (
          sender_id = auth.uid() AND
          EXISTS (
            SELECT 1 FROM public.client_connections cc 
            WHERE cc.id = connection_id 
            AND (cc.client_id = auth.uid() OR cc.dietitian_id = auth.uid())
          )
        );
    END IF;
END
$$;

-- Add password reset token table for Phase 4 (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on password reset tokens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'password_reset_tokens' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;
