import React from 'react';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import { Link } from 'react-router-dom';
import './DashboardBlock.css';

export interface DashboardBlockProps {
  title?: string;
  welcomeMessage?: string;
  customStyles?: React.CSSProperties;
}

export const DashboardBlock: React.FC<DashboardBlockProps> = ({
  title = 'Dashboard',
  welcomeMessage = 'Welcome to your dashboard',
  customStyles = {},
}) => {
  const { user } = useAuth();

  const quickLinks = [
    {
      title: 'Profile',
      description: 'View and manage your profile information',
      url: '/profile',
      icon: '👤',
    },
    {
      title: 'Change Password',
      description: 'Update your account password',
      url: '/change-password',
      icon: '🔒',
    },
  ];

  return (
    <div className="dashboard-block-container" style={customStyles}>
      <div className="dashboard-block-content">
        <header className="dashboard-block-header">
          <h1 className="dashboard-block-title">{title}</h1>
          <p className="dashboard-block-welcome">
            {welcomeMessage}
            {user?.email && (
              <span className="dashboard-block-user-email">, {user.email}</span>
            )}
          </p>
        </header>

        <section className="dashboard-block-stats">
          <div className="dashboard-block-stat-card">
            <div className="dashboard-block-stat-icon">📧</div>
            <div className="dashboard-block-stat-content">
              <h3 className="dashboard-block-stat-label">Email</h3>
              <p className="dashboard-block-stat-value">
                {user?.email || 'N/A'}
              </p>
            </div>
          </div>

          <div className="dashboard-block-stat-card">
            <div className="dashboard-block-stat-icon">✅</div>
            <div className="dashboard-block-stat-content">
              <h3 className="dashboard-block-stat-label">Status</h3>
              <p className="dashboard-block-stat-value">
                {user?.activated ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          <div className="dashboard-block-stat-card">
            <div className="dashboard-block-stat-icon">🎭</div>
            <div className="dashboard-block-stat-content">
              <h3 className="dashboard-block-stat-label">Roles</h3>
              <p className="dashboard-block-stat-value">
                {user?.roles?.length || 0}
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-block-quick-links">
          <h2 className="dashboard-block-section-title">Quick Links</h2>
          <div className="dashboard-block-links-grid">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                className="dashboard-block-link-card"
              >
                <div className="dashboard-block-link-icon">{link.icon}</div>
                <h3 className="dashboard-block-link-title">{link.title}</h3>
                <p className="dashboard-block-link-description">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
