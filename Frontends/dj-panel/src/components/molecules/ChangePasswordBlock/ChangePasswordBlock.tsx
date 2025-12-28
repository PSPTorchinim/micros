import React, { useState } from 'react';
import { useServices } from '../../../hooks/use-services/use-services';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import './ChangePasswordBlock.css';

export interface ChangePasswordBlockProps {
  title?: string;
  oldPasswordLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  submitButtonText?: string;
  oldPasswordPlaceholder?: string;
  newPasswordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  customStyles?: React.CSSProperties;
}

export const ChangePasswordBlock: React.FC<ChangePasswordBlockProps> = ({
  title = 'Change Password',
  oldPasswordLabel = 'Current Password',
  newPasswordLabel = 'New Password',
  confirmPasswordLabel = 'Confirm New Password',
  submitButtonText = 'Change Password',
  oldPasswordPlaceholder = 'Enter your current password',
  newPasswordPlaceholder = 'Enter your new password',
  confirmPasswordPlaceholder = 'Confirm your new password',
  customStyles = {},
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { usersService } = useServices();

  const validateForm = (): boolean => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (oldPassword === newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await usersService.ChangePassword(
        oldPassword,
        newPassword,
      );

      if (response.success) {
        setSuccess('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-password-block-container" style={customStyles}>
      <form className="change-password-block-form" onSubmit={handleSubmit}>
        <h1 className="change-password-block-title">{title}</h1>

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
