import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import { Button } from '../../atoms/Button';
import './index.css';

export interface ProfileBlock {
  title?: string;
  description?: string;
  emailLabel?: string;
  usernameLabel?: string;
  changePasswordButtonText?: string;
  changePasswordUrl?: string;
  customStyles?: Record<string, unknown>;
}

export const ProfileBlock: React.FC<ProfileBlock> = ({
  title = 'Profile',
  description = 'View and manage your profile information.',
  emailLabel = 'Email',
  usernameLabel = 'Username',
  changePasswordButtonText = 'Change Password',
  changePasswordUrl = '/change-password',
  customStyles = {},
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate(changePasswordUrl);
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
                <label className="profile-block-label">{usernameLabel}</label>
                <p className="profile-block-value">{user.username || 'N/A'}</p>
              </div>
              <div className="profile-block-field">
                <label className="profile-block-label">{emailLabel}</label>
                <p className="profile-block-value">{user.email || 'N/A'}</p>
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
