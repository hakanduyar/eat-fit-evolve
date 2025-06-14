
-- İyileştirilmiş User Profiles Tablosu - Yeni Alanlar
ALTER TABLE public.user_profiles 
ADD COLUMN target_weight DECIMAL(5,2) CHECK (target_weight > 0 AND target_weight <= 999.99),
ADD COLUMN activity_level TEXT DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'));

-- İyileştirilmiş Professional Profiles Tablosu - Yeni Alanlar
ALTER TABLE public.professional_profiles 
ADD COLUMN license_number TEXT,
ADD COLUMN consultation_fee DECIMAL(8,2) DEFAULT 0 CHECK (consultation_fee >= 0 AND consultation_fee <= 999999.99);

-- Performans İyileştirmeleri - İndeksler (normal CREATE INDEX)
CREATE INDEX idx_user_profiles_activity_level 
ON public.user_profiles(activity_level) 
WHERE activity_level IS NOT NULL;

CREATE INDEX idx_professional_profiles_license_number 
ON public.professional_profiles(license_number)
WHERE license_number IS NOT NULL;

CREATE INDEX idx_professional_profiles_consultation_fee 
ON public.professional_profiles(consultation_fee) 
WHERE consultation_fee > 0;

CREATE INDEX idx_user_profiles_target_weight 
ON public.user_profiles(target_weight) 
WHERE target_weight IS NOT NULL;
