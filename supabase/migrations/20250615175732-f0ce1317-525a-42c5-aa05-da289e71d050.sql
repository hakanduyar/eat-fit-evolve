
-- Diyetisyen-Danışan Bağlantıları
CREATE TABLE public.client_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dietitian_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'active', 'inactive', 'terminated')) DEFAULT 'pending',
  connection_type TEXT CHECK (connection_type IN ('nutrition_only', 'full_support')) DEFAULT 'nutrition_only',
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(dietitian_id, client_id)
);

-- Diyet Programları
CREATE TABLE public.diet_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  dietitian_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  duration_days INTEGER DEFAULT 30 CHECK (duration_days > 0),
  daily_calorie_target INTEGER CHECK (daily_calorie_target > 0),
  protein_percentage INTEGER DEFAULT 20 CHECK (protein_percentage >= 0 AND protein_percentage <= 100),
  carbs_percentage INTEGER DEFAULT 50 CHECK (carbs_percentage >= 0 AND carbs_percentage <= 100),
  fat_percentage INTEGER DEFAULT 30 CHECK (fat_percentage >= 0 AND fat_percentage <= 100),
  restrictions TEXT[],
  notes TEXT,
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Program Atamaları
CREATE TABLE public.program_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.diet_programs(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  dietitian_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  custom_calorie_target INTEGER CHECK (custom_calorie_target > 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mesaj Thread'leri
CREATE TABLE public.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dietitian_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(dietitian_id, client_id)
);

-- Mesajlar
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'template', 'program_update')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Diyetisyen Notları
CREATE TABLE public.client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dietitian_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_type TEXT CHECK (note_type IN ('general', 'progress', 'concern', 'achievement')) DEFAULT 'general',
  content TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Günlük Beslenme Tablosu (meal_entries yerine yeni yapı)
CREATE TABLE public.daily_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  water_intake INTEGER DEFAULT 0 CHECK (water_intake >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Öğün Kayıtları (günlük beslenmeye bağlı)
CREATE TABLE public.meal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_nutrition_id UUID REFERENCES public.daily_nutrition(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')) NOT NULL,
  amount DECIMAL(8,2) NOT NULL CHECK (amount > 0),
  unit TEXT DEFAULT 'gram' NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  protein DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fat DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (fat >= 0),
  fiber DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (fiber >= 0),
  eaten_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Politikalarını Etkinleştir
ALTER TABLE public.client_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_entries ENABLE ROW LEVEL SECURITY;

-- Client Connections RLS Politikaları
CREATE POLICY "Dietitians can manage their client connections" ON public.client_connections
  FOR ALL USING (
    dietitian_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role IN ('dietitian', 'trainer')
    )
  );

CREATE POLICY "Clients can view their connections" ON public.client_connections
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Diet Programs RLS Politikaları  
CREATE POLICY "Dietitians can manage their programs" ON public.diet_programs
  FOR ALL USING (
    dietitian_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role IN ('dietitian', 'trainer')
    )
  );

-- Program Assignments RLS Politikaları
CREATE POLICY "Dietitians can manage program assignments" ON public.program_assignments
  FOR ALL USING (
    dietitian_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role IN ('dietitian', 'trainer')
    )
  );

CREATE POLICY "Clients can view their assigned programs" ON public.program_assignments
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Message Threads RLS Politikaları
CREATE POLICY "Participants can access message threads" ON public.message_threads
  FOR ALL USING (
    dietitian_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Messages RLS Politikaları
CREATE POLICY "Thread participants can access messages" ON public.messages
  FOR ALL USING (
    thread_id IN (
      SELECT id FROM public.message_threads 
      WHERE dietitian_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
            client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Client Notes RLS Politikaları
CREATE POLICY "Dietitians can manage client notes" ON public.client_notes
  FOR ALL USING (
    dietitian_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role IN ('dietitian', 'trainer')
    )
  );

CREATE POLICY "Clients can view notes about them" ON public.client_notes
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Daily Nutrition RLS Politikaları
CREATE POLICY "Users can manage their own daily nutrition" ON public.daily_nutrition
  FOR ALL USING (
    user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Dietitians can view client daily nutrition" ON public.daily_nutrition
  FOR SELECT USING (
    user_id IN (
      SELECT cc.client_id FROM public.client_connections cc
      WHERE cc.dietitian_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role IN ('dietitian', 'trainer')
      )
      AND cc.status = 'active'
    )
  );

-- Meal Entries RLS Politikaları
CREATE POLICY "Users can manage their meal entries" ON public.meal_entries
  FOR ALL USING (
    daily_nutrition_id IN (
      SELECT id FROM public.daily_nutrition 
      WHERE user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Dietitians can view client meal entries" ON public.meal_entries
  FOR SELECT USING (
    daily_nutrition_id IN (
      SELECT dn.id FROM public.daily_nutrition dn
      JOIN public.client_connections cc ON dn.user_id = cc.client_id
      WHERE cc.dietitian_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role IN ('dietitian', 'trainer')
      )
      AND cc.status = 'active'
    )
  );

-- İndeksler (Performans optimizasyonu)
CREATE INDEX idx_client_connections_dietitian ON public.client_connections(dietitian_id);
CREATE INDEX idx_client_connections_client ON public.client_connections(client_id);
CREATE INDEX idx_client_connections_status ON public.client_connections(status);
CREATE INDEX idx_diet_programs_dietitian ON public.diet_programs(dietitian_id);
CREATE INDEX idx_program_assignments_dietitian ON public.program_assignments(dietitian_id);
CREATE INDEX idx_program_assignments_client ON public.program_assignments(client_id);
CREATE INDEX idx_message_threads_participants ON public.message_threads(dietitian_id, client_id);
CREATE INDEX idx_messages_thread ON public.messages(thread_id);
CREATE INDEX idx_messages_sent_at ON public.messages(sent_at);
CREATE INDEX idx_client_notes_dietitian_client ON public.client_notes(dietitian_id, client_id);
CREATE INDEX idx_daily_nutrition_user_date ON public.daily_nutrition(user_id, date);
CREATE INDEX idx_meal_entries_daily_nutrition ON public.meal_entries(daily_nutrition_id);

-- Updated_at trigger'ı için fonksiyon zaten var, sadece trigger'ları ekleyelim
CREATE TRIGGER update_client_connections_updated_at
  BEFORE UPDATE ON public.client_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diet_programs_updated_at
  BEFORE UPDATE ON public.diet_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_program_assignments_updated_at
  BEFORE UPDATE ON public.program_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON public.message_threads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_nutrition_updated_at
  BEFORE UPDATE ON public.daily_nutrition
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
