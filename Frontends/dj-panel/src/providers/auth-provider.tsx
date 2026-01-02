import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { AuthContext } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { microservicesClient } from '../models/api';
import { GetUserDTO, LoginResponseDTO } from '../models/api/identity/apiMap';

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
    // Add refresh interceptor to all microservices
    const services = [
      microservicesClient.brand,
      microservicesClient.documents,
      microservicesClient.gear,
      microservicesClient.identity,
      microservicesClient.mailing,
      microservicesClient.music,
      microservicesClient.party,
      microservicesClient.strapi,
    ];

    const refreshInterceptors = services.map((service) => {
      return service.instance.interceptors.response.use(
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
              return service.instance(originalRequest);
            } catch (refreshError) {
              logout();
              return Promise.reject(refreshError);
            }
          }

          return Promise.reject(error);
        },
      );
    });

    return () => {
      services.forEach((service, index) => {
        service.instance.interceptors.response.eject(refreshInterceptors[index]);
      });
    };
  }, [refreshToken]);

  useLayoutEffect(() => {
    // Add authorization interceptor to all microservices
    const services = [
      microservicesClient.brand,
      microservicesClient.documents,
      microservicesClient.gear,
      microservicesClient.identity,
      microservicesClient.mailing,
      microservicesClient.music,
      microservicesClient.party,
      microservicesClient.strapi,
    ];

    const authInterceptors = services.map((service) => {
      return service.instance.interceptors.request.use(
        (config: any) => {
          config.headers.Authorization =
            !config._retry && token
              ? `Bearer ${token}`
              : config.headers.Authorization;
          return config;
        },
      );
    });

    return () => {
      services.forEach((service, index) => {
        service.instance.interceptors.request.eject(authInterceptors[index]);
      });
    };
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    navigate('/login');
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
