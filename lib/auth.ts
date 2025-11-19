// lib/auth.ts
// NextAuth v5 Configuration - ADMIN + CUSTOMER Authentication

import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// ✅ CRITICAL: Use SERVICE ROLE KEY for auth queries
// This bypasses RLS and allows querying users/admins tables
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // SERVICE ROLE KEY
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string; // 'super_admin' | 'admin' | 'customer'
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
        loginType: { label: 'Login Type', type: 'text' }, // 'admin' | 'customer'
      },
      async authorize(credentials) {
        console.log('🔍 === LOGIN ATTEMPT ===');
        console.log('📧 Email:', credentials?.email);
        console.log('👤 Login Type:', credentials?.loginType || 'customer');

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        const loginType = credentials.loginType as string || 'customer';

        try {
          // ADMIN LOGIN
          if (loginType === 'admin') {
            console.log('👨‍💼 Checking ADMIN table...');
            const { data: admin, error } = await supabaseAdmin
              .from('admins')
              .select('*')
              .eq('email', credentials.email)
              .maybeSingle();

            console.log('👤 Admin found:', !!admin);
            if (error) console.log('❌ DB Error:', error.message);

            if (error || !admin) {
              console.log('❌ No admin found');
              return null;
            }

            // Verify password
            const isValid = await bcrypt.compare(
              credentials.password as string,
              admin.password
            );
            console.log('✅ Password valid:', isValid);

            if (!isValid) {
              console.log('❌ Invalid password');
              return null;
            }

            if (!admin.is_active) {
              console.log('❌ Account disabled');
              return null;
            }

            // Update last login
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

          // CUSTOMER LOGIN
          console.log('🛍️ Checking USERS table...');
          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .maybeSingle();

          console.log('👤 User found:', !!user);
          if (error) console.log('❌ DB Error:', error.message);

          if (error || !user) {
            console.log('❌ No user found');
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );
          console.log('✅ Password valid:', isValid);

          if (!isValid) {
            console.log('❌ Invalid password');
            return null;
          }

          // Update last login
          await supabaseAdmin
            .from('users')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', user.id);

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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 🔥 FIXED: Cookie configuration for production
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: process.env.NODE_ENV === 'production' ? '.nowiht.com' : undefined,
      },
    },
  },

  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);