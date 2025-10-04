import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentService } from '../../../services/content-service';

interface HeaderData {
  id?: number;
  logo?: {
    text?: string;
    url?: string;
    image?: {
      url?: string;
      alternativeText?: string;
    } | null;
  };
  heading?: string;
  secondaryText?: string;
  navigation?: Array<{
    text: string;
    url: string;
    external?: boolean;
    children?: Array<{
      text: string;
      url: string;
      external?: boolean;
    }>;
  }>;
  searchEnabled?: boolean;
}

export const Header: React.FC = () => {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        const data = await ContentService.getHeaderData();
        setHeaderData(data);
      } catch (error) {
        console.error('Failed to load header data:', error);
        // Set fallback data
        setHeaderData({
          logo: {
            text: 'DJ Panel',
            url: '/',
          },
          navigation: [],
          searchEnabled: false,
        });
      } finally {
        setLoading(false);
      }
    };

    loadHeaderData();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const renderLogo = () => {
    const logo = headerData?.logo;
    if (!logo) return null;

    const logoContent = (
      <>
        {logo.image?.url ? (
          <img
            src={logo.image.url}
            alt={logo.image.alternativeText || logo.text || 'Logo'}
            className="logo-image"
          />
        ) : (
          <span className="logo-text">{logo.text || 'DJ Panel'}</span>
        )}
      </>
    );

    return (
      <Link to={logo.url || '/'} className="logo" onClick={closeMobileMenu}>
        {logoContent}
      </Link>
    );
  };

  const renderNavigation = () => {
    if (!headerData?.navigation?.length) return null;

    return (
      <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-list">
          {headerData.navigation.map((item, index) => (
            <li key={index} className="nav-item">
              {item.external ? (
                <a
                  href={item.url}
                  className="nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                >
                  {item.text}
                </a>
              ) : (
                <Link
                  to={item.url}
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  {item.text}
                </Link>
              )}

              {/* Render dropdown for children */}
              {item.children && item.children.length > 0 && (
                <ul className="nav-dropdown">
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex} className="nav-dropdown-item">
                      {child.external ? (
                        <a
                          href={child.url}
                          className="nav-dropdown-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMobileMenu}
                        >
                          {child.text}
                        </a>
                      ) : (
                        <Link
                          to={child.url}
                          className="nav-dropdown-link"
                          onClick={closeMobileMenu}
                        >
                          {child.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const renderHeaderContent = () => {
    if (!headerData?.heading && !headerData?.secondaryText) return null;

    return (
      <div className="header-content">
        {headerData.heading && (
          <h1 className="header-heading">{headerData.heading}</h1>
        )}
        {headerData.secondaryText && (
          <p className="header-secondary">{headerData.secondaryText}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <header className="header header-loading">
        <div className="header-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        {renderLogo()}

        {/* Navigation */}
        {renderNavigation()}

        {/* Header Actions */}
        <div className="header-actions">
          {/* Search */}
          {headerData?.searchEnabled && (
            <div className="header-search">
              <button className="search-button" aria-label="Search">
                🔍
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {headerData?.navigation?.length && (
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Header Content Section */}
      {renderHeaderContent()}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};
