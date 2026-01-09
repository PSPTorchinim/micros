import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/use-auth/use-auth';
import {
  BrandService,
  type CompanyData,
} from '../../../services/brand-service';
import './index.css';

export interface DashboardBlock {
  title?: string;
  description?: string;
  profileSectionTitle?: string;
  companySectionTitle?: string;
  emailLabel?: string;
  usernameLabel?: string;
  customStyles?: Record<string, unknown>;
}

export const DashboardBlock: React.FC<DashboardBlock> = ({
  title = 'Dashboard',
  description = 'View all your account and company information in one place.',
  profileSectionTitle = 'Profile Information',
  companySectionTitle = 'Company Information',
  emailLabel = 'Email',
  usernameLabel = 'Username',
  customStyles = {},
}) => {
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const data = await BrandService.getCompany();
        setCompanyData(data);
      } catch (err) {
        setError('Failed to load company information');
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCompanyData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="dashboard-block-container" style={customStyles}>
      <div className="dashboard-block-content">
        <h1 className="dashboard-block-title">{title}</h1>
        <p className="dashboard-block-description">{description}</p>

        {!user ? (
          <p className="dashboard-block-error">
            No user information available. Please log in.
          </p>
        ) : (
          <div className="dashboard-block-sections">
            {/* Profile Section */}
            <div className="dashboard-block-section">
              <h2 className="dashboard-block-section-title">
                {profileSectionTitle}
              </h2>
              <div className="dashboard-block-info">
                <div className="dashboard-block-field">
                  <label className="dashboard-block-label">
                    {usernameLabel}
                  </label>
                  <p className="dashboard-block-value">
                    {user.username || 'N/A'}
                  </p>
                </div>
                <div className="dashboard-block-field">
                  <label className="dashboard-block-label">{emailLabel}</label>
                  <p className="dashboard-block-value">
                    {user.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Company Section */}
            <div className="dashboard-block-section">
              <h2 className="dashboard-block-section-title">
                {companySectionTitle}
              </h2>
              {loading ? (
                <div className="dashboard-block-loading">
                  Loading company information...
                </div>
              ) : error ? (
                <div className="dashboard-block-error">{error}</div>
              ) : companyData ? (
                <div className="dashboard-block-info">
                  {Object.entries(companyData).map(([key, value]) => (
                    <div key={key} className="dashboard-block-field">
                      <label className="dashboard-block-label">
                        {BrandService.formatFieldName(key)}
                      </label>
                      <p className="dashboard-block-value">
                        {String(value) || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-block-info">
                  <p className="dashboard-block-value">
                    No company information available
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
