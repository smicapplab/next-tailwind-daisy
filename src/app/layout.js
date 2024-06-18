"use client";

import "./globals.css";
import { ToastProvider } from "./store/context/ToastContextProvider";
import { UserProvider } from "./store/context/UserContextProvider";
import NavBar from "./components/NavBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <UserProvider>
            <NavBar/>{children}
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
