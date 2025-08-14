import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../../../hooks/use-auth';

export const DesktopMenu = (props: any) => {
  const { token, user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const toggleDropdown = (text: string | null) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  const handleKeyDown = (event: React.KeyboardEvent, text: string | null) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown(text);
    }
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
            <div
              key={element.text}
              className="navbar-item"
              onMouseEnter={() => toggleDropdown(element.text)}
              onMouseLeave={() => toggleDropdown(null)}
              onKeyDown={(e) => handleKeyDown(e, element.text)}
              tabIndex={0} // Make the element focusable
              aria-haspopup={!!element.children} // Indicate if it has a submenu
              aria-expanded={openDropdown === element.text} // Indicate if the submenu is open
            >
              {element.url ? (
                <Link to={element.url} className="thq-link thq-body-small">
                  {element.text}
                </Link>
              ) : (
                <span className="thq-link thq-body-small">{element.text}</span>
              )}
              {element.children && (
                <div
                  className={`navbar-dropdown ${
                    openDropdown === element.text ? 'visible' : 'hidden'
                  }`}
                  role="menu" // Indicate this is a menu
                >
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
    <div data-thq="thq-navbar-nav" className="navbar-desktop-menu">
      <nav className="navbar-links">
        {renderLinks(props.links.filter((element: any) => element.menu === 'main' && element.url))}
      </nav>
      <div className="navbar-buttons">
        {renderLinks(props.links.filter((element: any) => element.menu === 'login' && element.url))}
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
  );
};