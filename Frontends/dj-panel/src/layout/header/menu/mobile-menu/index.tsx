import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import { useAuth } from '../../../../hooks/use-auth';

export const MobileMenu = (props: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, user, logout } = useAuth();

  const hasPermission = (permissions: string[]) => {
    const userPermissions =
      user?.roles.flatMap((r: { permissions: any[] }) =>
        r.permissions.map((p) => p.name),
      ) || [];
    if (!permissions) return true;
    if (!userPermissions) return false;
    for (const permission of permissions) {
      if (!userPermissions.includes(permission)) return false;
    }
    return true;
  };

  const isAuthenticated = () => {
    return token !== null && token !== undefined && token !== '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderLinks = (links: any[]) => {
    return links
      .filter((element: any) => hasPermission(element.permissions))
      .map((element: any) => {
        // Check AuthState field to determine if link should be shown based on authentication
        const authState = element.AuthState || 'All';
        const shouldShow =
          authState === 'All' ||
          (authState === 'OnlyAuthenticated' && isAuthenticated()) ||
          (authState === 'OnlyUnauthenticated' && !isAuthenticated());

        if (shouldShow) {
          const hasChildren =
            Array.isArray(element.children) && element.children.length > 0;
          return (
            <div key={element.text} className="navbar-mobile-item">
              {element.url ? (
                <Link
                  to={element.url}
                  className="thq-link thq-body-small"
                  onClick={() => {
                    if (!hasChildren) setIsMenuOpen(false);
                  }}
                >
                  {element.text}
                </Link>
              ) : (
                <span className="thq-link thq-body-small">{element.text}</span>
              )}
              {hasChildren && (
                <div className="navbar-mobile-dropdown">
                  {renderLinks(element.children)}
                </div>
              )}
            </div>
          );
        }
        return null;
      });
  };

  return (
    <>
      <div
        data-thq="thq-burger-menu"
        className="navbar-burger-menu"
        onClick={toggleMenu}
      >
        <svg viewBox="0 0 1024 1024" className="navbar-mobile-icon">
          <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
        </svg>
      </div>
      <div
        data-thq="thq-mobile-menu"
        className="navbar-mobile-menu"
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <div className="navbar-mobile-nav">
          <div className="navbar-mobile-top">
            <img
              alt={props.logoAlt}
              src={props.logoSrc}
              className="navbar-mobile-logo"
            />
            <div
              data-thq="thq-close-menu"
              className="navbar-mobile-close-menu"
              onClick={toggleMenu}
            >
              <svg viewBox="0 0 1024 1024" className="navbar-mobile-icon">
                <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
              </svg>
            </div>
          </div>
          {/* If menu property is missing, treat all as main. Sort by id. */}
          <nav className="navbar-mobile-links">
            {renderLinks(
              props.links?.filter
                ? props.links
                    .filter(
                      (element: any) =>
                        (element.Menu === 'Main' ||
                          element.Menu === undefined) &&
                        element.url &&
                        element.Menu !== 'NotVisible',
                    )
                    .sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0))
                : props.links,
            )}
          </nav>
        </div>
        <div className="navbar-mobile-buttons">
          {renderLinks(
            props.links?.filter
              ? props.links
                  .filter(
                    (element: any) =>
                      element.Menu === 'Login' &&
                      element.url &&
                      element.Menu !== 'NotVisible',
                  )
                  .sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0))
              : [],
          )}
          {isAuthenticated() && (
            <Link
              to="#"
              className="thq-link thq-body-small"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Logout
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
