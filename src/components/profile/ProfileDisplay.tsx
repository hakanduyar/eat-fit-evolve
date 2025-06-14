import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";
import { UserProfileForm } from "./UserProfileForm";
import { ProfessionalProfileForm } from "./ProfessionalProfileForm";
import { ProfileEditForm } from "./ProfileEditForm";
import { RoleUpdateCard } from "./RoleUpdateCard";
import { User, Settings, Briefcase, UserCircle, Phone, Mail, Calendar, Activity } from "lucide-react";

export function ProfileDisplay() {
  const { profile } = useAuth();
  const { userProfile, professionalProfile, loading, error } = useUserProfile();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const getRoleIcon = () => {
    switch (profile?.role) {
      case 'dietitian':
        return <Briefcase className="h-5 w-5" />;
      case 'trainer':
        return <Activity className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleLabel = () => {
    switch (profile?.role) {
      case 'dietitian':
        return 'Diyetisyen';
      case 'trainer':
        return 'Spor Koçu';
      default:
        return 'Bireysel Kullanıcı';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ana Profil Bilgileri */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
          <div className="flex items-center space-x-2">
            {getRoleIcon()}
            <CardTitle>Profil Bilgileri</CardTitle>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {getRoleLabel()}
          </Badge>
        </CardHeader>
        <CardContent>
          {editingSection === 'basic' ? (
            <ProfileEditForm onCancel={() => setEditingSection(null)} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <UserCircle className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{profile?.full_name}</p>
                    <p className="text-sm text-gray-500">Ad Soyad</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{profile?.email}</p>
                    <p className="text-sm text-gray-500">E-posta</p>
                  </div>
                </div>
                {profile?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{profile.phone}</p>
                      <p className="text-sm text-gray-500">Telefon</p>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setEditingSection('basic')}
                className="w-full md:w-auto"
              >
                <Settings className="h-4 w-4 mr-2" />
                Düzenle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rol Güncelleme Kartı */}
      <RoleUpdateCard />

      {/* Kullanıcı Profili (sadece user rolü için) */}
      {profile?.role === 'user' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Kişisel Bilgiler</span>
            </CardTitle>
            <CardDescription>
              Sağlık ve fitness bilgileriniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingSection === 'user' ? (
              <UserProfileForm 
                userProfile={userProfile}
                onCancel={() => setEditingSection(null)}
              />
            ) : (
              <div className="space-y-4">
                {userProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.birth_date && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{new Date(userProfile.birth_date).toLocaleDateString('tr-TR')}</p>
                          <p className="text-sm text-gray-500">Doğum Tarihi</p>
                        </div>
                      </div>
                    )}
                    {userProfile.height && (
                      <div>
                        <p className="font-medium">{userProfile.height} cm</p>
                        <p className="text-sm text-gray-500">Boy</p>
                      </div>
                    )}
                    {userProfile.weight && (
                      <div>
                        <p className="font-medium">{userProfile.weight} kg</p>
                        <p className="text-sm text-gray-500">Kilo</p>
                      </div>
                    )}
                    {userProfile.target_weight && (
                      <div>
                        <p className="font-medium">{userProfile.target_weight} kg</p>
                        <p className="text-sm text-gray-500">Hedef Kilo</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Henüz kişisel bilgiler eklenmemiş.</p>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setEditingSection('user')}
                  className="w-full md:w-auto"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {userProfile ? 'Düzenle' : 'Bilgileri Ekle'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Profesyonel Profili (dietitian ve trainer için) */}
      {(profile?.role === 'dietitian' || profile?.role === 'trainer') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Profesyonel Bilgiler</span>
            </CardTitle>
            <CardDescription>
              {profile.role === 'dietitian' ? 'Diyetisyen' : 'Spor koçu'} bilgileriniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingSection === 'professional' ? (
              <ProfessionalProfileForm 
                professionalProfile={professionalProfile}
                onCancel={() => setEditingSection(null)}
              />
            ) : (
              <div className="space-y-4">
                {professionalProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {professionalProfile.license_number && (
                      <div>
                        <p className="font-medium">{professionalProfile.license_number}</p>
                        <p className="text-sm text-gray-500">Lisans Numarası</p>
                      </div>
                    )}
                    {professionalProfile.experience_years && (
                      <div>
                        <p className="font-medium">{professionalProfile.experience_years} yıl</p>
                        <p className="text-sm text-gray-500">Deneyim</p>
                      </div>
                    )}
                    {professionalProfile.consultation_fee !== null && (
                      <div>
                        <p className="font-medium">
                          {professionalProfile.consultation_fee === 0 
                            ? 'Ücretsiz' 
                            : `₺${professionalProfile.consultation_fee}`
                          }
                        </p>
                        <p className="text-sm text-gray-500">Danışmanlık Ücreti</p>
                      </div>
                    )}
                    {professionalProfile.specializations && professionalProfile.specializations.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="font-medium mb-2">Uzmanlık Alanları:</p>
                        <div className="flex flex-wrap gap-2">
                          {professionalProfile.specializations.map((spec, index) => (
                            <Badge key={index} variant="secondary">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Henüz profesyonel bilgiler eklenmemiş.</p>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setEditingSection('professional')}
                  className="w-full md:w-auto"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {professionalProfile ? 'Düzenle' : 'Bilgileri Ekle'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
