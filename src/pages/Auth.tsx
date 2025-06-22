
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot-password';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing Link */}
        <Link 
          to="/landing" 
          className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana sayfaya dön
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NutriTrack</h1>
          </div>
          <p className="text-gray-600">Beslenme ve fitness takibiniz için</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'login' && 'Giriş Yap'}
              {mode === 'register' && 'Kayıt Ol'}
              {mode === 'forgot-password' && 'Şifre Sıfırla'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' && 'Hesabınıza giriş yapın'}
              {mode === 'register' && 'Yeni hesap oluşturun'}
              {mode === 'forgot-password' && 'Şifrenizi sıfırlamak için email adresinizi girin'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'login' && (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Giriş</TabsTrigger>
                  <TabsTrigger value="register">Kayıt</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onForgotPassword={() => setMode('forgot-password')} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm onLoginClick={() => setMode('login')} />
                </TabsContent>
              </Tabs>
            )}
            
            {mode === 'register' && (
              <RegisterForm onLoginClick={() => setMode('login')} />
            )}
            
            {mode === 'forgot-password' && (
              <ForgotPasswordForm onBackToLogin={() => setMode('login')} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
