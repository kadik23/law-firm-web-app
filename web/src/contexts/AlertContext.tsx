"use client";
import { Alert } from "@/components/alert";
import { createContext, ReactNode, useContext, useState, useCallback } from "react";

type AlertContextType = {
  showAlert: (type: string, title: string, message: string) => void;
  closeAlert: () => void; 
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);

  const showAlert = (type: string, title: string, message: string) => {
    setAlert({ type, title, message });

    // Auto-hide after 20 seconds
    setTimeout(() => setAlert(null), 20000);
  };

  const closeAlert = useCallback(() => setAlert(null), []);

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      {alert && (
        <Alert
          alertType={alert.type}
          alertTitle={alert.title}
          alertMessage={alert.message}
          onClose={closeAlert} 
        />
      )}
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
