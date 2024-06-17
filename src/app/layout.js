import "./globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "./store/context/ToastContextProvider";
import { UserProvider } from "./store/context/UserContextProvider";

const inter = Inter({ subsets: ["latin-ext"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <UserProvider>{children}</UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
