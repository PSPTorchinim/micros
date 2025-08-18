import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { UsersService } from '../../../services/users-service';
import { useAuth } from '../../../hooks/use-auth';

export const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken, setRefreshToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await UsersService.Login(email, password);
      if (response.success) {
        console.log('Login successful');
        if (setUser){
          console.log('Setting user:', response.data?.user);
          setUser(response.data?.user ?? null); // Check if setUser is defined
          setToken(response.data?.accessToken ?? null); // Check if setToken is defined
          setRefreshToken(response.data?.refreshToken ?? null); // Check if setToken is defined
          //persist user in localStorage
          localStorage.setItem('user', JSON.stringify(response.data?.user ?? null));
          localStorage.setItem('token', JSON.stringify(response.data?.accessToken ?? null));
          localStorage.setItem('refreshToken', JSON.stringify(response.data?.refreshToken ?? null));
        }
        if (setToken){
          console.log('Setting token:', response.data?.accessToken);
          setToken(response.data?.accessToken ?? null); // Check if setToken is defined
        }
        navigate('/dashboard');
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="content-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          Forgot your password?{' '}
          <a href="/users/forgot-password" className="hover:underline">
            Reset Password
          </a>
        </p>
      </form>
    </div>
  );
};