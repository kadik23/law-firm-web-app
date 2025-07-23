"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const AuthContent = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();
  return (
    <>
      {loading &&<div className="inset-0 bg-black/70 fixed top-0 z-[9999999999]"><LoadingSpinner /></div> }
      {children}
    </>
  );
};

const AuthClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  );
};

export default AuthClientWrapper;
