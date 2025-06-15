
-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can update own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can delete own activities" ON public.activities;

DROP POLICY IF EXISTS "Users can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Professionals can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Professionals can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Professionals can delete appointments" ON public.appointments;

DROP POLICY IF EXISTS "Professionals can view own clients" ON public.clients;
DROP POLICY IF EXISTS "Professionals can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Professionals can update client status" ON public.clients;
DROP POLICY IF EXISTS "Professionals can delete clients" ON public.clients;

DROP POLICY IF EXISTS "Users can view own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.user_goals;

DROP POLICY IF EXISTS "Users can view own water intake" ON public.water_intake;
DROP POLICY IF EXISTS "Users can insert own water intake" ON public.water_intake;
DROP POLICY IF EXISTS "Users can update own water intake" ON public.water_intake;
DROP POLICY IF EXISTS "Users can delete own water intake" ON public.water_intake;

-- Enable RLS on all tables (won't fail if already enabled)
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;

-- Now create all the policies
-- RLS Policies for activities
CREATE POLICY "Users can view own activities" ON public.activities
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.activities
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" ON public.activities
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities" ON public.activities
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can view their appointments" ON public.appointments
FOR SELECT USING (auth.uid() = professional_id OR auth.uid() = client_id);

CREATE POLICY "Professionals can create appointments" ON public.appointments
FOR INSERT WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Professionals can update appointments" ON public.appointments
FOR UPDATE USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can delete appointments" ON public.appointments
FOR DELETE USING (auth.uid() = professional_id);

-- RLS Policies for clients
CREATE POLICY "Professionals can view own clients" ON public.clients
FOR SELECT USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can insert clients" ON public.clients
FOR INSERT WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Professionals can update client status" ON public.clients
FOR UPDATE USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can delete clients" ON public.clients
FOR DELETE USING (auth.uid() = professional_id);

-- RLS Policies for user_goals
CREATE POLICY "Users can view own goals" ON public.user_goals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.user_goals
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.user_goals
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for water_intake
CREATE POLICY "Users can view own water intake" ON public.water_intake
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water intake" ON public.water_intake
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water intake" ON public.water_intake
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own water intake" ON public.water_intake
FOR DELETE USING (auth.uid() = user_id);
