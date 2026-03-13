import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './LoginForm.css';

export interface LoginFormProps {
  onSubmit: (_email: string, _password: string) => Promise<void>;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(emailInput, passwordInput);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-form-title">Login</h1>
      <Input
        label="Email"
        type="email"
        id="email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        placeholder="Enter your email"
        fullWidth
        required
      />
      <Input
        label="Password"
        type="password"
        id="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        placeholder="Enter your password"
        fullWidth
        required
      />
      {error && <p className="login-form-error">{error}</p>}
      <Button type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
      <p className="login-form-forgot">
        Forgot your password?{' '}
        <Link to="/users/forgot-password" className="login-form-link">
          Reset Password
        </Link>
      </p>
    </form>
  );
};
