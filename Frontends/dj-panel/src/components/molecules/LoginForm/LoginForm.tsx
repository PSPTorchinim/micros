import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './LoginForm.css';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(email, password);
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        fullWidth
        required
      />
      <Input
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        <a href="#/users/forgot-password" className="login-form-link">
          Reset Password
        </a>
      </p>
    </form>
  );
};
