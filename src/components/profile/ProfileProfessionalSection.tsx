
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfessionalProfileForm } from "./ProfessionalProfileForm";
import { Briefcase, Settings } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfessionalProfile = Database['public']['Tables']['professional_profiles']['Row'];

interface ProfileProfessionalSectionProps {
  profile: Profile;
  professionalProfile: ProfessionalProfile | null;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

export function ProfileProfessionalSection({ 
  profile, 
  professionalProfile, 
  isEditing, 
  onEdit, 
  onCancelEdit 
}: ProfileProfessionalSectionProps) {
  return (
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
        {isEditing ? (
          <ProfessionalProfileForm 
            professionalProfile={professionalProfile}
            onCancel={onCancelEdit}
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
              onClick={onEdit}
              className="w-full md:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              {professionalProfile ? 'Düzenle' : 'Bilgileri Ekle'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
