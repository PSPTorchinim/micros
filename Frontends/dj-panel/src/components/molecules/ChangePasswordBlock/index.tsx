import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import { UsersService } from '../../../services/users-service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './index.css';

export interface ChangePasswordBlock {
  title?: string;
  description?: string;
  oldPasswordLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  submitButtonText?: string;
  oldPasswordPlaceholder?: string;
  newPasswordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  successRedirectPath?: string;
  customStyles?: Record<string, unknown>;
}

export const ChangePasswordBlock: React.FC<ChangePasswordBlock> = ({
  title = 'Change Password',
  description = 'Update your password to keep your account secure.',
  oldPasswordLabel = 'Current Password',
  newPasswordLabel = 'New Password',
  confirmPasswordLabel = 'Confirm New Password',
  submitButtonText = 'Change Password',
  oldPasswordPlaceholder = 'Enter your current password',
  newPasswordPlaceholder = 'Enter your new password',
  confirmPasswordPlaceholder = 'Confirm your new password',
  successRedirectPath = '/dashboard',
  customStyles = {},
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setError('You must be logged in to change your password.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await UsersService.changePassword(
        oldPassword,
        newPassword,
      );
      if (response.success) {
        setSuccess('Password changed successfully!');
        // Clear form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Redirect after a short delay
        setTimeout(() => {
          navigate(successRedirectPath);
        }, 1500);
      } else {
        setError(response.message || 'Failed to change password.');
      }
    } catch (err: unknown) {
      setError('Failed to change password. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-password-block-container" style={customStyles}>
      <form className="change-password-block-form" onSubmit={handleSubmit}>
        <h1 className="change-password-block-title">{title}</h1>
        <p className="change-password-block-description">{description}</p>
        <Input
          label={oldPasswordLabel}
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder={oldPasswordPlaceholder}
          fullWidth
          required
        />
        <Input
          label={newPasswordLabel}
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={newPasswordPlaceholder}
          fullWidth
          required
        />
        <Input
          label={confirmPasswordLabel}
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={confirmPasswordPlaceholder}
          fullWidth
          required
        />
        {error && <p className="change-password-block-error">{error}</p>}
        {success && <p className="change-password-block-success">{success}</p>}
        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Changing Password...' : submitButtonText}
        </Button>
      </form>
    </div>
  );
};
