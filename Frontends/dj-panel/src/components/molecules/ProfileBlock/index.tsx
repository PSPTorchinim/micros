import React from 'react';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import './index.css';

export interface ProfileBlock {
  title?: string;
  description?: string;
  emailLabel?: string;
  usernameLabel?: string;
  customStyles?: Record<string, unknown>;
}

export const ProfileBlock: React.FC<ProfileBlock> = ({
  title = 'Profile',
  description = 'View and manage your profile information.',
  emailLabel = 'Email',
  usernameLabel = 'Username',
  customStyles = {},
}) => {
  const { user } = useAuth();

  return (
    <div className="profile-block-container" style={customStyles}>
      <div className="profile-block-content">
        <h1 className="profile-block-title">{title}</h1>
        <p className="profile-block-description">{description}</p>
        
        {user ? (
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
        ) : (
          <p className="profile-block-error">No user information available. Please log in.</p>
        )}
      </div>
    </div>
  );
};
