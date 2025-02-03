"use client";

import { AuthProvider } from "@/contexts/AuthContext";

const AuthClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthClientWrapper;
