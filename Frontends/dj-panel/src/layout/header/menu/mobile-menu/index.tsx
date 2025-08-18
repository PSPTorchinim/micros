import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import { useAuth } from '../../../../hooks/use-auth';

export const MobileMenu = (props: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, user, logout } = useAuth();
  
    const hasPermission = (permissions: string[]) => {
      const userPermissions = user?.roles.flatMap((r) => r.permissions.map((p) => p.name)) || [];
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
        if (
          element.isAuth === undefined || // Display for all users
          (element.isAuth === true && isAuthenticated()) || // Display for logged-in users
          (element.isAuth === false && !isAuthenticated()) // Display for not logged-in users
        ) {
        return (
          <div key={element.text} className="navbar-mobile-item">
            {element.url ? (
              <Link to={element.url} className="thq-link thq-body-small">
                {element.text}
              </Link>
            ) : (
              <span className="thq-link thq-body-small">{element.text}</span>
            )}
            {element.children && (
              <div className="navbar-mobile-dropdown">{renderLinks(element.children)}</div>
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
          <nav className="navbar-mobile-links">
            {renderLinks(props.links.filter((element: any) => element.menu == 'main' && element.url))}
          </nav>
        </div>
        <div className="navbar-mobile-buttons">
        {renderLinks(props.links.filter((element: any) => element.menu == 'login' && element.url))}
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
