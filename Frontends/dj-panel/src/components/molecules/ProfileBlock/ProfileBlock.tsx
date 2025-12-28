import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import { useServices } from '../../../hooks/use-services/use-services';
import { ContentSkeleton } from '../../atoms/Skeleton';
import type { GetUserDTO } from '../../../models/api/identity/apiMap';
import './ProfileBlock.css';

export interface ProfileBlockProps {
  title?: string;
  customStyles?: React.CSSProperties;
}

export const ProfileBlock: React.FC<ProfileBlockProps> = ({
  title = 'My Profile',
  customStyles = {},
}) => {
  const { user: contextUser } = useAuth();
  const { usersService } = useServices();
  const [user, setUser] = useState<GetUserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch fresh user data from API
        const response = await usersService.GetMe();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          // Fall back to context user
          setUser(contextUser);
        }
      } catch (err) {
        setError('Failed to load profile');
        // Fall back to context user on error
        setUser(contextUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [contextUser, usersService]);

  if (loading) {
    return <ContentSkeleton type="block" count={1} />;
  }

  if (error && !user) {
    return (
      <div className="profile-block-container" style={customStyles}>
        <div className="profile-block-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-block-container" style={customStyles}>
      <div className="profile-block-card">
        <h1 className="profile-block-title">{title}</h1>
        
        <div className="profile-block-content">
          <div className="profile-block-field">
            <label className="profile-block-label">User ID</label>
            <p className="profile-block-value">{user?.id || 'N/A'}</p>
          </div>

          <div className="profile-block-field">
            <label className="profile-block-label">Email</label>
            <p className="profile-block-value">{user?.email || 'N/A'}</p>
          </div>

          <div className="profile-block-field">
            <label className="profile-block-label">Account Status</label>
            <p className="profile-block-value">
              {user?.activated ? (
                <span className="profile-block-status-active">Active</span>
              ) : (
                <span className="profile-block-status-inactive">Inactive</span>
              )}
            </p>
          </div>

          {user?.roles && user.roles.length > 0 && (
            <div className="profile-block-field">
              <label className="profile-block-label">Roles</label>
              <div className="profile-block-roles">
                {user.roles.map((role, index) => (
                  <span key={index} className="profile-block-role-badge">
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
