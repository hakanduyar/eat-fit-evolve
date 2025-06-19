
-- Add missing foreign key constraints and RLS policies (Fixed version)

-- Fix meal_entries table - add foreign key to profiles and RLS
ALTER TABLE public.meal_entries 
ADD CONSTRAINT meal_entries_daily_nutrition_fkey 
FOREIGN KEY (daily_nutrition_id) REFERENCES public.daily_nutrition(id) ON DELETE CASCADE;

-- Enable RLS on meal_entries
ALTER TABLE public.meal_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meal_entries
CREATE POLICY "Users can view their own meal entries" ON public.meal_entries
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.daily_nutrition dn 
    WHERE dn.id = meal_entries.daily_nutrition_id 
    AND dn.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own meal entries" ON public.meal_entries
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.daily_nutrition dn 
    WHERE dn.id = meal_entries.daily_nutrition_id 
    AND dn.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own meal entries" ON public.meal_entries
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.daily_nutrition dn 
    WHERE dn.id = meal_entries.daily_nutrition_id 
    AND dn.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own meal entries" ON public.meal_entries
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.daily_nutrition dn 
    WHERE dn.id = meal_entries.daily_nutrition_id 
    AND dn.user_id = auth.uid()
  )
);

-- Fix daily_nutrition table RLS
ALTER TABLE public.daily_nutrition ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily nutrition" ON public.daily_nutrition
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily nutrition" ON public.daily_nutrition
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily nutrition" ON public.daily_nutrition
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily nutrition" ON public.daily_nutrition
FOR DELETE USING (auth.uid() = user_id);

-- Fix client_connections RLS
ALTER TABLE public.client_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their connections" ON public.client_connections
FOR SELECT USING (auth.uid() = client_id OR auth.uid() = dietitian_id);

CREATE POLICY "Professionals can create connections" ON public.client_connections
FOR INSERT WITH CHECK (auth.uid() = dietitian_id);

CREATE POLICY "Users can update their connections" ON public.client_connections
FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = dietitian_id);

-- Skip client_messages RLS as it already exists - just enable RLS
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

-- Add missing policy for client_messages INSERT if it doesn't exist
DO $$
BEGIN
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

-- Make user_id columns NOT NULL where they should be
ALTER TABLE public.daily_nutrition ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_goals ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.water_intake ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.activities ALTER COLUMN user_id SET NOT NULL;
