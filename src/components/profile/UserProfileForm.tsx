
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useProfileManager } from '@/hooks/useProfileManager';
import { FormField } from './FormField';
import { Database } from '@/integrations/supabase/types';

type Gender = 'male' | 'female' | 'other';
type Goal = 'lose_weight' | 'gain_weight' | 'maintain';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface UserProfileFormProps {
  userProfile: UserProfile | null;
  onCancel?: () => void;
  initialData?: UserProfile | null;
}

export function UserProfileForm({ userProfile, onCancel, initialData }: UserProfileFormProps) {
  const { createUserProfile, updateUserProfile } = useProfileManager();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Use initialData if provided, otherwise use userProfile
  const profileData = initialData || userProfile;

  const [formData, setFormData] = useState({
    birth_date: profileData?.birth_date || '',
    gender: (profileData?.gender as Gender) || '',
    height: profileData?.height?.toString() || '',
    weight: profileData?.weight?.toString() || '',
    target_weight: profileData?.target_weight?.toString() || '',
    activity_level: (profileData?.activity_level as ActivityLevel) || 'moderate',
    goal: (profileData?.goal as Goal) || ''
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileDataToSave = {
        birth_date: formData.birth_date || null,
        gender: formData.gender as Gender || null,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        target_weight: formData.target_weight ? parseFloat(formData.target_weight) : null,
        activity_level: formData.activity_level,
        goal: formData.goal as Goal || null
      };

      let result;
      if (profileData) {
        result = await updateUserProfile(profileDataToSave);
      } else {
        result = await createUserProfile(profileDataToSave);
      }

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Profil bilgileri güncellendi"
        });
        if (onCancel) {
          onCancel();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kişisel Bilgiler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Doğum Tarihi" htmlFor="birth_date">
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
            />
          </FormField>

          <FormField label="Cinsiyet" htmlFor="gender">
            <Select 
              value={formData.gender} 
              onValueChange={(value: Gender) => setFormData(prev => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cinsiyet seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Erkek</SelectItem>
                <SelectItem value="female">Kadın</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Boy (cm)" htmlFor="height">
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
            />
          </FormField>

          <FormField label="Kilo (kg)" htmlFor="weight">
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            />
          </FormField>

          <FormField label="Hedef Kilo (kg)" htmlFor="target_weight">
            <Input
              id="target_weight"
              type="number"
              step="0.1"
              value={formData.target_weight}
              onChange={(e) => setFormData(prev => ({ ...prev, target_weight: e.target.value }))}
            />
          </FormField>

          <FormField label="Aktivite Seviyesi" htmlFor="activity_level">
            <Select 
              value={formData.activity_level} 
              onValueChange={(value: ActivityLevel) => setFormData(prev => ({ ...prev, activity_level: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Hareketsiz</SelectItem>
                <SelectItem value="light">Hafif</SelectItem>
                <SelectItem value="moderate">Orta</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="very_active">Çok Aktif</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Hedef" htmlFor="goal">
            <Select 
              value={formData.goal} 
              onValueChange={(value: Goal) => setFormData(prev => ({ ...prev, goal: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hedef seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose_weight">Kilo Verme</SelectItem>
                <SelectItem value="gain_weight">Kilo Alma</SelectItem>
                <SelectItem value="maintain">Kilo Koruma</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              İptal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
