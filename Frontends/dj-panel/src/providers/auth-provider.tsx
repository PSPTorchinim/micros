import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { AuthContext } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import {
  GetUserDTO,
  microservicesClient,
  LoginResponseDTO,
} from '../models/api';

type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<GetUserDTO | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('refreshToken');
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  useLayoutEffect(() => {
    const refreshInterceptor =
      microservicesClient.identity.instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (originalRequest.headers['Skip-Interceptor']) {
            return Promise.reject(error);
          }

          if (originalRequest._retry) {
            return Promise.reject(error);
          }

          if (error.response?.status === 401 && refreshToken) {
            originalRequest._retry = true;
            try {
              const response =
                await microservicesClient.identity.users.apiV1UsersRefreshTokenList();

              const {
                user,
                accessToken,
                refreshToken: newRefreshToken,
              } = response.data as LoginResponseDTO;

              setUser(user ?? null);
              setToken(accessToken ?? null);
              setRefreshToken(newRefreshToken ?? null);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return microservicesClient.identity.instance(originalRequest);
            } catch (refreshError) {
              logout();
              return Promise.reject(refreshError);
            }
          }

          return Promise.reject(error);
        },
      );

    return () => {
      microservicesClient.identity.instance.interceptors.response.eject(
        refreshInterceptor,
      );
    };
  }, [refreshToken]);

  useLayoutEffect(() => {
    const authInterceptor =
      microservicesClient.identity.instance.interceptors.request.use(
        (config: any) => {
          config.headers.Authorization =
            !config._retry && token
              ? `Bearer ${token}`
              : config.headers.Authorization;
          return config;
        },
      );

    return () => {
      microservicesClient.identity.instance.interceptors.request.eject(
        authInterceptor,
      );
    };
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    navigate('/users/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        setUser,
        setToken,
        setRefreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
