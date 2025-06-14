
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type ProfessionalProfile = Database['public']['Tables']['professional_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
type ProfessionalProfileInsert = Database['public']['Tables']['professional_profiles']['Insert'];
type ProfessionalProfileUpdate = Database['public']['Tables']['professional_profiles']['Update'];

export function useProfileManager() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserProfile = async (userData: Omit<UserProfileInsert, 'profile_id'>) => {
    if (!user || !profile) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          ...userData,
          profile_id: profile.id
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        setError('Kullanıcı profili oluşturulamadı');
        return { error: 'Kullanıcı profili oluşturulamadı' };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating user profile:', err);
      setError('Beklenmeyen bir hata oluştu');
      return { error: 'Beklenmeyen bir hata oluştu' };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: UserProfileUpdate) => {
    if (!user || !profile) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('profile_id', profile.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        setError('Kullanıcı profili güncellenemedi');
        return { error: 'Kullanıcı profili güncellenemedi' };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error updating user profile:', err);
      setError('Beklenmeyen bir hata oluştu');
      return { error: 'Beklenmeyen bir hata oluştu' };
    } finally {
      setLoading(false);
    }
  };

  const createProfessionalProfile = async (professionalData: Omit<ProfessionalProfileInsert, 'profile_id'>) => {
    if (!user || !profile) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('professional_profiles')
        .insert({
          ...professionalData,
          profile_id: profile.id
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating professional profile:', insertError);
        setError('Profesyonel profil oluşturulamadı');
        return { error: 'Profesyonel profil oluşturulamadı' };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating professional profile:', err);
      setError('Beklenmeyen bir hata oluştu');
      return { error: 'Beklenmeyen bir hata oluştu' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfessionalProfile = async (updates: ProfessionalProfileUpdate) => {
    if (!user || !profile) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('professional_profiles')
        .update(updates)
        .eq('profile_id', profile.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating professional profile:', updateError);
        setError('Profesyonel profil güncellenemedi');
        return { error: 'Profesyonel profil güncellenemedi' };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error updating professional profile:', err);
      setError('Beklenmeyen bir hata oluştu');
      return { error: 'Beklenmeyen bir hata oluştu' };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createUserProfile,
    updateUserProfile,
    createProfessionalProfile,
    updateProfessionalProfile
  };
}
