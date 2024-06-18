"use client";
import "../globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider } from "../store/context/ToastContextProvider";
import { UserProvider } from "../store/context/UserContextProvider";

export default function LoginLayout({ children }) {
  return (
    <ToastProvider>
      <UserProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          {children}
        </GoogleOAuthProvider>
      </UserProvider>
    </ToastProvider>
  );
}
