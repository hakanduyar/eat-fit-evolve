
-- Sadece eksik sütunları kontrol edip ekleyelim
DO $$ BEGIN
    -- user_profiles tablosuna activity_level sütunu ekle (eğer yoksa)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'activity_level') THEN
        ALTER TABLE public.user_profiles 
        ADD COLUMN activity_level TEXT DEFAULT 'moderate' 
        CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'));
    END IF;
    
    -- professional_profiles tablosuna license_number sütunu ekle (eğer yoksa)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_profiles' AND column_name = 'license_number') THEN
        ALTER TABLE public.professional_profiles 
        ADD COLUMN license_number TEXT;
    END IF;
    
    -- professional_profiles tablosuna consultation_fee sütunu ekle (eğer yoksa)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'professional_profiles' AND column_name = 'consultation_fee') THEN
        ALTER TABLE public.professional_profiles 
        ADD COLUMN consultation_fee DECIMAL(8,2) DEFAULT 0 
        CHECK (consultation_fee >= 0 AND consultation_fee <= 999999.99);
    END IF;
END $$;

-- İndeksleri oluştur (IF NOT EXISTS kullanarak)
CREATE INDEX IF NOT EXISTS idx_user_profiles_activity_level 
ON public.user_profiles(activity_level) 
WHERE activity_level IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_professional_profiles_license_number 
ON public.professional_profiles(license_number)
WHERE license_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_professional_profiles_consultation_fee 
ON public.professional_profiles(consultation_fee) 
WHERE consultation_fee > 0;

CREATE INDEX IF NOT EXISTS idx_user_profiles_target_weight 
ON public.user_profiles(target_weight) 
WHERE target_weight IS NOT NULL;
