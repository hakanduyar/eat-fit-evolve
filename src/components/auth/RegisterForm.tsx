import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerSchema, type RegisterFormData, activityLevelDisplayNames, activityLevels, formatCurrency } from '@/lib/validationSchemas';

interface RegisterFormProps {
  onLoginClick: () => void;
}

export function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
      activityLevel: 'moderate'
    }
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // rol bilgisini doğru şekilde gönderiyoruz
      const userData = {
        full_name: data.fullName,
        phone: data.phone,
        role: data.role, // Bu çok önemli - rol bilgisi burada
        ...(data.birthDate && { birth_date: data.birthDate }),
        ...(data.gender && { gender: data.gender }),
        ...(data.height && { height: parseInt(data.height) }),
        ...(data.weight && { weight: parseFloat(data.weight) }),
        ...(data.goal && { goal: data.goal }),
        ...(data.targetWeight && { target_weight: parseFloat(data.targetWeight) }),
        ...(data.activityLevel && { activity_level: data.activityLevel }),
        ...(data.diplomaInfo && { diploma_info: data.diplomaInfo }),
        ...(data.experienceYears && { experience_years: parseInt(data.experienceYears) }),
        ...(data.specializations && { specializations: data.specializations.split(',').map(s => s.trim()) }),
        ...(data.licenseNumber && { license_number: data.licenseNumber }),
        ...(data.consultationFee && { consultation_fee: parseFloat(data.consultationFee) })
      };

      console.log('Kayıt verisi gönderiliyor:', userData); // Debug için

      const { error } = await signUp(data.email, data.password, userData);
      
      if (error) {
        console.error('Kayıt hatası:', error); // Debug için
        toast({
          title: 'Kayıt Hatası',
          description: error.message === 'User already registered' 
            ? 'Bu email adresi zaten kayıtlı' 
            : error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Başarılı',
          description: 'Kayıt tamamlandı. Email adresinizi kontrol edin.',
        });
      }
    } catch (error) {
      console.error('Beklenmeyen hata:', error); // Debug için
      toast({
        title: 'Bir hata oluştu',
        description: 'Lütfen tekrar deneyin',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Basic Information */}
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="ornek@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Şifre *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="En az 8 karakter, büyük/küçük harf ve rakam"
            {...register('password')}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Şifrenizi tekrar girin"
            {...register('confirmPassword')}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="fullName">Ad Soyad *</Label>
        <Input
          id="fullName"
          placeholder="Adınız ve soyadınız"
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          placeholder="0555 123 4567"
          {...register('phone')}
        />
      </div>

      {/* Role Selection */}
      <div>
        <Label>Kullanıcı Tipi *</Label>
        <RadioGroup
          value={role}
          onValueChange={(value) => setValue('role', value as 'user' | 'dietitian' | 'trainer')}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user">Bireysel Kullanıcı</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dietitian" id="dietitian" />
            <Label htmlFor="dietitian">Diyetisyen</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="trainer" id="trainer" />
            <Label htmlFor="trainer">Spor Koçu</Label>
          </div>
        </RadioGroup>
      </div>

      {/* User-specific fields */}
      {role === 'user' && (
        <>
          <div>
            <Label htmlFor="birthDate">Doğum Tarihi</Label>
            <Input
              id="birthDate"
              type="date"
              {...register('birthDate')}
            />
          </div>

          <div>
            <Label htmlFor="gender">Cinsiyet</Label>
            <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}>
              <SelectTrigger>
                <SelectValue placeholder="Cinsiyet seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Erkek</SelectItem>
                <SelectItem value="female">Kadın</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Boy (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                {...register('height')}
              />
            </div>
            <div>
              <Label htmlFor="weight">Kilo (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                {...register('weight')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="targetWeight">Hedef Kilo (kg)</Label>
            <Input
              id="targetWeight"
              type="number"
              step="0.1"
              placeholder="65.0"
              {...register('targetWeight')}
            />
            {errors.targetWeight && (
              <p className="text-sm text-red-500 mt-1">{errors.targetWeight.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="goal">Hedef</Label>
            <Select onValueChange={(value) => setValue('goal', value as 'lose_weight' | 'gain_weight' | 'maintain')}>
              <SelectTrigger>
                <SelectValue placeholder="Hedefinizi seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose_weight">Kilo Vermek</SelectItem>
                <SelectItem value="gain_weight">Kilo Almak</SelectItem>
                <SelectItem value="maintain">Kiloyu Korumak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="activityLevel">Aktivite Seviyesi</Label>
            <Select onValueChange={(value) => setValue('activityLevel', value as typeof activityLevels[number])}>
              <SelectTrigger>
                <SelectValue placeholder="Aktivite seviyenizi seçin" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {activityLevelDisplayNames[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Professional-specific fields */}
      {(role === 'dietitian' || role === 'trainer') && (
        <>
          <div>
            <Label htmlFor="licenseNumber">Lisans Numarası *</Label>
            <Input
              id="licenseNumber"
              placeholder="Örn: DYT-2024-001"
              {...register('licenseNumber')}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.licenseNumber.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="consultationFee">Danışmanlık Ücreti (₺)</Label>
            <Input
              id="consultationFee"
              type="number"
              step="0.01"
              placeholder="150.00"
              {...register('consultationFee')}
            />
            <p className="text-xs text-gray-500 mt-1">0 yazarsanız ücretsiz danışmanlık veriyorsunuz</p>
            {errors.consultationFee && (
              <p className="text-sm text-red-500 mt-1">{errors.consultationFee.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="diplomaInfo">Diploma/Sertifika Bilgisi</Label>
            <Textarea
              id="diplomaInfo"
              placeholder="Eğitim bilgilerinizi yazın"
              {...register('diplomaInfo')}
            />
          </div>

          <div>
            <Label htmlFor="experienceYears">Deneyim (Yıl)</Label>
            <Input
              id="experienceYears"
              type="number"
              placeholder="5"
              {...register('experienceYears')}
            />
          </div>

          <div>
            <Label htmlFor="specializations">Uzmanlık Alanları</Label>
            <Input
              id="specializations"
              placeholder="Spor beslenmesi, kilo yönetimi (virgülle ayırın)"
              {...register('specializations')}
            />
          </div>

          {/* Activity level for professionals too */}
          <div>
            <Label htmlFor="activityLevel">Aktivite Seviyesi</Label>
            <Select onValueChange={(value) => setValue('activityLevel', value as typeof activityLevels[number])}>
              <SelectTrigger>
                <SelectValue placeholder="Aktivite seviyenizi seçin" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {activityLevelDisplayNames[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Kayıt Ol
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onLoginClick}
        >
          Zaten hesabınız var mı? Giriş yapın
        </Button>
      </div>
    </form>
  );
}
