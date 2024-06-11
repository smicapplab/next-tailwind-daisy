"use client";

import { createContext, useEffect, useState } from "react";
export const ToastContext = createContext();

export const ToastType = {
  success: "success",
  warning: "warning",
  info: "info",
  error: "error",
};

const getAlignmentClass = ({ horizontal, vertical }) => {
  const horizontalAlignment = horizontal || "center";
  const verticalAlignment = vertical || "top";

  const horizontalClass =
    horizontalAlignment === "left"
      ? "toast-start"
      : horizontalAlignment === "right"
      ? "toast-end"
      : "toast-center";

  const verticalClass =
    verticalAlignment === "top"
      ? "toast-top"
      : verticalAlignment === "bottom"
      ? "toast-bottom"
      : "toast-middle";

  return `${verticalClass} ${horizontalClass}`;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const timers = toasts.map((toast) =>
        setTimeout(() => removeToast(toast.id), 5000)
      );

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [toasts, isMounted]);

  const addToast = (props) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { ...props, id }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        className={`toast ${getAlignmentClass({
          horizontal: "center",
          vertical: "top",
        })}`}
      >
        {toasts.map((toast) => (
          <div className={`alert alert-${toast.type || "info"}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
