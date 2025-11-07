import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './ForgotPasswordForm.css';

export interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  error?: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  error,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="forgot-password-form" onSubmit={handleSubmit}>
      <h1 className="forgot-password-form-title">Forgot Password</h1>
      <p className="forgot-password-form-description">
        Enter your email address to reset your password.
      </p>
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
      {error && <p className="forgot-password-form-error">{error}</p>}
      <Button type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <p className="forgot-password-form-login">
        Remembered your password?{' '}
        <a href="#/users/login" className="forgot-password-form-link">
          Login
        </a>
      </p>
    </form>
  );
};
