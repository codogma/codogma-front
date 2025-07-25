import { type DefaultSession } from 'next-auth';
import { type User as DefaultUser } from 'next-auth/adapters';
import { JWT as DefaultJWT } from 'next-auth/jwt';

import { UserRole } from '@/types/index';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: UserRole;
    expires: string;
  }

  interface Session extends DefaultSession {
    user: {
      role: UserRole;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: DefaultUser['id'];
    name?: DefaultUser['name'];
    email?: DefaultUser['email'];
    role: UserRole;
    image?: DefaultUser['image'];
    expires: string;
  }
}
