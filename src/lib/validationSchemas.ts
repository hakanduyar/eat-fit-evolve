
import { z } from 'zod';

// Activity Level Enum
export const activityLevels = [
  'sedentary',
  'light', 
  'moderate',
  'active',
  'very_active'
] as const;

export type ActivityLevel = typeof activityLevels[number];

// Activity level display names (Türkçe)
export const activityLevelDisplayNames: Record<ActivityLevel, string> = {
  sedentary: 'Hareketsiz (Ofis işi, çok az egzersiz)',
  light: 'Az Aktif (Hafif egzersiz, haftada 1-3 gün)',
  moderate: 'Orta Aktif (Orta egzersiz, haftada 3-5 gün)',
  active: 'Aktif (Yoğun egzersiz, haftada 6-7 gün)',
  very_active: 'Çok Aktif (Çok yoğun egzersiz, günde 2 kez)'
};

// Enhanced registration schema
export const registerSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  phone: z.string().optional(),
  role: z.enum(['user', 'dietitian', 'trainer']),
  
  // User fields
  birthDate: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  goal: z.enum(['lose_weight', 'gain_weight', 'maintain']).optional(),
  
  // New user fields
  targetWeight: z.string().optional(),
  activityLevel: z.enum(activityLevels).default('moderate'),
  
  // Professional fields
  diplomaInfo: z.string().optional(),
  experienceYears: z.string().optional(),
  specializations: z.string().optional(),
  
  // New professional fields
  licenseNumber: z.string().optional(),
  consultationFee: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Validation helper functions
export const validateWeight = (weight: number): boolean => {
  return weight > 0 && weight <= 999.99;
};

export const validateConsultationFee = (fee: number): boolean => {
  return fee >= 0 && fee <= 999999.99;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(amount);
};
