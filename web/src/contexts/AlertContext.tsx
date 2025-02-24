"use client"
import { Alert } from "@/components/alert";
import { createContext, ReactNode, useContext, useState } from "react";

type AlertContextType = {
  showAlert: (type: string, title: string, message: string) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);

  const showAlert = (type: string, title: string, message: string) => {
    setAlert({ type, title, message });
    setTimeout(() => setAlert(null), 4000); // Hide after 4 seconds
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert alertType={alert.type} alertTitle={alert.title} alertMessage={alert.message} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
