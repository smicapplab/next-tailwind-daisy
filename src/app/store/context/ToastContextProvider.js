"use client";

import { createContext, useEffect, useState } from "react";
export const ToastContext = createContext();

export const ToastType = {
  success: "success",
  warning: "warning",
  info: "info",
  error: "error",
};

const getIcon = (type) => {
  switch (type) {
    case ToastType.success:
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      );
    case ToastType.warning:
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      );
    case ToastType.info:
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      );
    case ToastType.error:
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      );
    default:
      return (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z" />
      );
  }
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              {getIcon(toast.type)}
            </svg>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
