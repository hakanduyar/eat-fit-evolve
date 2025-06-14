
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRoleUpdate() {
  const [loading, setLoading] = useState(false);
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const updateUserRole = async (newRole: 'user' | 'dietitian' | 'trainer') => {
    if (!profile) {
      toast({
        title: 'Hata',
        description: 'Profil bilgisi bulunamadı',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profile.id);

      if (error) {
        console.error('Rol güncelleme hatası:', error);
        toast({
          title: 'Hata',
          description: 'Rol güncellenemedi',
          variant: 'destructive'
        });
        return;
      }

      await refreshProfile();
      toast({
        title: 'Başarılı',
        description: `Rol ${newRole === 'user' ? 'Kullanıcı' : newRole === 'dietitian' ? 'Diyetisyen' : 'Spor Koçu'} olarak güncellendi`,
      });
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      toast({
        title: 'Hata',
        description: 'Beklenmeyen bir hata oluştu',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateUserRole, loading };
}
