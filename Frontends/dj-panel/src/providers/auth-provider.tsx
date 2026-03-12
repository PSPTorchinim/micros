import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { microservicesClient } from '../models/api';
import { GetUserDTO, LoginResponseDTO, LoginResponseDTOResponse } from '../models/api/identity/apiMap';

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

  // Token refresh promise to prevent concurrent refresh attempts
  const refreshPromiseRef = React.useRef<Promise<string | null> | null>(null);

  // All microservices that require authentication
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
              // If a refresh is already in progress, wait for it
              refreshPromiseRef.current ??= (async () => {
                try {
                  const response =
                    await microservicesClient.identity.users.v1UsersRefreshTokenList();

                  const loginData = (response.data as LoginResponseDTOResponse).data as LoginResponseDTO;

                  const {
                    user,
                    accessToken,
                    refreshToken: newRefreshToken,
                  } = loginData;

                  setUser(user ?? null);
                  setToken(accessToken ?? null);
                  setRefreshToken(newRefreshToken ?? null);

                  return accessToken ?? null;
                } catch (refreshError) {
                  logout();
                  throw refreshError;
                } finally {
                  refreshPromiseRef.current = null;
                }
              })();

              // Wait for the refresh to complete
              const newAccessToken = await refreshPromiseRef.current;

              if (newAccessToken) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return service.instance(originalRequest);
              } else {
                return Promise.reject(error);
              }
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }

          return Promise.reject(error);
        },
      );
    });

    return () => {
      services.forEach((service, index) => {
        service.instance.interceptors.response.eject(
          refreshInterceptors[index],
        );
      });
    };
  }, [refreshToken]);

  useLayoutEffect(() => {
    // Add authorization interceptor to all microservices
    const authInterceptors = services.map((service) => {
      return service.instance.interceptors.request.use((config: any) => {
        config.headers.Authorization =
          !config._retry && token
            ? `Bearer ${token}`
            : config.headers.Authorization;
        return config;
      });
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
    void navigate('/login');
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
