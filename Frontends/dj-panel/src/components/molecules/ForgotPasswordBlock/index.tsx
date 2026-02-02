import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsersService } from '../../../services/users-service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './index.css';
import type { ForgotPasswordBlock as ForgotPasswordBlockType } from '../../../models/api/strapi/apiMap';

export const ForgotPasswordBlock: React.FC<ForgotPasswordBlockType> = ({
  title = 'Forgot Password',
  description = 'Enter your email address to reset your password.',
  emailLabel = 'Email',
  submitButtonText = 'Send Reset Link',
  backToLoginText = 'Remembered your password?',
  loginLinkText = 'Login',
  emailPlaceholder = 'Enter your email',
  successRedirectPath = '/users/login',
  loginUrl = '/users/login',
  customStyles = {},
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await UsersService.forgotPassword(email);
      if (response.success) {
        void navigate(successRedirectPath);
      } else {
        setError(response.message || 'Failed to send password reset link.');
      }
    } catch {
      setError('Failed to send password reset link. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-block-container" style={customStyles}>
      <form className="forgot-password-block-form" onSubmit={handleSubmit}>
        <h1 className="forgot-password-block-title">{title}</h1>
        <p className="forgot-password-block-description">{description}</p>
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
        {error && <p className="forgot-password-block-error">{error}</p>}
        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Sending...' : submitButtonText}
        </Button>
        <p className="forgot-password-block-login">
          {backToLoginText}{' '}
          <Link to={loginUrl} className="forgot-password-block-link">
            {loginLinkText}
          </Link>
        </p>
      </form>
    </div>
  );
};
