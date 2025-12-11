import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../../../hooks/use-auth';

import { NavigationItem } from '../../../../models/strapi/navigation-item';
import { ConfigurationMenuEnum } from '../../../../models/strapi/strapiMap';

export const DesktopMenu = (props: any) => {
  const { token, user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const toggleDropdown = (text: string | null) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  const handleKeyDown = (event: React.KeyboardEvent, text: string | null) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown(text);
    }
  };

  const renderLinks = (links: NavigationItem[]) => {
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
                  onMouseEnter={() => toggleDropdown(element.text)}
                  onMouseLeave={() => toggleDropdown(null)}
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

  // If menu property is missing, treat all as main
  const mainLinks = props.links
    ? props.links.filter(
        (element: any) =>
          element.Menu === ConfigurationMenuEnum.Main ||
          element.Menu === undefined,
      )
    : [];
  const loginLinks = props.links
    ? props.links.filter(
        (element: any) =>
          element.Menu === ConfigurationMenuEnum.Login && element.url,
      )
    : [];

  return (
    <div data-thq="thq-navbar-nav" className="navbar-desktop-menu">
      <nav className="navbar-links">{renderLinks(mainLinks)}</nav>
      <div className="navbar-links">
        {renderLinks(loginLinks)}
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
