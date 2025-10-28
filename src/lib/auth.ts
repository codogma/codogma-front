import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AuthDTO } from '@/types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: 'User ID', type: 'text' },
        name: { label: 'Username', type: 'text' },
        email: { label: 'Email', type: 'text' },
        image: { label: 'Image', type: 'text' },
        role: { label: 'Role', type: 'text' },
        expires: { label: 'Token expires at', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials) {
          return {
            id: String(credentials.id),
            name: String(credentials.name),
            email: String(credentials.email),
            image: String(credentials.image),
            role: String(credentials.role),
            expires: String(credentials.expires),
          } as AuthDTO;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token = {
          ...user,
        };
      }

      if (trigger === 'update') {
        return {
          ...token,
          ...session?.user,
        };
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        if (session.user) {
          session.user = {
            ...token,
          };
        }
        session.expires = token.expires;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});
