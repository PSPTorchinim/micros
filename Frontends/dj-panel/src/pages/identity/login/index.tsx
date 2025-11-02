import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../../hooks/use-auth';
import { useServices } from '../../../hooks/use-services';
import { LoginForm } from '../../../components/molecules/LoginForm';

export const LoginComponent = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken, setRefreshToken } = useAuth();
  const { usersService } = useServices();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const response = await usersService.Login(email, password);
      if (response.success) {
        if (setUser) {
          setUser(response.data?.user ?? null);
          setToken(response.data?.accessToken ?? null);
          setRefreshToken(response.data?.refreshToken ?? null);
          //persist user in localStorage
          localStorage.setItem(
            'user',
            JSON.stringify(response.data?.user ?? null),
          );
          localStorage.setItem(
            'token',
            JSON.stringify(response.data?.accessToken ?? null),
          );
          localStorage.setItem(
            'refreshToken',
            JSON.stringify(response.data?.refreshToken ?? null),
          );
        }
        if (setToken) {
          setToken(response.data?.accessToken ?? null);
        }
        navigate('/dashboard');
      } else {
        setError(response.message ?? 'An error occurred.');
      }
    } catch (err: any) {
      setError(err.message ?? 'An error occurred.');
    }
  };

  return (
    <div className="content-container">
      <LoginForm onSubmit={handleSubmit} error={error} />
    </div>
  );
};
