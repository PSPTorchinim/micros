import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import { useServices } from '../../../hooks/use-services/use-services';
import type { LoginBlock as LoginBlockType } from '../../../models/api/strapi/apiMap';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './index.css';

export const LoginBlock: React.FC<LoginBlockType> = ({
  title = 'Login',
  emailLabel = 'Email',
  passwordLabel = 'Password',
  submitButtonText = 'Login',
  forgotPasswordText = 'Forgot your password?',
  resetPasswordLinkText = 'Reset Password',
  emailPlaceholder = 'Enter your email',
  passwordPlaceholder = 'Enter your password',
  customStyles = {},
  redirectPath = '/dashboard',
  forgotPasswordUrl = '/users/forgot-password',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken, setRefreshToken } = useAuth();
  const { usersService } = useServices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await usersService.Login(email, password);
      if (response.success) {
        setUser(response.data?.user ?? null);
        setToken(response.data?.accessToken ?? null);
        setRefreshToken(response.data?.refreshToken ?? null);

        // Persist user in localStorage
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

        void navigate(redirectPath);
      } else {
        setError(response.message ?? 'An error occurred.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-block-container" style={customStyles}>
      <form className="login-block-form" onSubmit={handleSubmit}>
        <h1 className="login-block-title">{title}</h1>
        <Input
          label={emailLabel}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          fullWidth
          required
        />
        <Input
          label={passwordLabel}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={passwordPlaceholder}
          fullWidth
          required
        />
        {error && <p className="login-block-error">{error}</p>}
        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Logging in...' : submitButtonText}
        </Button>
        <p className="login-block-forgot">
          {forgotPasswordText}{' '}
          <Link to={forgotPasswordUrl} className="login-block-link">
            {resetPasswordLinkText}
          </Link>
        </p>
      </form>
    </div>
  );
};
