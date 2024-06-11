"use client";

import { createContext, useEffect, useState } from "react";
export const ToastContext = createContext();

export const ToastType = {
  success: "success",
  warning: "warning",
  info: "info",
  error: "error",
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(null), 5000);
    }
  }, [toast]);

  const addToast = (props) => {
    setToast(props);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>New mail arrived.</span>
          </div>
          <div className="alert alert-success">
            <span>Message sent successfully.</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
