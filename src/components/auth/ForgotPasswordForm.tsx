
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const { error } = await resetPassword(data.email);
      if (error) {
        toast({
          title: 'Hata',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setEmailSent(true);
        toast({
          title: 'Email gönderildi',
          description: 'Şifre sıfırlama linki email adresinize gönderildi',
        });
      }
    } catch (error) {
      toast({
        title: 'Bir hata oluştu',
        description: 'Lütfen tekrar deneyin',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 text-lg font-semibold">
          Email gönderildi!
        </div>
        <p className="text-gray-600">
          {getValues('email')} adresine şifre sıfırlama linki gönderildi.
          Email'inizi kontrol edin ve linke tıklayarak şifrenizi sıfırlayın.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onBackToLogin}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Giriş sayfasına dön
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="ornek@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Şifre sıfırlama linki gönder
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onBackToLogin}
        className="w-full"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Giriş sayfasına dön
      </Button>
    </form>
  );
}
