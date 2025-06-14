
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type ProfessionalProfile = Database['public']['Tables']['professional_profiles']['Row'];

export interface FullUserProfile {
  profile: Profile | null;
  userProfile: UserProfile | null;
  professionalProfile: ProfessionalProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(): FullUserProfile {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [professionalProfile, setProfessionalProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setUserProfile(null);
      setProfessionalProfile(null);
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setError('Profil bilgileri alınamadı');
          return;
        }

        setProfile(profileData);

        if (!profileData) {
          return;
        }

        // Fetch user profile if exists
        const { data: userProfileData, error: userProfileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('profile_id', profileData.id)
          .maybeSingle();

        if (userProfileError && userProfileError.code !== 'PGRST116') {
          console.error('User profile fetch error:', userProfileError);
        } else {
          setUserProfile(userProfileData);
        }

        // Fetch professional profile if user is a professional
        if (profileData.role === 'dietitian' || profileData.role === 'trainer') {
          const { data: professionalData, error: professionalError } = await supabase
            .from('professional_profiles')
            .select('*')
            .eq('profile_id', profileData.id)
            .maybeSingle();

          if (professionalError && professionalError.code !== 'PGRST116') {
            console.error('Professional profile fetch error:', professionalError);
          } else {
            setProfessionalProfile(professionalData);
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
        setError('Beklenmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  return {
    profile,
    userProfile,
    professionalProfile,
    loading,
    error
  };
}
