'use client';

// app/providers.tsx
// NOWIHT E-Commerce - Client-Side Providers
// 🔥 CRITICAL: Includes SessionProvider for NextAuth v5

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      // 🔥 CRITICAL: Base path for NextAuth v5
      basePath="/api/auth"

      // Refetch session every 5 minutes
      refetchInterval={5 * 60}

      // Refetch on window focus
      refetchOnWindowFocus={true}

      // Refetch when browser goes online
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}