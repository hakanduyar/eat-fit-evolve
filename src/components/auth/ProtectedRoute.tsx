
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'dietitian' | 'trainer';
  requiresApproval?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiresApproval = false 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check user's role
  if (requiredRole && profile) {
    if (profile.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Erişim Reddedildi
            </h2>
            <p className="text-gray-600">
              Bu sayfaya erişim için {requiredRole} rolüne sahip olmanız gerekiyor.
            </p>
          </div>
        </div>
      );
    }
  }

  // Show loading if profile is still being fetched
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
