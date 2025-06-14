
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfileUserSection } from "./ProfileUserSection";
import { ProfileProfessionalSection } from "./ProfileProfessionalSection";
import { RoleUpdateCard } from "./RoleUpdateCard";

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

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Profil bilgisi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileBasicInfo
        profile={profile}
        isEditing={editingSection === 'basic'}
        onEdit={() => setEditingSection('basic')}
        onCancelEdit={() => setEditingSection(null)}
      />

      <RoleUpdateCard />

      {profile.role === 'user' && (
        <ProfileUserSection
          userProfile={userProfile}
          isEditing={editingSection === 'user'}
          onEdit={() => setEditingSection('user')}
          onCancelEdit={() => setEditingSection(null)}
        />
      )}

      {(profile.role === 'dietitian' || profile.role === 'trainer') && (
        <ProfileProfessionalSection
          profile={profile}
          professionalProfile={professionalProfile}
          isEditing={editingSection === 'professional'}
          onEdit={() => setEditingSection('professional')}
          onCancelEdit={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}
