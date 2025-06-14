
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfileForm } from "./UserProfileForm";
import { User, Settings, Calendar } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface ProfileUserSectionProps {
  userProfile: UserProfile | null;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

export function ProfileUserSection({ userProfile, isEditing, onEdit, onCancelEdit }: ProfileUserSectionProps) {
  return (
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
        {isEditing ? (
          <UserProfileForm 
            userProfile={userProfile}
            onCancel={onCancelEdit}
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
              onClick={onEdit}
              className="w-full md:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              {userProfile ? 'Düzenle' : 'Bilgileri Ekle'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
