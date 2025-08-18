import React, { PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { LoginResponseDTO } from '../models/login-response-dto';
import { api, GET } from '../utils/api';
import { GetUserDTO } from '../models/get-user-dto';
import { useNavigate } from 'react-router-dom';

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
    const refreshInterceptor = api.interceptors.response.use(
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
            const response = await GET<LoginResponseDTO>(
              '/identity/api/v1/users/refreshToken',
              true
            );
  
            const { user, accessToken, refreshToken: newRefreshToken } = response.data;
  
            setUser(user);
            setToken(accessToken);
            setRefreshToken(newRefreshToken);
  
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
  
        return Promise.reject(error);
      }
    );
  
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [refreshToken]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config: any) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    navigate('/users/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, setUser, setToken, setRefreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};