
"use client";

import { usePathname } from 'next/navigation';
import LoginLayout from './login/layout';
import AuthenticatedLayout from './AuthenticatedLayout';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith('/login')) {
    return (
      <html lang="en">
        <body>
          <LoginLayout>
            {children}
          </LoginLayout>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <AuthenticatedLayout>
          {children}
        </AuthenticatedLayout>
      </body>
    </html>
  );
}