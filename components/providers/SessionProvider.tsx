'use client';

// components/providers/SessionProvider.tsx
// NextAuth v5 Session Provider for NOWIHT
// 🔥 CRITICAL: Wraps entire app to enable useSession() and signIn()

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // 🔥 FIX: Base path for NextAuth
      basePath="/api/auth"

      // 🔥 FIX: Refetch session every 5 minutes
      refetchInterval={5 * 60}

      // 🔥 FIX: Refetch on window focus
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}