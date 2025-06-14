
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Target, Activity } from 'lucide-react';

export function ProfileDisplay() {
  const { profile } = useAuth();
  const { userProfile, professionalProfile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Basic Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Ad Soyad</label>
              <p className="text-lg">{profile.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">E-posta</label>
              <p className="text-lg">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Rol</label>
              <div>
                <Badge variant={profile.role === 'user' ? 'default' : 'secondary'}>
                  {profile.role === 'user' ? 'Kullanıcı' : 
                   profile.role === 'dietitian' ? 'Diyetisyen' : 'Antrenör'}
                </Badge>
              </div>
            </div>
            {profile.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telefon</label>
                <p className="text-lg">{profile.phone}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Profile (for regular users) */}
      {profile.role === 'user' && userProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Kişisel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userProfile.birth_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Doğum Tarihi</label>
                  <p className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(userProfile.birth_date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              )}
              {userProfile.gender && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Cinsiyet</label>
                  <p className="text-lg">
                    {userProfile.gender === 'male' ? 'Erkek' : 
                     userProfile.gender === 'female' ? 'Kadın' : 'Diğer'}
                  </p>
                </div>
              )}
              {userProfile.height && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Boy</label>
                  <p className="text-lg">{userProfile.height} cm</p>
                </div>
              )}
              {userProfile.weight && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Kilo</label>
                  <p className="text-lg">{userProfile.weight} kg</p>
                </div>
              )}
              {userProfile.target_weight && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Hedef Kilo</label>
                  <p className="text-lg">{userProfile.target_weight} kg</p>
                </div>
              )}
              {userProfile.activity_level && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Aktivite Seviyesi</label>
                  <p className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {userProfile.activity_level === 'sedentary' ? 'Hareketsiz' :
                     userProfile.activity_level === 'light' ? 'Hafif' :
                     userProfile.activity_level === 'moderate' ? 'Orta' :
                     userProfile.activity_level === 'active' ? 'Aktif' : 'Çok Aktif'}
                  </p>
                </div>
              )}
            </div>
            {userProfile.goal && (
              <div>
                <label className="text-sm font-medium text-gray-500">Hedef</label>
                <Badge variant="outline">
                  {userProfile.goal === 'lose_weight' ? 'Kilo Verme' :
                   userProfile.goal === 'gain_weight' ? 'Kilo Alma' : 'Kilo Koruma'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Professional Profile */}
      {(profile.role === 'dietitian' || profile.role === 'trainer') && professionalProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profesyonel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professionalProfile.experience_years && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Deneyim</label>
                  <p className="text-lg">{professionalProfile.experience_years} yıl</p>
                </div>
              )}
              {professionalProfile.license_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Lisans Numarası</label>
                  <p className="text-lg">{professionalProfile.license_number}</p>
                </div>
              )}
              {professionalProfile.consultation_fee && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Danışmanlık Ücreti</label>
                  <p className="text-lg">{professionalProfile.consultation_fee} ₺</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Onay Durumu</label>
                <Badge variant={professionalProfile.is_approved ? 'default' : 'secondary'}>
                  {professionalProfile.is_approved ? 'Onaylı' : 'Onay Bekliyor'}
                </Badge>
              </div>
            </div>
            {professionalProfile.specializations && professionalProfile.specializations.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Uzmanlık Alanları</label>
                <div className="flex flex-wrap gap-2">
                  {professionalProfile.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline">{spec}</Badge>
                  ))}
                </div>
              </div>
            )}
            {professionalProfile.diploma_info && (
              <div>
                <label className="text-sm font-medium text-gray-500">Diploma Bilgileri</label>
                <p className="text-lg">{professionalProfile.diploma_info}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
