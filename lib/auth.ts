// lib/auth.ts
// NextAuth v5 Configuration - FINAL FIX

import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        loginType: { label: 'Login Type', type: 'text' },
      },
      async authorize(credentials) {
        console.log('🔍 LOGIN ATTEMPT:', credentials?.email, credentials?.loginType);

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const loginType = credentials.loginType as string || 'customer';

        try {
          if (loginType === 'admin') {
            const { data: admin, error } = await supabaseAdmin
              .from('admins')
              .select('*')
              .eq('email', credentials.email)
              .maybeSingle();

            if (error || !admin) return null;

            const isValid = await bcrypt.compare(
              credentials.password as string,
              admin.password
            );

            if (!isValid || !admin.is_active) return null;

            await supabaseAdmin
              .from('admins')
              .update({ last_login: new Date().toISOString() })
              .eq('id', admin.id);

            console.log('✅ Admin login successful!');
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role,
              image: admin.avatar_url || null,
            };
          }

          // Customer login
          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .maybeSingle();

          if (error || !user) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) return null;

          console.log('✅ Customer login successful!');
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role || 'customer',
            image: user.image || null,
          };
        } catch (error) {
          console.error('🚨 Auth error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  // 🔥 CRITICAL FIX: Use default cookie name (no __Secure- prefix)
  // This allows getToken() to work without additional config
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);