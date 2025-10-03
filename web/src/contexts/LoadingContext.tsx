"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createContext, ReactNode, useState } from "react";

export const LoadingContext = createContext<LoadingContextType>(
    {} as LoadingContextType
);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="inset-0 bg-black/70 fixed top-0 z-[9999999999]">
          <LoadingSpinner />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
