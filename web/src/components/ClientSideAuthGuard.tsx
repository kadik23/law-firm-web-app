"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ClientSideAuthGuardProps {
  children: React.ReactNode;
  requiredType: 'admin' | 'client' | 'attorney';
}

export default function ClientSideAuthGuard({ children, requiredType }: ClientSideAuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log(`🔍 ClientSideAuthGuard Debug:`, {
      loading,
      hasUser: !!user,
      userType: user?.type,
      requiredType,
      url: window.location.pathname
    });

    if (!loading) {
      if (!user) {
        console.log('❌ No user found, redirecting to /');
        router.push('/');
        return;
      }

      if (user.type !== requiredType) {
        console.log(`❌ User type ${user.type} not allowed for ${requiredType} dashboard, redirecting to /`);
        router.push('/');
        return;
      }

      console.log(`✅ User authenticated and authorized for ${requiredType} dashboard`);
      setIsAuthorized(true);
    }
  }, [user, loading, requiredType, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Checking authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 