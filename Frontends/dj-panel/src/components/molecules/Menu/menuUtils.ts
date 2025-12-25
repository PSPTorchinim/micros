import { useCallback } from 'react';
import { useAuth } from '../../../hooks/use-auth';

export function useMenuLogic() {
  const { token, user, logout } = useAuth();

  const hasPermission = useCallback(
    (permissions: string[] | undefined) => {
      const userPermissions =
        user?.roles?.flatMap((r: { permissions?: any[] | null }) =>
          (r.permissions ?? []).map((p) => p.name),
        ) || [];
      if (!permissions) return true;
      if (!userPermissions) return false;
      for (const permission of permissions) {
        if (!userPermissions.includes(permission)) return false;
      }
      return true;
    },
    [user],
  );

  const isAuthenticated = useCallback(() => {
    return token !== null && token !== undefined && token !== '';
  }, [token]);

  const handleAction = useCallback(
    (actionText: string, closeMenu?: () => void) => {
      const actionMap: Record<string, () => void> = {
        logout: () => {
          logout();
          if (closeMenu) closeMenu();
        },
      };
      const actionKey = actionText.toLowerCase();
      const actionFn = actionMap[actionKey];
      if (actionFn) {
        actionFn();
      } else {
        console.warn(`Unknown action: ${actionText}`);
      }
    },
    [logout],
  );

  return { hasPermission, isAuthenticated, handleAction };
}
