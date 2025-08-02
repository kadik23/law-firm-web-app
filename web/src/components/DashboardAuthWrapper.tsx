"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface DashboardAuthWrapperProps {
  children: React.ReactNode;
  requiredType: 'admin' | 'client' | 'attorney';
}

export default function DashboardAuthWrapper({ children, requiredType }: DashboardAuthWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to /');
        router.push('/');
        return;
      }

      if (user.type !== requiredType) {
        console.log(`User type ${user.type} not allowed for ${requiredType} dashboard, redirecting to /`);
        router.push('/');
        return;
      }

      console.log(`User authenticated and authorized for ${requiredType} dashboard`);
    }
  }, [user, loading, requiredType, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (user.type !== requiredType) {
    return null;
  }

  return <>{children}</>;
} 