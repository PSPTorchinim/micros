import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import { Button } from '../../atoms/Button';
import './index.css';

interface ProfileBlockConfig {
  title?: string;
  description?: string;
  emailLabel?: string;
  usernameLabel?: string;
  changePasswordButtonText?: string;
  changePasswordUrl?: string;
  customStyles?: Record<string, unknown>;
}

export interface ProfileBlockProps extends ProfileBlockConfig {
  // This interface extends the main interface for component props
}

export const ProfileBlock: React.FC<ProfileBlockProps> = ({
  title = 'Profile',
  description = 'View and manage your profile information.',
  emailLabel = 'Email',
  changePasswordButtonText = 'Change Password',
  changePasswordUrl = '/change-password',
  customStyles = {},
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChangePassword = () => {
    void navigate(changePasswordUrl);
  };

  return (
    <div className="profile-block-container" style={customStyles}>
      <div className="profile-block-content">
        <h1 className="profile-block-title">{title}</h1>
        <p className="profile-block-description">{description}</p>

        {user ? (
          <>
            <div className="profile-block-info">
              <div className="profile-block-field">
                <label className="profile-block-label">{emailLabel}</label>
                <p className="profile-block-value">{user.email ?? 'N/A'}</p>
              </div>
            </div>
            <div className="profile-block-actions">
              <Button
                variant="outline"
                fullWidth
                onClick={handleChangePassword}
              >
                {changePasswordButtonText}
              </Button>
            </div>
          </>
        ) : (
          <p className="profile-block-error">
            No user information available. Please log in.
          </p>
        )}
      </div>
    </div>
  );
};
