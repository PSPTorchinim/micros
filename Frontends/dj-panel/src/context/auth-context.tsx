// filepath: c:\Projects\Private\Micros\Frontends\dj-panel\src\context\auth-context.tsx
import { createContext } from 'react';
import { GetUserDTO } from '../models/get-user-dto';

export type AuthContextData = {
  user?: GetUserDTO | null;
  token?: string | null;
  refreshToken?: string | null;
  setUser: (user: GetUserDTO | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextData | undefined>(undefined);