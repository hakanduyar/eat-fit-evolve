
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useProfileManager } from '@/hooks/useProfileManager';
import { FormField } from './FormField';
import { Database } from '@/integrations/supabase/types';

type ProfessionalProfile = Database['public']['Tables']['professional_profiles']['Row'];

interface ProfessionalProfileFormProps {
  professionalProfile: ProfessionalProfile | null;
}

export function ProfessionalProfileForm({ professionalProfile }: ProfessionalProfileFormProps) {
  const { createProfessionalProfile, updateProfessionalProfile } = useProfileManager();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    license_number: professionalProfile?.license_number || '',
    experience_years: professionalProfile?.experience_years?.toString() || '',
    consultation_fee: professionalProfile?.consultation_fee?.toString() || '',
    diploma_info: professionalProfile?.diploma_info || '',
    specializations: professionalProfile?.specializations?.join(', ') || ''
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const profileData = {
        license_number: formData.license_number || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : null,
        diploma_info: formData.diploma_info || null,
        specializations: formData.specializations ? formData.specializations.split(',').map(s => s.trim()) : null
      };

      let result;
      if (professionalProfile) {
        result = await updateProfessionalProfile(profileData);
      } else {
        result = await createProfessionalProfile(profileData);
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
          description: "Profesyonel profil güncellendi"
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profesyonel Bilgiler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Lisans Numarası" htmlFor="license_number">
            <Input
              id="license_number"
              value={formData.license_number}
              onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
            />
          </FormField>

          <FormField label="Deneyim (Yıl)" htmlFor="experience_years">
            <Input
              id="experience_years"
              type="number"
              value={formData.experience_years}
              onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
            />
          </FormField>

          <FormField label="Danışmanlık Ücreti (₺)" htmlFor="consultation_fee">
            <Input
              id="consultation_fee"
              type="number"
              step="0.01"
              value={formData.consultation_fee}
              onChange={(e) => setFormData(prev => ({ ...prev, consultation_fee: e.target.value }))}
            />
          </FormField>

          <FormField label="Uzmanlık Alanları (virgülle ayırın)" htmlFor="specializations">
            <Input
              id="specializations"
              value={formData.specializations}
              onChange={(e) => setFormData(prev => ({ ...prev, specializations: e.target.value }))}
              placeholder="Beslenme, Spor, Diyet"
            />
          </FormField>
        </div>

        <FormField label="Diploma Bilgileri" htmlFor="diploma_info">
          <Textarea
            id="diploma_info"
            value={formData.diploma_info}
            onChange={(e) => setFormData(prev => ({ ...prev, diploma_info: e.target.value }))}
            rows={3}
          />
        </FormField>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </CardContent>
    </Card>
  );
}
