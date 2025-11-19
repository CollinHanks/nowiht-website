// lib/auth.ts
// NOWIHT Admin Authentication - NextAuth v5
// 🔥 FIXED: TypeScript module augmentation error

import NextAuth, { DefaultSession } from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// ============================================
// SUPABASE ADMIN CLIENT
// ============================================
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

// ============================================
// TYPE DECLARATIONS (FIXED)
// ============================================
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string | null;
  }

  interface JWT {
    id: string;
    role: string;
  }
}

// ============================================
// AUTH CONFIGURATION
// ============================================
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'kursat@nowiht.com'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '••••••••'
        },
        loginType: {
          label: 'Login Type',
          type: 'text'
        },
      },

      async authorize(credentials) {
        console.log('🔐 [AUTH] Authorization attempt:', {
          email: credentials?.email,
          loginType: credentials?.loginType
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [AUTH] Missing credentials');
          throw new Error('Email and password are required');
        }

        const loginType = credentials.loginType as string || 'customer';

        try {
          // ============================================
          // ADMIN LOGIN
          // ============================================
          if (loginType === 'admin') {
            console.log('🔑 [AUTH] Admin login attempt');

            const { data: admin, error } = await supabaseAdmin
              .from('admins')
              .select('*')
              .eq('email', credentials.email)
              .maybeSingle();

            if (error) {
              console.error('❌ [AUTH] Supabase error:', error);
              throw new Error('Database error');
            }

            if (!admin) {
              console.log('❌ [AUTH] Admin not found');
              throw new Error('Invalid credentials');
            }

            const isValid = await bcrypt.compare(
              credentials.password as string,
              admin.password
            );

            if (!isValid) {
              console.log('❌ [AUTH] Invalid password');
              throw new Error('Invalid credentials');
            }

            if (!admin.is_active) {
              console.log('❌ [AUTH] Admin account inactive');
              throw new Error('Account is inactive');
            }

            await supabaseAdmin
              .from('admins')
              .update({ last_login: new Date().toISOString() })
              .eq('id', admin.id);

            console.log('✅ [AUTH] Admin login successful:', admin.email);

            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role,
              image: admin.avatar_url || null,
            };
          }

          // ============================================
          // CUSTOMER LOGIN
          // ============================================
          console.log('🔑 [AUTH] Customer login attempt');

          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .maybeSingle();

          if (error) {
            console.error('❌ [AUTH] Supabase error:', error);
            throw new Error('Database error');
          }

          if (!user) {
            console.log('❌ [AUTH] User not found');
            throw new Error('Invalid credentials');
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            console.log('❌ [AUTH] Invalid password');
            throw new Error('Invalid credentials');
          }

          console.log('✅ [AUTH] Customer login successful:', user.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role || 'customer',
            image: user.image || null,
          };

        } catch (error) {
          console.error('❌ [AUTH] Authorization error:', error);

          if (error instanceof Error) {
            throw error;
          }

          throw new Error('Authentication failed');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log('🎫 [AUTH] JWT callback:', {
        trigger,
        hasUser: !!user,
        tokenRole: token.role
      });

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      console.log('📋 [AUTH] Session callback:', {
        hasSession: !!session,
        tokenRole: token.role
      });

      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | null;
      }

      return session;
    },

    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      console.log('🔍 [AUTH] Authorized check:', {
        pathname,
        hasAuth: !!auth,
        role: auth?.user?.role
      });

      return !!auth;
    },
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
    signOut: '/admin/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
};

// ============================================
// EXPORT NEXTAUTH HANDLERS
// ============================================
export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth(authConfig);

// ============================================
// HELPER FUNCTIONS
// ============================================
export async function getSession() {
  try {
    return await auth();
  } catch (error) {
    console.error('❌ [AUTH] Failed to get session:', error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    console.error('❌ [AUTH] Failed to get current user:', error);
    return null;
  }
}

export async function isAdmin() {
  try {
    const session = await auth();
    return session?.user?.role === 'admin' || session?.user?.role === 'super_admin';
  } catch (error) {
    console.error('❌ [AUTH] Failed to check admin status:', error);
    return false;
  }
}

export async function isSuperAdmin() {
  try {
    const session = await auth();
    return session?.user?.role === 'super_admin';
  } catch (error) {
    console.error('❌ [AUTH] Failed to check super admin status:', error);
    return false;
  }
}

console.log('✅ [AUTH] NextAuth v5 configuration loaded');