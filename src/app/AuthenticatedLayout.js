"use client";

import Drawer from "./components/Drawer";
import NavBar from "./components/NavBar";
import { ToastProvider } from "./store/context/ToastContextProvider";
import { UserProvider } from "./store/context/UserContextProvider";

export default function AuthenticatedLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <NavBar />
          <Drawer />
          <ToastProvider>{children}</ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
