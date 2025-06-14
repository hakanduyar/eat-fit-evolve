
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfileManager } from '@/hooks/useProfileManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export function ProfileEditForm() {
  const { profile } = useAuth();
  const { userProfile, professionalProfile, loading } = useUserProfile();
  const { createUserProfile, updateUserProfile, createProfessionalProfile, updateProfessionalProfile } = useProfileManager();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [userFormData, setUserFormData] = useState({
    birth_date: userProfile?.birth_date || '',
    gender: userProfile?.gender || '',
    height: userProfile?.height || '',
    weight: userProfile?.weight || '',
    target_weight: userProfile?.target_weight || '',
    activity_level: userProfile?.activity_level || 'moderate',
    goal: userProfile?.goal || ''
  });

  const [professionalFormData, setProfessionalFormData] = useState({
    license_number: professionalProfile?.license_number || '',
    experience_years: professionalProfile?.experience_years || '',
    consultation_fee: professionalProfile?.consultation_fee || '',
    diploma_info: professionalProfile?.diploma_info || '',
    specializations: professionalProfile?.specializations?.join(', ') || ''
  });

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  const handleUserProfileSave = async () => {
    setSaving(true);
    try {
      const profileData = {
        ...userFormData,
        height: userFormData.height ? parseInt(userFormData.height) : null,
        weight: userFormData.weight ? parseFloat(userFormData.weight) : null,
        target_weight: userFormData.target_weight ? parseFloat(userFormData.target_weight) : null,
        birth_date: userFormData.birth_date || null,
        gender: userFormData.gender || null,
        goal: userFormData.goal || null
      };

      let result;
      if (userProfile) {
        result = await updateUserProfile(profileData);
      } else {
        result = await createUserProfile(profileData);
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
      }
    } finally {
      setSaving(false);
    }
  };

  const handleProfessionalProfileSave = async () => {
    setSaving(true);
    try {
      const profileData = {
        ...professionalFormData,
        experience_years: professionalFormData.experience_years ? parseInt(professionalFormData.experience_years) : null,
        consultation_fee: professionalFormData.consultation_fee ? parseFloat(professionalFormData.consultation_fee) : null,
        specializations: professionalFormData.specializations ? professionalFormData.specializations.split(',').map(s => s.trim()) : null,
        license_number: professionalFormData.license_number || null,
        diploma_info: professionalFormData.diploma_info || null
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
    <div className="space-y-6">
      {/* User Profile Form */}
      {profile?.role === 'user' && (
        <Card>
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birth_date">Doğum Tarihi</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={userFormData.birth_date}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="gender">Cinsiyet</Label>
                <Select 
                  value={userFormData.gender} 
                  onValueChange={(value) => setUserFormData(prev => ({ ...prev, gender: value }))}
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
              </div>
              <div>
                <Label htmlFor="height">Boy (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={userFormData.height}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, height: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Kilo (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={userFormData.weight}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="target_weight">Hedef Kilo (kg)</Label>
                <Input
                  id="target_weight"
                  type="number"
                  step="0.1"
                  value={userFormData.target_weight}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, target_weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="activity_level">Aktivite Seviyesi</Label>
                <Select 
                  value={userFormData.activity_level} 
                  onValueChange={(value) => setUserFormData(prev => ({ ...prev, activity_level: value }))}
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
              </div>
              <div>
                <Label htmlFor="goal">Hedef</Label>
                <Select 
                  value={userFormData.goal} 
                  onValueChange={(value) => setUserFormData(prev => ({ ...prev, goal: value }))}
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
              </div>
            </div>
            <Button onClick={handleUserProfileSave} disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Professional Profile Form */}
      {(profile?.role === 'dietitian' || profile?.role === 'trainer') && (
        <Card>
          <CardHeader>
            <CardTitle>Profesyonel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="license_number">Lisans Numarası</Label>
                <Input
                  id="license_number"
                  value={professionalFormData.license_number}
                  onChange={(e) => setProfessionalFormData(prev => ({ ...prev, license_number: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="experience_years">Deneyim (Yıl)</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={professionalFormData.experience_years}
                  onChange={(e) => setProfessionalFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="consultation_fee">Danışmanlık Ücreti (₺)</Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  step="0.01"
                  value={professionalFormData.consultation_fee}
                  onChange={(e) => setProfessionalFormData(prev => ({ ...prev, consultation_fee: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="specializations">Uzmanlık Alanları (virgülle ayırın)</Label>
                <Input
                  id="specializations"
                  value={professionalFormData.specializations}
                  onChange={(e) => setProfessionalFormData(prev => ({ ...prev, specializations: e.target.value }))}
                  placeholder="Beslenme, Spor, Diyet"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="diploma_info">Diploma Bilgileri</Label>
              <Textarea
                id="diploma_info"
                value={professionalFormData.diploma_info}
                onChange={(e) => setProfessionalFormData(prev => ({ ...prev, diploma_info: e.target.value }))}
                rows={3}
              />
            </div>
            <Button onClick={handleProfessionalProfileSave} disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
