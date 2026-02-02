import { createContext } from 'react';
import { GetUserDTO } from '../models/api/identity/apiMap';

export type AuthContextData = {
  user?: GetUserDTO | null;
  token?: string | null;
  refreshToken?: string | null;
  setUser: (user: GetUserDTO | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

