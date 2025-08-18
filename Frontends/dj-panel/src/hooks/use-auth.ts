// filepath: c:\Projects\Private\Micros\Frontends\dj-panel\src\hooks\use-auth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};