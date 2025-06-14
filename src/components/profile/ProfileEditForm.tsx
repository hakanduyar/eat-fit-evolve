
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfileForm } from './UserProfileForm';
import { ProfessionalProfileForm } from './ProfessionalProfileForm';

interface ProfileEditFormProps {
  onCancel?: () => void;
}

export function ProfileEditForm({ onCancel }: ProfileEditFormProps) {
  const { profile } = useAuth();
  const { userProfile, professionalProfile, loading } = useUserProfile();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {profile?.role === 'user' && (
        <UserProfileForm userProfile={userProfile} />
      )}

      {(profile?.role === 'dietitian' || profile?.role === 'trainer') && (
        <ProfessionalProfileForm professionalProfile={professionalProfile} />
      )}
    </div>
  );
}
