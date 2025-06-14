
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileEditForm } from "./ProfileEditForm";
import { User, Settings, Briefcase, UserCircle, Phone, Mail, Activity } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileBasicInfoProps {
  profile: Profile;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

export function ProfileBasicInfo({ profile, isEditing, onEdit, onCancelEdit }: ProfileBasicInfoProps) {
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
        {isEditing ? (
          <ProfileEditForm onCancel={onCancelEdit} />
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
              onClick={onEdit}
              className="w-full md:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
